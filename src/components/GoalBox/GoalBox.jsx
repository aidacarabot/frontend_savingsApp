import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import useApiFetch from '../../hooks/useApiFetch';
import { useFinancialData } from '../../hooks/useFinancialData';
import DropDown from '../DropDown/DropDown';
import AreYouSure from '../AreYouSure/AreYouSure';
import { fetchData } from '../../utils/api/fetchData';
import './GoalBox.css';

const CircularProgress = ({ percentage, completed }) => {
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
        stroke={completed ? 'var(--color-text-tertiary)' : 'var(--color-primary)'}
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
        className={completed ? 'gb-ring-text gb-ring-text-done' : 'gb-ring-text'}
      >
        {completed ? '✓' : `${Math.round(percentage)}%`}
      </text>
    </svg>
  );
};

const GoalBox = ({ onGoalUpdated, onEditGoal }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [addAmounts, setAddAmounts] = useState({});
  const [removeAmounts, setRemoveAmounts] = useState({});

  const { responseData: goals, loading, error, refetch } = useApiFetch('/goals', 'GET');
  const { responseData: userData } = useApiFetch('/users', 'GET');
  const { available, loading: loadingFinancial, refetch: refetchFinancial } = useFinancialData();

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

  const handleAddFunds = async (goalId, amount) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const currentAmount = goal.currentAmount || 0;
      const remaining = goal.targetAmount - currentAmount;
      const safeAmount = Math.min(parseFloat(amount), remaining, Math.max(0, available));

      if (safeAmount <= 0) return;

      const newAmount = currentAmount + safeAmount;
      await fetchData(`/goals/${goalId}`, 'PUT', { currentAmount: newAmount });
      refetch();
      refetchFinancial();
      if (onGoalUpdated) onGoalUpdated();
      setAddAmounts(prev => ({ ...prev, [goalId]: '' }));
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
      refetchFinancial();
      if (onGoalUpdated) onGoalUpdated();
      setRemoveAmounts(prev => ({ ...prev, [goalId]: '' }));
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
      refetchFinancial();
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

  const sortedGoals = [...goals].sort((a, b) => {
    const aCompleted = (a.currentAmount || 0) >= a.targetAmount;
    const bCompleted = (b.currentAmount || 0) >= b.targetAmount;
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    // Among active goals: newest first (MongoDB _id encodes creation time)
    if (!aCompleted && !bCompleted) return b._id > a._id ? 1 : -1;
    return 0;
  });

  return (
    <div className="gb-list">
      {sortedGoals.map((goal) => {
        const ageAtCompletion = calculateAgeAtCompletion(goal.completionDate);
        const percentage = calculateCompletionPercentage(goal.currentAmount || 0, goal.targetAmount);
        const isCompleted = (goal.currentAmount || 0) >= goal.targetAmount;
        const currentAmount = goal.currentAmount || 0;
        const remaining = goal.targetAmount - currentAmount;
        const maxAdd = loadingFinancial ? remaining : Math.min(remaining, Math.max(0, available));
        const effectiveMonthly = Math.min(goal.monthlyContribution || 0, maxAdd);
        const noFreeBalance = !loadingFinancial && available <= 0;
        const addVal = addAmounts[goal._id] || '';
        const removeVal = removeAmounts[goal._id] || '';
        const addIsOver = addVal !== '' && parseFloat(addVal) > maxAdd && maxAdd > 0;

        return (
          <div key={goal._id} className={`gb-card${isCompleted ? ' gb-card-completed' : ''}`}>
            <div className="gb-card-header">
              <div className="gb-card-title-row">
                <h3 className="gb-card-name">{goal.goalName}</h3>
                {isCompleted && (
                  <span className="gb-completed-badge">Completed</span>
                )}
              </div>
              <DropDown
                transactionId={goal._id}
                onDeleteRequest={handleDeleteRequest}
                onEditRequest={handleEditRequest}
              />
            </div>

            <div className="gb-card-body">
              <CircularProgress percentage={percentage} completed={isCompleted} />

              <div className="gb-card-info">
                <div className="gb-card-amounts">
                  <span className={`gb-current${isCompleted ? ' gb-current-done' : ''}`}>
                    {formatCurrency(currentAmount)}
                  </span>
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

            {!isCompleted && (
              <div className="gb-actions">
                {noFreeBalance && (
                  <div className="gb-no-balance">
                    No free balance available to allocate
                  </div>
                )}
                <div className="gb-action-inputs">
                  <div className="gb-input-action gb-remove">
                    <Minus className="gb-action-symbol" size={14} />
                    <input
                      type="number"
                      value={removeVal}
                      onChange={(e) => setRemoveAmounts(prev => ({ ...prev, [goal._id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && removeVal && parseFloat(removeVal) > 0) {
                          handleRemoveFunds(goal._id, removeVal);
                        }
                      }}
                      placeholder="Remove"
                      className="gb-action-input"
                      min="0"
                      max={currentAmount}
                      step="0.01"
                    />
                    {removeVal && parseFloat(removeVal) > 0 && (
                      <button
                        className="gb-action-confirm gb-confirm-remove"
                        onClick={() => handleRemoveFunds(goal._id, removeVal)}
                      >
                        OK
                      </button>
                    )}
                  </div>

                  <button
                    className={`gb-monthly-btn${effectiveMonthly < (goal.monthlyContribution || 0) && effectiveMonthly > 0 ? ' gb-monthly-btn-partial' : ''}`}
                    onClick={() => handleAddFunds(goal._id, effectiveMonthly)}
                    disabled={maxAdd <= 0}
                    title={effectiveMonthly < (goal.monthlyContribution || 0) && effectiveMonthly > 0
                      ? `Only $${effectiveMonthly.toFixed(0)} available (monthly: $${(goal.monthlyContribution || 0).toFixed(0)})`
                      : undefined}
                  >
                    <Plus size={14} /> ${effectiveMonthly > 0 ? effectiveMonthly.toFixed(0) : (goal.monthlyContribution ? goal.monthlyContribution.toFixed(0) : '0')} monthly
                  </button>

                  <div className={`gb-input-action gb-add${maxAdd <= 0 ? ' gb-add-locked' : addIsOver ? ' gb-add-over' : ''}`}>
                    <Plus className="gb-action-symbol" size={14} />
                    <input
                      type="number"
                      value={addVal}
                      onChange={(e) => setAddAmounts(prev => ({ ...prev, [goal._id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && addVal && parseFloat(addVal) > 0 && !addIsOver) {
                          handleAddFunds(goal._id, addVal);
                        }
                      }}
                      placeholder={maxAdd <= 0 ? 'No balance' : 'Add'}
                      className={`gb-action-input${addIsOver ? ' gb-input-over' : ''}`}
                      min="0"
                      max={maxAdd}
                      step="0.01"
                      disabled={maxAdd <= 0}
                    />
                    {addIsOver && (
                      <div className="gb-add-tooltip">
                        Max ${maxAdd.toFixed(0)} free
                      </div>
                    )}
                    {addVal && parseFloat(addVal) > 0 && maxAdd > 0 && !addIsOver && (
                      <button
                        className="gb-action-confirm gb-confirm-add"
                        onClick={() => handleAddFunds(goal._id, addVal)}
                      >
                        OK
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
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
