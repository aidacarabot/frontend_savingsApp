import { useState } from 'react';
import useApiFetch from '../../hooks/useApiFetch';
import DropDown from '../DropDown/DropDown';
import AreYouSure from '../AreYouSure/AreYouSure';
import Button from '../Button/Button';
import { fetchData } from '../../utils/api/fetchData';
import './GoalBox.css';

const GoalBox = ({ onGoalUpdated, onEditGoal }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [removeAmount, setRemoveAmount] = useState('');
  
  // Obtener goals y datos del usuario
  const { responseData: goals, loading, error, refetch } = useApiFetch('/goals', 'GET');
  const { responseData: userData } = useApiFetch('/users', 'GET');

  // Calcular la edad al completar el goal
  const calculateAgeAtCompletion = (completionDate) => {
    if (!completionDate || !userData?.birthDate) return 0;
    
    const birthDate = new Date(userData.birthDate);
    const goalDate = new Date(completionDate);
    
    let age = goalDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = goalDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && goalDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calcular el porcentaje de completitud
  const calculateCompletionPercentage = (currentAmount, targetAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  // Toggle expanded goal allocation
  const toggleAllocation = (goalId) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
    setAddAmount('');
    setRemoveAmount('');
  };

  // Manejar adición de fondos
  const handleAddFunds = async (goalId, amount) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const newAmount = (goal.currentAmount || 0) + parseFloat(amount);
      
      await fetchData(`/goals/${goalId}`, 'PUT', {
        currentAmount: newAmount
      });
      
      refetch();
      if (onGoalUpdated) onGoalUpdated();
      setAddAmount('');
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };

  // Manejar retiro de fondos
  const handleRemoveFunds = async (goalId, amount) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const newAmount = Math.max(0, (goal.currentAmount || 0) - parseFloat(amount));
      
      await fetchData(`/goals/${goalId}`, 'PUT', {
        currentAmount: newAmount
      });
      
      refetch();
      if (onGoalUpdated) onGoalUpdated();
      setRemoveAmount('');
    } catch (error) {
      console.error('Error removing funds:', error);
    }
  };

  // Manejar solicitud de eliminación
  const handleDeleteRequest = (goalId) => {
    setGoalToDelete(goalId);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      await fetchData(`/goals/${goalToDelete}`, 'DELETE');
      setShowDeleteConfirm(false);
      setGoalToDelete(null);
      refetch();
      if (onGoalUpdated) onGoalUpdated();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setGoalToDelete(null);
  };

  // Manejar solicitud de edición
  const handleEditRequest = (goalId) => {
    const goal = goals.find((g) => g._id === goalId);
    if (goal && onEditGoal) {
      onEditGoal(goal);
    }
  };

  if (loading) return <div className="goals-loading">Loading goals...</div>;
  if (error) return <div className="goals-error">Error loading goals: {error.message}</div>;
  if (!goals || goals.length === 0) return <div className="no-goals">No goals created yet.</div>;

  return (
    <div className="goal-box-container">
      {goals.map((goal) => {
        const ageAtCompletion = calculateAgeAtCompletion(goal.completionDate);
        const completionPercentage = calculateCompletionPercentage(goal.currentAmount || 0, goal.targetAmount);
        const isExpanded = expandedGoalId === goal._id;
        
        return (
          <div key={goal._id} className="goal-card-modern">
            {/* Header */}
            <div className="goal-card-header">
              <div className="goal-title-section">
                <h3 className="goal-title">{goal.goalName}</h3>
              </div>
              <DropDown 
                transactionId={goal._id}
                onDeleteRequest={handleDeleteRequest}
                onEditRequest={handleEditRequest}
              />
            </div>

            <div className="goal-divider"></div>

            {/* Stats Cards */}
            <div className="goal-stats-grid">
              <div className="stat-card">
                <span className="stat-icon">💸</span>
                <span className="stat-label">Monthly Needed</span>
                <span className="stat-value">
                  ${goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0'}/mo
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-icon">📅</span>
                <span className="stat-label">Completion Date</span>
                <span className="stat-value">
                  {goal.completionDate 
                    ? new Date(goal.completionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Not set'
                  }
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-icon">🎂</span>
                <span className="stat-label">Age at Goal</span>
                <span className="stat-value">
                  {ageAtCompletion > 0 ? `${ageAtCompletion} years` : '--'}
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="goal-progress-section">
              <div className="progress-info">
                <span className="progress-text">Progress: ${(goal.currentAmount || 0).toFixed(0)}/${goal.targetAmount.toFixed(0)}</span>
                <span className="progress-percentage-text">{completionPercentage.toFixed(0)}% Complete</span>
              </div>
              
              <div className="progress-bar-modern">
                <div 
                  className="progress-fill-modern"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Manage Goal Allocation Button */}
            <Button 
              text="Manage Goal Allocation"
              onClick={() => toggleAllocation(goal._id)}
              className="manage-allocation-btn"
            />

            {/* Allocation Actions (expandible) */}
            {isExpanded && (
              <div className="allocation-actions">
                <div className="allocation-buttons-row">
                  {/* Add Custom Amount Button */}
                  <div className="btn-with-input btn-add-wrapper">
                    <span className="btn-input-label">Add $</span>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && addAmount && parseFloat(addAmount) > 0) {
                          handleAddFunds(goal._id, addAmount);
                        }
                      }}
                      className="allocation-input-inline"
                      min="0"
                      step="0.01"
                    />
                    {addAmount && parseFloat(addAmount) > 0 && (
                      <Button
                        text="✓"
                        onClick={() => handleAddFunds(goal._id, addAmount)}
                        className="btn-add-custom-inline"
                      />
                    )}
                  </div>

                  {/* Add Monthly Button - Center */}
                  <Button
                    text={`Add $${goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0'}`}
                    onClick={() => handleAddFunds(goal._id, goal.monthlyContribution || 0)}
                    className="btn-add-monthly-center"
                  />

                  {/* Delete Custom Amount Button */}
                  <div className="btn-with-input btn-delete-wrapper">
                    <span className="btn-input-label">Delete $</span>
                    <input
                      type="number"
                      value={removeAmount}
                      onChange={(e) => setRemoveAmount(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && removeAmount && parseFloat(removeAmount) > 0) {
                          handleRemoveFunds(goal._id, removeAmount);
                        }
                      }}
                      className="allocation-input-inline"
                      min="0"
                      step="0.01"
                    />
                    {removeAmount && parseFloat(removeAmount) > 0 && (
                      <Button
                        text="✓"
                        onClick={() => handleRemoveFunds(goal._id, removeAmount)}
                        className="btn-remove-custom-inline"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal de confirmación de eliminación */}
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