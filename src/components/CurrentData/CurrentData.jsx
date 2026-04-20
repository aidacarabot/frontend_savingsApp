import { PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useFinancialContext } from '../../context/FinancialContext';
import { useFinancialData } from '../../hooks/useFinancialData';
import Loader from '../Loader/Loader';
import { ErrorMessage } from '../Messages/Messages';
import './CurrentData.css';

const CurrentData = () => {
  const { viewBy } = useFinancialContext();
  const { 
    totalBalance,
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
      return <p className="comparison-pct no-data">No previous data</p>;
    }

    const percentage = Math.abs(comparison.percentage).toFixed(1);
    const isPositive = comparison.isPositive;
    const triangle = isExpense ? (isPositive ? '▼' : '▲') : (isPositive ? '▲' : '▼');

    return (
      <p className="comparison-pct">
        {triangle} {percentage}% {label}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="current-data-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="current-data-container">
        <div className="financial-data">
          <ErrorMessage text="Error loading financial data. Please try again." duration={null} />
        </div>
      </div>
    );
  }

  return (
    <div className="current-data-container">
      <div className="financial-data">

        <div id="balance-section" className="data-card">
          <div className="data-card-icon"><Wallet size={20} /></div>
          <div className="card-content">
            <h3>Current Balance</h3>
            <p className="amount">{formatCurrency(totalBalance)}</p>
            <ComparisonBadge comparison={balanceComparison} label={getComparisonText()} />
            {balanceComparison?.previousValue !== undefined && (
              <div className="previous-pill">Previous balance: {formatCurrency(balanceComparison.previousValue)}</div>
            )}
          </div>
        </div>

        <div id="savings-section" className="data-card">
          <div className="data-card-icon"><PiggyBank size={20} /></div>
          <div className="card-content">
            <h3>Savings</h3>
            <p className="amount">{formatCurrency(savings)}</p>
            <ComparisonBadge comparison={savingsComparison} label={getComparisonText()} />
            {savingsComparison?.previousValue !== undefined && (
              <div className="previous-pill">Previous savings: {formatCurrency(savingsComparison.previousValue)}</div>
            )}
          </div>
        </div>

        <div id="income-section" className="data-card">
          <div className="data-card-icon"><TrendingUp size={20} /></div>
          <div className="card-content">
            <h3>Income</h3>
            <p className="amount">{income !== 0 ? '+' : ''}{formatCurrency(income)}</p>
            <ComparisonBadge comparison={incomeComparison} label={getComparisonText()} />
            {incomeComparison?.previousValue !== undefined && (
              <div className="previous-pill">Previous income: {formatCurrency(incomeComparison.previousValue)}</div>
            )}
          </div>
        </div>

        <div id="expenses-section" className="data-card">
          <div className="data-card-icon"><TrendingDown size={20} /></div>
          <div className="card-content">
            <h3>Expenses</h3>
            <p className="amount">{expenses !== 0 ? '-' : ''}{formatCurrency(expenses)}</p>
            <ComparisonBadge comparison={expensesComparison} label={getComparisonText()} isExpense={true} />
            {expensesComparison?.previousValue !== undefined && (
              <div className="previous-pill">Previous expenses: {formatCurrency(expensesComparison.previousValue)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentData;