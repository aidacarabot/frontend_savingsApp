import { useFinancialData } from '../../hooks/useFinancialData';
import useApiFetch from '../../hooks/useApiFetch';
import './GoalsDistribution.css';

const GoalsDistribution = () => {
  const { totalBalance, assignedToGoals, available, loading } = useFinancialData();
  const { responseData: goals, loading: goalsLoading } = useApiFetch('/goals', 'GET');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentage = (amount, total) => {
    if (!total || total <= 0) return 0;
    return Math.round((amount / total) * 100);
  };

  const activeGoals = goals?.filter(goal => goal.currentAmount < goal.targetAmount) || [];
  const assignedPercentage = calculatePercentage(assignedToGoals, totalBalance);
  const availablePercentage = calculatePercentage(available, totalBalance);

  if (loading || goalsLoading) {
    return (
      <div className="goals-distribution-container">
        <div className="distribution-loading">Loading distribution...</div>
      </div>
    );
  }

  return (
    <div className="goals-distribution-container">
      {/* Header */}
      <div className="distribution-header">
        <div className="header-left">
          <span className="header-icon">🎯</span>
          <h2>My Financial Goals</h2>
        </div>
        <div className="header-right">
          <span className="active-indicator"></span>
          <span className="active-text">Active Goals [{activeGoals.length}]</span>
        </div>
      </div>

      <div className="distribution-divider"></div>

      {/* Distribution Section */}
      <div className="distribution-content">
        <div className="distribution-title">
          <span className="distribution-icon">📊</span>
          <h3>Distribution</h3>
        </div>

        <div className="distribution-stats">
          <div className="stat-item assigned">
            <div className="stat-header">
              <span className="stat-emoji">💚</span>
              <span className="stat-label">Assigned to Goals:</span>
            </div>
            <div className="stat-value">
              <span className="amount">{formatCurrency(assignedToGoals)}</span>
              <span className="percentage">({assignedPercentage}%)</span>
            </div>
          </div>

          <div className="stat-item unassigned">
            <div className="stat-header">
              <span className="stat-emoji">💙</span>
              <span className="stat-label">Unassigned (Free):</span>
            </div>
            <div className="stat-value">
              <span className="amount">{formatCurrency(available)}</span>
              <span className="percentage">({availablePercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="distribution-bar">
          <div 
            className="bar-assigned"
            style={{ width: `${assignedPercentage}%` }}
          >
            {assignedPercentage > 15 && (
              <span className="bar-label">{assignedPercentage}%</span>
            )}
          </div>
          <div 
            className="bar-available"
            style={{ width: `${availablePercentage}%` }}
          >
            {availablePercentage > 15 && (
              <span className="bar-label">{availablePercentage}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsDistribution;