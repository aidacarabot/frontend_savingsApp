import { useEffect } from 'react';
import { useFinancialData } from '../../hooks/useFinancialData';
import useApiFetch from '../../hooks/useApiFetch';
import './GoalsDistribution.css';

const GoalsDistribution = ({ refreshTrigger }) => {
  const { totalBalance, assignedToGoals, available, loading, refetch: refetchFinancial } = useFinancialData();
  const { responseData: goals, loading: goalsLoading, refetch: refetchGoals } = useApiFetch('/goals', 'GET');

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      refetchGoals();
      refetchFinancial();
    }
  }, [refreshTrigger, refetchGoals, refetchFinancial]);

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
  const completedGoals = goals?.filter(goal => goal.currentAmount >= goal.targetAmount) || [];
  const assignedPercentage = calculatePercentage(assignedToGoals, totalBalance);

  if (loading || goalsLoading) {
    return (
      <div className="gd-card">
        <div className="gd-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="gd-card">
      <div className="gd-amounts">
        <div className="gd-amount-block">
          <span className="gd-amount-value gd-accent">{formatCurrency(assignedToGoals)}</span>
          <span className="gd-amount-label">Assigned</span>
        </div>
        <span className="gd-divider">/</span>
        <div className="gd-amount-block">
          <span className="gd-amount-value">{formatCurrency(totalBalance)}</span>
          <span className="gd-amount-label">Total Balance</span>
        </div>
      </div>

      <div className="gd-bar-track">
        <div
          className="gd-bar-fill"
          style={{ width: `${assignedPercentage}%` }}
        />
      </div>

      <div className="gd-meta">
        <div className="gd-meta-item">
          <span className="gd-dot gd-dot-active" />
          <span>{activeGoals.length} Active</span>
        </div>
        <div className="gd-meta-item">
          <span className="gd-dot gd-dot-done" />
          <span>{completedGoals.length} Completed</span>
        </div>
        <div className="gd-meta-free">
          {formatCurrency(available)} free
        </div>
      </div>
    </div>
  );
};

export default GoalsDistribution;
