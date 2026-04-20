import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartPie, House, Car, ShoppingCart, HeartPulse, Drama, Plane, ShoppingBag, Landmark, Beer, Coins } from 'lucide-react';
import { useExpensesData } from '../../hooks/useExpensesData';
import { CATEGORY_STYLES } from '../../utils/constants';
import Loader from '../Loader/Loader';
import { ErrorMessage } from '../Messages/Messages';
import './ExpensesChart.css';

const iconMap = { House, Car, ShoppingCart, HeartPulse, Drama, Plane, ShoppingBag, Landmark, Beer, Coins };

const ExpensesChart = () => {
  const { expensesData, totalExpenses, periodLabel, loading, error } = useExpensesData();

  const getColor = (name) => CATEGORY_STYLES[name]?.color || CATEGORY_STYLES['Other'].color;
  const getIcon = (name) => {
    const iconName = CATEGORY_STYLES[name]?.icon || 'Coins';
    return iconMap[iconName] || Coins;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getColor(data.name);
      const IconComp = getIcon(data.name);
      return (
        <div className="expenses-tooltip">
          <p className="tooltip-category">
            <span className="tooltip-icon" style={{ color }}>
              <IconComp size={13} strokeWidth={2} />
            </span>
            {data.name}
          </p>
          <p className="tooltip-amount" style={{ color }}>{formatCurrency(data.value)}</p>
          <p className="tooltip-percentage">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const renderCenterText = ({ cx, cy }) => (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle"
        fontSize="28" fontWeight="700" fill="#ffffff" className="center-total-amount">
        {formatCurrency(totalExpenses)}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fontWeight="500" fill="#555" className="center-total-label">
        Total expenses
      </text>
    </g>
  );

  if (loading) return <div className="expenses-chart-container"><Loader /></div>;
  if (error) return <div className="expenses-chart-container"><ErrorMessage text="Error loading expenses data" duration={null} /></div>;

  if (!expensesData || expensesData.length === 0) {
    return (
      <div className="expenses-chart-container">
        <p className="expenses-period-label">CATEGORY BREAKDOWN</p>
        <p className="no-data-message">No expenses for this period</p>
      </div>
    );
  }

  return (
    <div className="expenses-chart-container">
      <div className="expenses-header">
        <p className="expenses-period-label">CATEGORY BREAKDOWN</p>
        <p className="expenses-period-sub">{periodLabel}</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={expensesData}
            cx="50%" cy="50%"
            outerRadius={105}
            innerRadius={88}
            dataKey="value"
            paddingAngle={3}
            cornerRadius={6}
            stroke="none"
          >
            {expensesData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Pie
            data={[{ value: 1 }]}
            cx="50%" cy="50%"
            innerRadius={0} outerRadius={0}
            fill="none" dataKey="value"
            isAnimationActive={false}
            label={renderCenterText}
            legendType="none"
          />
          <Tooltip content={<CustomTooltip />} animationDuration={0} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>

      <div className="expenses-legend">
        {expensesData.map((entry) => {
          const IconComp = getIcon(entry.name);
          const color = getColor(entry.name);
          return (
            <div key={entry.name} className="expenses-legend-item">
              <div className="expenses-legend-icon" style={{ background: `${color}22`, color }}>
                <IconComp size={14} />
              </div>
              <div className="expenses-legend-info">
                <span className="expenses-legend-name">{entry.name}</span>
                <span className="expenses-legend-pct">{entry.percentage}% of expenses</span>
              </div>
              <span className="expenses-legend-value">{formatCurrency(entry.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpensesChart;