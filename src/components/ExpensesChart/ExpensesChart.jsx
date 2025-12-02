import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useExpensesData } from '../../hooks/useExpensesData';
import Loader from '../Loader/Loader';
import './ExpensesChart.css';

const ExpensesChart = () => {
  const { expensesData, totalExpenses, periodLabel, loading, error } = useExpensesData();

  // Colores pastel variados
  const COLORS = [
    '#A8DADC', // Azul pastel
    '#F4A3A8', // Rosa pastel
    '#B4A7D6', // Lavanda pastel
    '#FFD6A5', // Naranja/Durazno pastel
    '#C1E1C1', // Verde pastel
    '#F7CAC9', // Rosa claro pastel
    '#B5EAD7', // Verde menta pastel
    '#E2CFC4', // Beige pastel
    '#C7CEEA', // Azul lavanda pastel
  ];

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="expenses-tooltip">
          <p className="tooltip-category">{data.name}</p>
          <p className="tooltip-amount">{formatCurrency(data.value)}</p>
          <p className="tooltip-percentage">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Renderizar texto central en el donut
  const renderCenterText = ({ cx, cy }) => {
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fontWeight="700"
          fill="#1a1a1a"
        >
          {formatCurrency(totalExpenses)}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="500"
          fill="#666"
        >
          Total Expenses
        </text>
      </g>
    );
  };

  // Renderizar leyenda personalizada
  const renderLegend = (props) => {
    const { payload } = props;
    // Filtrar el payload para excluir el pie dummy del texto central
    const filteredPayload = payload.filter((entry) => entry.value !== 'value');
    
    return (
      <div className="custom-legend">
        {filteredPayload.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-label">{entry.value}</span>
            <span className="legend-value">{formatCurrency(entry.payload.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="expenses-chart-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="expenses-chart-container">
        <p className="error-message">Error loading expenses data</p>
      </div>
    );
  }

  if (!expensesData || expensesData.length === 0) {
    return (
      <div className="expenses-chart-container">
        <h2 className="chart-title">📊 EXPENSES BY CATEGORY</h2>
        <p className="no-data-message">No expenses for this period</p>
      </div>
    );
  }

  return (
    <div className="expenses-chart-container">
      <h2 className="chart-title">📊 EXPENSES BY CATEGORY</h2>
      <p className="period-label">{periodLabel}</p>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={expensesData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={85}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {expensesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
            data={[{ value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={0}
            fill="none"
            dataKey="value"
            isAnimationActive={false}
            label={renderCenterText}
            legendType="none"
          />
          <Tooltip 
            content={<CustomTooltip />}
            animationDuration={0}
            isAnimationActive={false}
            offset={10}
            cursor={{ fill: 'transparent' }}
          />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesChart;