import { useCurrentDate } from '../../hooks/useCurrentDate';
import { useFinancialContext } from '../../context/FinancialContext';
import { useFinancialData } from '../../hooks/useFinancialData';
import Loader from '../Loader/Loader';
import './CurrentData.css';

const CurrentData = () => {
  const currentDate = useCurrentDate();
  const { viewBy } = useFinancialContext();
  const { 
    totalBalance,
    available,
    assignedToGoals,
    savings, 
    income, 
    expenses, 
    balanceComparison,
    savingsComparison,
    incomeComparison, 
    expensesComparison, 
    loading, 
    error 
  } = useFinancialData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPeriodText = () => {
    switch (viewBy) {
      case 'Month': return 'This Month';
      case 'Year': return 'This Year';
      case 'All-Time': return 'All Time';
      default: return viewBy;
    }
  };

  const getComparisonText = () => {
    switch (viewBy) {
      case 'Month': return 'vs. Last Month';
      case 'Year': return 'vs. Last Year';
      default: return '';
    }
  };

  const ComparisonBadge = ({ comparison, label, isExpense = false }) => {
    if (!comparison) return null;

    if (comparison.noData) {
      return (
        <div className="comparison-badge no-data">
          <span className="no-data-text">No data available</span>
        </div>
      );
    }

    const percentage = Math.abs(comparison.percentage).toFixed(1);
    const isPositive = comparison.isPositive;

    let triangle = '▲';
    if (isExpense) {
      triangle = isPositive ? '▼' : '▲';
    } else {
      triangle = isPositive ? '▲' : '▼';
    }

    return (
      <div className="comparison-container">
        <div className={`comparison-badge ${isPositive ? 'positive' : 'negative'}`}>
          <span className="triangle">{triangle}</span>
          <span className="percentage">{percentage}%</span>
          <span className="comparison-label">{label}</span>
        </div>
        {comparison.previousValue !== undefined && (
          <div className="previous-value">
            Previous: {formatCurrency(comparison.previousValue)}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="current-data-container">
        <div className="date-section">Today is {currentDate}</div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="current-data-container">
        <div className="date-section">Today is {currentDate}</div>
        <div className="financial-data">
          <p className="error-message">Error loading financial data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="current-data-container">
      <div className="date-section">
        Today is {currentDate}
      </div>
      
      <div className="financial-data">
        <div id="balance-section" className="data-card">
          <h3>💰 Total Balance</h3>
          <p className="amount">{formatCurrency(totalBalance)}</p>
          <div className="balance-details">
            <div className="balance-item">
              <span className="label">Available:</span>
              <span className="value">{formatCurrency(available)}</span>
            </div>
            <div className="balance-item">
              <span className="label">In Goals:</span>
              <span className="value">{formatCurrency(assignedToGoals)}</span>
            </div>
          </div>
          <ComparisonBadge 
            comparison={balanceComparison} 
            label={getComparisonText()} 
          />
        </div>

        <div id="savings-section" className="data-card">
          <h3>🎯 Your Savings</h3>
          <p className="amount">{formatCurrency(savings)}</p>
          <small>{getPeriodText()}</small>
          <ComparisonBadge 
            comparison={savingsComparison} 
            label={getComparisonText()} 
          />
        </div>
        
        <div id="income-section" className="data-card">
          <h3>📈 Your Income</h3>
          <p className="amount">+{formatCurrency(income)}</p>
          <small>{getPeriodText()}</small>
          <ComparisonBadge 
            comparison={incomeComparison} 
            label={getComparisonText()} 
          />
        </div>
        
        <div id="expenses-section" className="data-card">
          <h3>📉 Your Expenses</h3>
          <p className="amount">-{formatCurrency(expenses)}</p>
          <small>{getPeriodText()}</small>
          <ComparisonBadge 
            comparison={expensesComparison} 
            label={getComparisonText()}
            isExpense={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentData;