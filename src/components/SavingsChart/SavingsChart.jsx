import { BarChart, Bar, LabelList, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts';
import { useFinancialContext } from '../../context/FinancialContext';
import { useChartData } from '../../hooks/useChartData';
import Loader from '../Loader/Loader';
import './SavingsChart.css';

const SavingsChart = () => {
  const { viewBy } = useFinancialContext();
  const { current, loading, error } = useChartData();

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
            <p className="tooltip-label">Savings:</p>
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
              Net Change: <span>{formatCurrency(data.periodSavings)}</span>
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
  const currentTotal = current.length > 0 ? current[current.length - 1].balance : 0;

  return (
    <div className="savings-chart-container">
      <div className="chart-header">
        <p className="chart-period-label">
          SAVINGS {viewBy === 'Month' ? 'THIS MONTH' : viewBy === 'Year' ? 'THIS YEAR' : 'ALL TIME'}
        </p>
        <p className="chart-total">{formatCurrency(currentTotal)}</p>
        <div className="chart-legend-inline">
          <span className="legend-dot-current" />
          <span className="legend-name">{legendNames.current}</span>
          {viewBy !== 'All-Time' && (
            <>
              <span className="legend-dot-previous" />
              <span className="legend-name muted">{legendNames.previous}</span>
            </>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {viewBy === 'All-Time' ? (
          <BarChart data={current} margin={{ top: 24, right: 16, left: 16, bottom: 10 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2BEBC8" stopOpacity={1} />
                <stop offset="100%" stopColor="#2BEBC8" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#444" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="balance" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="balance" position="top" formatter={(v) => v >= 1000 ? `$${(v/1000).toFixed(1)}k` : `$${v}`} style={{ fill: '#2BEBC8', fontSize: 10, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        ) : (
          <ComposedChart data={current} margin={{ top: 10, right: 16, left: 16, bottom: 10 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2BEBC8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2BEBC8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#444" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#2BEBC8"
              strokeWidth={2}
              fill="url(#savingsGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#2BEBC8', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="previousBalance"
              stroke="#555"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 3, fill: '#555', strokeWidth: 0 }}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;