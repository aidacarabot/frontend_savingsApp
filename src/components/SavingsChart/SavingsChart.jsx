import { useFinancialContext } from '../../context/FinancialContext';
import { useChartData } from '../../hooks/useChartData';
import Loader from '../Loader/Loader';
import { ErrorMessage } from '../Messages/Messages';
import SavingsChartGraphs from './SavingsChartGraphs';
import { formatCurrency, getLegendNames } from './savingsChartUtils';
import './SavingsChart.css';

const SavingsChart = () => {
  const { viewBy } = useFinancialContext();
  const { current, loading, error } = useChartData();

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
        <ErrorMessage text="Error loading chart data" duration={null} />
      </div>
    );
  }

  const legendNames = getLegendNames(viewBy);
  const isEmpty = !current || current.length === 0;
  const currentTotal = isEmpty ? 0 : current[current.length - 1].balance;

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

      {isEmpty ? (
        <p className="no-data-message">No data available for this period</p>
      ) : (
        <SavingsChartGraphs data={current} viewBy={viewBy} />
      )}
    </div>
  );
};

export default SavingsChart;