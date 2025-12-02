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

  // Formatear el título del tooltip según el periodo
  const formatTooltipTitle = (name) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    switch (viewBy) {
      case 'Month': {
        // name es el día (número)
        const date = new Date(currentYear, currentMonth, parseInt(name));
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      
      case 'Year': {
        // name es el mes abreviado (Jan, Feb, etc.)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = monthNames.indexOf(name);
        const date = new Date(currentYear, monthIndex, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      
      case 'All-Time': {
        // name es el año
        return name;
      }
      
      default:
        return name;
    }
  };

  // Formatear el título del periodo anterior en el tooltip
  const formatPreviousPeriodLabel = (name) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    switch (viewBy) {
      case 'Month': {
        // name es el día (número)
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const date = new Date(previousYear, previousMonth, parseInt(name));
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      
      case 'Year': {
        // name es el mes abreviado (Jan, Feb, etc.)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = monthNames.indexOf(name);
        const date = new Date(currentYear - 1, monthIndex, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      
      default:
        return name;
    }
  };

  // Obtener nombres de los periodos para la leyenda
  const getLegendNames = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    switch (viewBy) {
      case 'Month': {
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return {
          current: `${monthNames[currentMonth]} ${currentYear}`,
          previous: `${monthNames[previousMonth]} ${previousYear}`
        };
      }
      
      case 'Year': {
        return {
          current: `${currentYear}`,
          previous: `${currentYear - 1}`
        };
      }
      
      case 'All-Time': {
        return {
          current: 'Balance',
          previous: ''
        };
      }
      
      default:
        return {
          current: 'Current Period',
          previous: 'Previous Period'
        };
    }
  };

  // Tooltip personalizado con detalle del periodo
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{formatTooltipTitle(data.name)}</p>
          
          <div className="tooltip-section">
            <p className="tooltip-label">Total Balance:</p>
            <p className="tooltip-value balance">{formatCurrency(data.balance)}</p>
          </div>

          <div className="tooltip-divider"></div>

          <div className="tooltip-section">
            <p className="tooltip-label">Details:</p>
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
                <p className="tooltip-label">{formatPreviousPeriodLabel(data.name)} Balance:</p>
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

  const legendNames = getLegendNames();

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
              domain={[0, 'dataMax + 500']}
              allowDataOverflow={false}
              label={{ value: '$', angle: 0, position: 'insideTopLeft', style: { fontWeight: 600, fill: '#333' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="balance" 
              fill="#4CAF50" 
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
              domain={[0, 'dataMax + 500']}
              allowDataOverflow={false}
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
              name={legendNames.current}
              radius={[8, 8, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="previousBalance" 
              stroke="#9E9E9E" 
              name={legendNames.previous}
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