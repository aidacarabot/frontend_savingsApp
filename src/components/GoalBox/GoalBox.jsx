import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import useApiFetch from '../../hooks/useApiFetch';
import { useFinancialData } from '../../hooks/useFinancialData';
import AreYouSure from '../AreYouSure/AreYouSure';
import Loader from '../Loader/Loader';
import GoalCard from './GoalCard';
import useGoalActions from '../../hooks/useGoalActions';
import './GoalBox.css';

const GoalBox = ({ onGoalUpdated, onEditGoal, refreshTrigger }) => {
  const [addAmounts, setAddAmounts] = useState({});
  const [removeAmounts, setRemoveAmounts] = useState({});
  const [expandedGoals, setExpandedGoals] = useState({});

  const { responseData: goals, loading, error, refetch } = useApiFetch('/goals', 'GET');
  const { responseData: userData } = useApiFetch('/users', 'GET');
  const { available, loading: loadingFinancial, refetch: refetchFinancial } = useFinancialData();

  const {
    setLocalGoals, displayGoals,
    showDeleteConfirm,
    handleAddFunds, handleRemoveFunds,
    handleDeleteRequest, handleCancelDelete, handleConfirmDelete,
    handleEditRequest,
  } = useGoalActions({ goals, available, refetch, refetchFinancial, onGoalUpdated, onEditGoal });

  useEffect(() => {
    if (refreshTrigger > 0) { setLocalGoals(null); refetch(); }
  }, [refreshTrigger, refetch, setLocalGoals]);

  if (loading && !displayGoals) return <Loader />;
  if (error && !displayGoals) return <div className="gb-status gb-error">Error loading goals</div>;
  if (!displayGoals || displayGoals.length === 0) return (
    <div className="gb-empty">
      <Target size={40} color="var(--color-primary)" strokeWidth={1.5} />
      <p className="gb-empty-title">No goals yet</p>
      <p className="gb-empty-subtitle">Create your first goal and start saving towards it</p>
    </div>
  );

  const sorted = [...displayGoals].sort((a, b) => {
    const aC = (a.currentAmount || 0) >= a.targetAmount;
    const bC = (b.currentAmount || 0) >= b.targetAmount;
    if (aC !== bC) return aC ? 1 : -1;
    return b._id > a._id ? 1 : -1;
  });

  const activeGoals = sorted.filter(g => (g.currentAmount || 0) < g.targetAmount);
  const completedGoals = sorted.filter(g => (g.currentAmount || 0) >= g.targetAmount);

  const renderGoalCard = (goal) => {
    const isCompleted = (goal.currentAmount || 0) >= goal.targetAmount;
    const isExpanded = isCompleted ? (expandedGoals[goal._id] ?? false) : true;
    return (
      <GoalCard
        key={goal._id}
        goal={goal}
        available={available}
        loadingFinancial={loadingFinancial}
        addVal={addAmounts[goal._id] || ''}
        removeVal={removeAmounts[goal._id] || ''}
        onAddValChange={(val) => setAddAmounts(prev => ({ ...prev, [goal._id]: val }))}
        onRemoveValChange={(val) => setRemoveAmounts(prev => ({ ...prev, [goal._id]: val }))}
        isExpanded={isExpanded}
        onToggleExpand={() => setExpandedGoals(prev => ({ ...prev, [goal._id]: !prev[goal._id] }))}
        onAddFunds={(id, val) => handleAddFunds(id, val, setAddAmounts)}
        onRemoveFunds={(id, val) => handleRemoveFunds(id, val, setRemoveAmounts)}
        onDeleteRequest={handleDeleteRequest}
        onEditRequest={handleEditRequest}
        birthDate={userData?.birthDate}
      />
    );
  };

  return (
    <div className="gb-list">
      {activeGoals.length > 0 ? activeGoals.map(renderGoalCard) : (
        <div className="gb-empty">
          <Target size={40} color="var(--color-primary)" strokeWidth={1.5} />
          <p className="gb-empty-title">No active goals</p>
          <p className="gb-empty-subtitle">You don't have any active goals. Create one to start saving.</p>
        </div>
      )}
      {completedGoals.length > 0 && (
        <>
          <div className="gb-section-divider">
            <span className="gb-section-divider-label">Completed</span>
          </div>
          {completedGoals.map(renderGoalCard)}
        </>
      )}
      {showDeleteConfirm && (
        <AreYouSure
          message="Are you sure you want to delete this goal? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default GoalBox;
