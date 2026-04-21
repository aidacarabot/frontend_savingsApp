import { useState } from 'react';
import { fetchData } from '../utils/api/fetchData';
import { fireConfetti, updateGoalAmount } from '../components/GoalBox/goalBoxUtils';

const useGoalActions = ({ goals, available, refetch, refetchFinancial, onGoalUpdated, onEditGoal }) => {
  const [localGoals, setLocalGoals] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const displayGoals = localGoals ?? goals;

  const handleAddFunds = async (goalId, amount, setAddAmounts) => {
    try {
      const goal = displayGoals.find(g => g._id === goalId);
      const currentAmount = goal.currentAmount || 0;
      const safeAmount = Math.min(parseFloat(amount), goal.targetAmount - currentAmount, Math.max(0, available));
      if (safeAmount <= 0) return;
      const newAmount = currentAmount + safeAmount;
      const justCompleted = newAmount >= goal.targetAmount && currentAmount < goal.targetAmount;
      setLocalGoals(displayGoals.map(g => g._id === goalId ? { ...g, currentAmount: newAmount } : g));
      setAddAmounts(prev => ({ ...prev, [goalId]: '' }));
      const adjustedDate = await updateGoalAmount(goal, newAmount, fetchData);
      if (adjustedDate) setLocalGoals(prev => prev?.map(g => g._id === goalId ? { ...g, completionDate: adjustedDate } : g));
      if (justCompleted) fireConfetti();
      refetchFinancial();
      if (onGoalUpdated) onGoalUpdated();
    } catch (err) {
      console.error('Error adding funds:', err);
      setLocalGoals(null);
      refetch();
    }
  };

  const handleRemoveFunds = async (goalId, amount, setRemoveAmounts) => {
    try {
      const goal = displayGoals.find(g => g._id === goalId);
      const newAmount = Math.max(0, (goal.currentAmount || 0) - parseFloat(amount));
      setLocalGoals(displayGoals.map(g => g._id === goalId ? { ...g, currentAmount: newAmount } : g));
      setRemoveAmounts(prev => ({ ...prev, [goalId]: '' }));
      const adjustedDate = await updateGoalAmount(goal, newAmount, fetchData);
      if (adjustedDate) setLocalGoals(prev => prev?.map(g => g._id === goalId ? { ...g, completionDate: adjustedDate } : g));
      refetchFinancial();
      if (onGoalUpdated) onGoalUpdated();
    } catch (err) {
      console.error('Error removing funds:', err);
      setLocalGoals(null);
      refetch();
    }
  };

  const handleDeleteRequest = (goalId) => { setGoalToDelete(goalId); setShowDeleteConfirm(true); };
  const handleCancelDelete = () => { setShowDeleteConfirm(false); setGoalToDelete(null); };
  const handleConfirmDelete = async () => {
    try {
      await fetchData(`/goals/${goalToDelete}`, 'DELETE');
      setShowDeleteConfirm(false);
      setGoalToDelete(null);
      setLocalGoals(null);
      refetch();
      refetchFinancial();
      if (onGoalUpdated) onGoalUpdated();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const handleEditRequest = (goalId) => {
    const goal = goals?.find(g => g._id === goalId);
    if (goal && onEditGoal) onEditGoal(goal);
  };

  return {
    localGoals, setLocalGoals,
    displayGoals,
    showDeleteConfirm,
    handleAddFunds, handleRemoveFunds,
    handleDeleteRequest, handleCancelDelete, handleConfirmDelete,
    handleEditRequest,
  };
};

export default useGoalActions;
