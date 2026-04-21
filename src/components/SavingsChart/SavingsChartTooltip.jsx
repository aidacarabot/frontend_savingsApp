import { formatCurrency, formatTooltipTitle, formatPreviousPeriodLabel } from './savingsChartUtils';

const SavingsChartTooltip = ({ active, payload, viewBy }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="custom-tooltip">
      <p className="tooltip-title">{formatTooltipTitle(data.name, viewBy)}</p>

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
            <p className="tooltip-label">{formatPreviousPeriodLabel(data.name, viewBy)} Balance:</p>
            <p className="tooltip-value previous">{formatCurrency(data.previousBalance)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SavingsChartTooltip;
