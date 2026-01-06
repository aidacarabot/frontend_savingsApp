import { useNavigate } from 'react-router-dom';
import useApiFetch from '../../hooks/useApiFetch';
import { useFinancialData } from '../../hooks/useFinancialData';
import Button from '../Button/Button';
import './GoalsOverview.css';

const GoalsOverview = () => {
  const navigate = useNavigate();
  const { responseData: goals, loading: goalsLoading } = useApiFetch('/goals', 'GET');
  const { available, assignedToGoals, loading: financialLoading } = useFinancialData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateCompletionPercentage = (currentAmount, targetAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  const calculateMonthsRemaining = (completionDate) => {
    if (!completionDate) return 0;
    const today = new Date();
    const goalDate = new Date(completionDate);
    const diffTime = goalDate - today;
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  if (goalsLoading || financialLoading) {
    return (
      <div className="goals-overview-container">
        <h2>YOUR GOALS</h2>
        <p>Loading goals...</p>
      </div>
    );
  }

  const activeGoals = goals?.filter(goal => goal.currentAmount < goal.targetAmount) || [];
  const completedGoals = goals?.filter(goal => goal.currentAmount >= goal.targetAmount) || [];
  const goalsToDisplay = activeGoals.slice(0, 3);

  return (
    <div className="goals-overview-container">
      <h2>🎯 MY GOALS</h2>
      
      <div className="goals-summary">
        <div className="goals-counts">
          <div className="goals-count-item">
            <span className="goal-icon">🎯</span>
            <span className="active-text">Active Goals</span>
            <span className="count-badge">[{activeGoals.length}]</span>
          </div>
          <div className="goals-count-item completed">
            <span className="goal-icon">✅</span>
            <span className="completed-text">Completed Goals</span>
            <span className="count-badge">[{completedGoals.length}]</span>
          </div>
        </div>
        
        <div className="goals-balance">
          <span className="balance-icon">💰</span>
          <span className="assigned-amount">{formatCurrency(assignedToGoals)} assigned</span>
          <span className="separator">•</span>
          <span className="available-amount">{formatCurrency(available)} unassigned</span>
        </div>
      </div>

      {goalsToDisplay.length === 0 ? (
        <div className="no-goals-message">
          <p>No active goals yet. Start saving for your dreams!</p>
        </div>
      ) : (
        <div className="goals-preview">
          {goalsToDisplay.map((goal) => {
            const percentage = calculateCompletionPercentage(goal.currentAmount || 0, goal.targetAmount);
            const monthsRemaining = calculateMonthsRemaining(goal.completionDate);

            return (
              <div key={goal._id} className="goal-card">
                <div className="goal-card-header">
                  <span className="goal-name">{goal.goalName}</span>
                </div>

                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="goal-percentage">
                  {percentage.toFixed(0)}%
                </div>

                <div className="goal-amounts">
                  {formatCurrency(goal.currentAmount || 0)}/{formatCurrency(goal.targetAmount)}
                </div>

                <div className="goal-time-remaining">
                  <span className="calendar-icon">📅</span>
                  <span>{monthsRemaining} {monthsRemaining === 1 ? 'month' : 'months'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button 
        text="Manage All Goals →"
        onClick={() => navigate('/goals')}
      />
    </div>
  );
};

export default GoalsOverview;