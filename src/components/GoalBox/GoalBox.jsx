import { useState } from 'react';
import useApiFetch from '../../hooks/useApiFetch';
import DropDown from '../DropDown/DropDown';
import AreYouSure from '../AreYouSure/AreYouSure';
import { fetchData } from '../../utils/api/fetchData';
import './GoalBox.css';

const CircularProgress = ({ percentage }) => {
  const radius = 44;
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={radius * 2} height={radius * 2} className="gb-ring">
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        className="gb-ring-progress"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="gb-ring-text"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};

const GoalBox = ({ onGoalUpdated, onEditGoal }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [removeAmount, setRemoveAmount] = useState('');

  const { responseData: goals, loading, error, refetch } = useApiFetch('/goals', 'GET');
  const { responseData: userData } = useApiFetch('/users', 'GET');

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

  const calculateCompletionPercentage = (currentAmount, targetAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleAllocation = (goalId) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
    setAddAmount('');
    setRemoveAmount('');
  };

  const handleAddFunds = async (goalId, amount) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const newAmount = (goal.currentAmount || 0) + parseFloat(amount);
      await fetchData(`/goals/${goalId}`, 'PUT', { currentAmount: newAmount });
      refetch();
      if (onGoalUpdated) onGoalUpdated();
      setAddAmount('');
    } catch (err) {
      console.error('Error adding funds:', err);
    }
  };

  const handleRemoveFunds = async (goalId, amount) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const newAmount = Math.max(0, (goal.currentAmount || 0) - parseFloat(amount));
      await fetchData(`/goals/${goalId}`, 'PUT', { currentAmount: newAmount });
      refetch();
      if (onGoalUpdated) onGoalUpdated();
      setRemoveAmount('');
    } catch (err) {
      console.error('Error removing funds:', err);
    }
  };

  const handleDeleteRequest = (goalId) => {
    setGoalToDelete(goalId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetchData(`/goals/${goalToDelete}`, 'DELETE');
      setShowDeleteConfirm(false);
      setGoalToDelete(null);
      refetch();
      if (onGoalUpdated) onGoalUpdated();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setGoalToDelete(null);
  };

  const handleEditRequest = (goalId) => {
    const goal = goals.find((g) => g._id === goalId);
    if (goal && onEditGoal) onEditGoal(goal);
  };

  if (loading) return <div className="gb-status">Loading goals...</div>;
  if (error) return <div className="gb-status gb-error">Error loading goals</div>;
  if (!goals || goals.length === 0) return <div className="gb-status">No goals created yet.</div>;

  return (
    <div className="gb-list">
      {goals.map((goal) => {
        const ageAtCompletion = calculateAgeAtCompletion(goal.completionDate);
        const percentage = calculateCompletionPercentage(goal.currentAmount || 0, goal.targetAmount);
        const isExpanded = expandedGoalId === goal._id;

        return (
          <div key={goal._id} className="gb-card">
            <div className="gb-card-header">
              <h3 className="gb-card-name">{goal.goalName}</h3>
              <DropDown
                transactionId={goal._id}
                onDeleteRequest={handleDeleteRequest}
                onEditRequest={handleEditRequest}
              />
            </div>

            <div className="gb-card-body">
              <CircularProgress percentage={percentage} />

              <div className="gb-card-info">
                <div className="gb-card-amounts">
                  <span className="gb-current">{formatCurrency(goal.currentAmount || 0)}</span>
                  <span className="gb-separator">/</span>
                  <span className="gb-target">{formatCurrency(goal.targetAmount)}</span>
                </div>

                <div className="gb-card-stats">
                  <div className="gb-stat">
                    <span className="gb-stat-label">Monthly</span>
                    <span className="gb-stat-value">
                      ${goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0'}/mo
                    </span>
                  </div>
                  <div className="gb-stat">
                    <span className="gb-stat-label">Deadline</span>
                    <span className="gb-stat-value">
                      {goal.completionDate
                        ? new Date(goal.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : '--'}
                    </span>
                  </div>
                  <div className="gb-stat">
                    <span className="gb-stat-label">Age</span>
                    <span className="gb-stat-value">
                      {ageAtCompletion > 0 ? `${ageAtCompletion} yrs` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="gb-actions">
              <div className="gb-action-row">
                <div className="gb-input-action gb-remove">
                  <span className="gb-action-symbol">-</span>
                  <input
                    type="number"
                    value={removeAmount}
                    onChange={(e) => setRemoveAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && removeAmount && parseFloat(removeAmount) > 0) {
                        handleRemoveFunds(goal._id, removeAmount);
                      }
                    }}
                    placeholder="0"
                    className="gb-action-input"
                    min="0"
                    step="0.01"
                  />
                  {removeAmount && parseFloat(removeAmount) > 0 && (
                    <button
                      className="gb-action-confirm gb-confirm-remove"
                      onClick={() => handleRemoveFunds(goal._id, removeAmount)}
                    >
                      OK
                    </button>
                  )}
                </div>

                <button
                  className="gb-monthly-btn"
                  onClick={() => handleAddFunds(goal._id, goal.monthlyContribution || 0)}
                >
                  + ${goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0'}
                </button>

                <div className="gb-input-action gb-add">
                  <span className="gb-action-symbol">+</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && addAmount && parseFloat(addAmount) > 0) {
                        handleAddFunds(goal._id, addAmount);
                      }
                    }}
                    placeholder="0"
                    className="gb-action-input"
                    min="0"
                    step="0.01"
                  />
                  {addAmount && parseFloat(addAmount) > 0 && (
                    <button
                      className="gb-action-confirm gb-confirm-add"
                      onClick={() => handleAddFunds(goal._id, addAmount)}
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

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
