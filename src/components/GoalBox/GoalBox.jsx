import { useState } from 'react';
import useApiFetch from '../../hooks/useApiFetch';
import DropDown from '../DropDown/DropDown';
import AreYouSure from '../AreYouSure/AreYouSure';
import { fetchData } from '../../utils/api/fetchData';
import './GoalBox.css';

const GoalBox = ({ onGoalUpdated, onEditGoal }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  
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
      refetch(); // Recargar los goals
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
        
        return (
          <div key={goal._id} className="goal-box">
            <div className="goal-header">
              <h3 className="goal-name">{goal.goalName}</h3>
              <DropDown 
                transactionId={goal._id}
                onDeleteRequest={handleDeleteRequest}
                onEditRequest={handleEditRequest}
              />
            </div>

            <div className="goal-details">
              <div className="goal-info-item">
                <span className="goal-label">Monthly Contribution Needed:</span>
                <span className="goal-value">
                  ${goal.monthlyContribution ? goal.monthlyContribution.toFixed(2) : '0.00'}
                </span>
              </div>

              <div className="goal-info-item">
                <span className="goal-label">Completion Date:</span>
                <span className="goal-value">
                  {goal.completionDate 
                    ? new Date(goal.completionDate).toLocaleDateString()
                    : 'Not set'
                  }
                </span>
              </div>

              <div className="goal-info-item">
                <span className="goal-label">Age at Goal Completion:</span>
                <span className="goal-value">
                  {ageAtCompletion > 0 ? `${ageAtCompletion} years` : 'Not calculated'}
                </span>
              </div>
            </div>

            <div className="goal-progress">
              <div className="progress-header">
                <span className="progress-label">Progress</span>
                <span className="progress-amount">
                  ${(goal.currentAmount || 0).toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              <div className="progress-percentage">
                {completionPercentage.toFixed(1)}% Complete
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <AreYouSure
            message="Are you sure you want to delete this goal? This action cannot be undone."
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      )}
    </div>
  );
};

export default GoalBox;