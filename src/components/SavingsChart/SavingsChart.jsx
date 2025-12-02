import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { useFinancialContext } from '../../context/FinancialContext';
import { useChartData } from '../../hooks/useChartData';
import Loader from '../Loader/Loader';
import './SavingsChart.css';

const SavingsChart = () => {
  const { viewBy } = useFinancialContext();
  const { current, xAxisLabel, loading, error } = useChartData();

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Tooltip personalizado con detalle del periodo
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{`${getPeriodLabel()}: ${data.name}`}</p>
          
          <div className="tooltip-section">
            <p className="tooltip-label">Accumulated Balance:</p>
            <p className="tooltip-value balance">{formatCurrency(data.balance)}</p>
          </div>

          <div className="tooltip-divider"></div>

          <div className="tooltip-section">
            <p className="tooltip-label">Period Details:</p>
            <p className="tooltip-detail income">
              Income: <span>{formatCurrency(data.periodIncome)}</span>
            </p>
            <p className="tooltip-detail expense">
              Expenses: <span>{formatCurrency(data.periodExpenses)}</span>
            </p>
            <p className="tooltip-detail savings">
              Savings: <span>{formatCurrency(data.periodSavings)}</span>
            </p>
          </div>

          {viewBy !== 'All-Time' && data.previousBalance !== undefined && (
            <>
              <div className="tooltip-divider"></div>
              <div className="tooltip-section">
                <p className="tooltip-label">Previous Period:</p>
                <p className="tooltip-value previous">{formatCurrency(data.previousBalance)}</p>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Formatear el eje Y con $ al final
  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return `${value}`;
  };

  const getPeriodLabel = () => {
    switch (viewBy) {
      case 'Month': return 'Day';
      case 'Year': return 'Month';
      case 'All-Time': return 'Year';
      default: return 'Period';
    }
  };

  if (loading) {
    return (
      <div className="savings-chart-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="savings-chart-container">
        <p className="error-message">Error loading chart data</p>
      </div>
    );
  }

  if (!current || current.length === 0) {
    return (
      <div className="savings-chart-container">
        <h2 className="chart-title">📊 SAVINGS OVER TIME</h2>
        <p className="no-data-message">No data available for this period</p>
      </div>
    );
  }

  return (
    <div className="savings-chart-container">
      <h2 className="chart-title">📊 SAVINGS OVER TIME</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        {viewBy === 'All-Time' ? (
          <BarChart
            data={current}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              style={{ fontSize: '0.875rem' }}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10, style: { fontWeight: 600, fill: '#333' } }}
            />
            <YAxis 
              stroke="#666"
              tickFormatter={formatYAxis}
              style={{ fontSize: '0.875rem' }}
              domain={[0, 'auto']}
              label={{ value: '$', angle: 0, position: 'insideTopLeft', style: { fontWeight: 600, fill: '#333' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="balance" 
              fill="#4CAF50" 
              name="Balance"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        ) : (
          <ComposedChart
            data={current}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              style={{ fontSize: '0.875rem' }}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10, style: { fontWeight: 600, fill: '#333' } }}
            />
            <YAxis 
              stroke="#666"
              tickFormatter={formatYAxis}
              style={{ fontSize: '0.875rem' }}
              domain={[0, 'auto']}
              label={{ value: '$', angle: 0, position: 'insideTopLeft', style: { fontWeight: 600, fill: '#333' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="balance" 
              fill="#4CAF50" 
              name="Current Period"
              radius={[8, 8, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="previousBalance" 
              stroke="#9E9E9E" 
              name="Previous Period"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;