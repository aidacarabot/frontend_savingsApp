import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, CalendarClock } from 'lucide-react';
import useApiFetch from '../../hooks/useApiFetch';
import { useFinancialData } from '../../hooks/useFinancialData';
import Loader from '../Loader/Loader';
import Button from '../Button/Button';
import './GoalsOverview.css';

const GoalsOverview = () => {
  const navigate = useNavigate();
  const { responseData: goals, loading: goalsLoading } = useApiFetch('/goals', 'GET');
  const { available, assignedToGoals, totalBalance, loading: financialLoading } = useFinancialData();

  const fmt = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const pct = (current, target) => {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const monthsLeft = (completionDate) => {
    if (!completionDate) return null;
    const diff = Math.ceil((new Date(completionDate) - new Date()) / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diff);
  };

  if (goalsLoading || financialLoading) {
    return <div className="go-container"><Loader /></div>;
  }

  const allGoals = goals || [];
  const activeGoals = allGoals.filter(g => (g.currentAmount || 0) < g.targetAmount);
  const completedGoals = allGoals.filter(g => (g.currentAmount || 0) >= g.targetAmount);
  const totalAssigned = assignedToGoals || 0;
  const totalAvailable = available || 0;
  const assignedPct = (totalAssigned + totalAvailable) > 0
    ? (totalAssigned / (totalAssigned + totalAvailable)) * 100
    : 0;

  return (
    <div className="go-container">
      {}
      <div className="go-header">
        <p className="go-label"> GOALS OVERVIEW</p>
        <Button className="go-view-all" onClick={() => navigate('/goals')} text={<>View all <ArrowRight size={12} /></>} />
      </div>

      {}
      <div className="go-counts">
        <span className="go-count-chip go-count-active">
          <span className="go-pulse-dot" />
          {activeGoals.length} active
        </span>
        <span className="go-count-chip">
          <Trophy size={9} strokeWidth={2} />
          {completedGoals.length} completed
        </span>
      </div>

      {}
      <div className="go-balance-block">
        <div className="go-balance-main">
          <p className="go-balance-label">Total balance</p>
          <p className="go-balance-value">{fmt(totalBalance || 0)}</p>
        </div>
        <div className="go-alloc-track">
          <div className="go-alloc-fill" style={{ width: `${assignedPct}%` }} />
        </div>
        <div className="go-balance-sub">
          <div className="go-sub-card">
            <p className="go-sub-label">Assigned</p>
            <p className="go-sub-value">{fmt(totalAssigned)}</p>
          </div>
          <div className="go-sub-card go-sub-card--accent">
            <p className="go-sub-label">Available</p>
            <p className="go-sub-value go-sub-value--accent">{fmt(totalAvailable)}</p>
          </div>
        </div>
      </div>

      {}
      {activeGoals.length === 0 ? (
        <div className="go-empty">
          <Trophy size={24} strokeWidth={1.5} />
          <p>No active goals</p>
        </div>
      ) : (
        <div className="go-goals-scroll">
          <div className="go-goals-grid">
            {activeGoals.map((goal) => {
              const p = pct(goal.currentAmount || 0, goal.targetAmount);
              const mo = monthsLeft(goal.completionDate);
              const radius = 28;
              const stroke = 3;
              const nr = radius - stroke;
              const circ = nr * 2 * Math.PI;
              const offset = circ - (p / 100) * circ;
              return (
                <div key={goal._id} className="go-goal-card">
                  <svg width={radius * 2} height={radius * 2} className="go-ring-svg">
                    <circle cx={radius} cy={radius} r={nr} fill="none" stroke="#1e1e1e" strokeWidth={stroke} />
                    <circle
                      cx={radius} cy={radius} r={nr} fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth={stroke} strokeLinecap="round"
                      strokeDasharray={`${circ} ${circ}`}
                      strokeDashoffset={offset}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="go-ring-text">
                      {Math.round(p)}%
                    </text>
                  </svg>
                  <span className="go-goal-card-name">{goal.goalName}</span>
                  {mo !== null && (
                    <span className="go-goal-card-months"><CalendarClock size={9} /> {mo}mo</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsOverview;
