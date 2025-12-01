import { useMemo, useEffect } from 'react';
import { useFinancialContext } from '../context/FinancialContext';
import useApiFetch from './useApiFetch';

export const useFinancialData = () => {
  const { viewBy, refreshTrigger } = useFinancialContext();
  const { responseData: userData, loading, error, refetch } = useApiFetch('/users');

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const filterTransactionsByPeriod = (transactions, year, month = null) => {
    if (!transactions || transactions.length === 0) return [];

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      if (month !== null) {
        return transactionYear === year && transactionMonth === month;
      } else {
        return transactionYear === year;
      }
    });
  };

  const calculateTotals = (transactions) => {
    const income = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const financialData = useMemo(() => {
    if (!userData || !userData.transactions) {
      return { 
        totalBalance: 0,
        available: 0,
        assignedToGoals: 0,
        savings: 0, 
        income: 0, 
        expenses: 0,
        balanceComparison: null,
        savingsComparison: null,
        incomeComparison: null,
        expensesComparison: null,
        loading, 
        error 
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let currentTransactions = [];
    let previousTransactions = [];
    let balanceComparison = null;
    let savingsComparison = null;
    let incomeComparison = null;
    let expensesComparison = null;

    switch (viewBy) {
      case 'Month': {
        currentTransactions = filterTransactionsByPeriod(
          userData.transactions, 
          currentYear, 
          currentMonth
        );

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        previousTransactions = filterTransactionsByPeriod(
          userData.transactions,
          previousYear,
          previousMonth
        );
        break;
      }

      case 'Year': {
        currentTransactions = filterTransactionsByPeriod(
          userData.transactions,
          currentYear
        );

        previousTransactions = filterTransactionsByPeriod(
          userData.transactions,
          currentYear - 1
        );
        break;
      }

      case 'All-Time':
      default: {
        currentTransactions = userData.transactions;
        break;
      }
    }

    const currentTotals = calculateTotals(currentTransactions);

    const allTimeIncome = userData.transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const allTimeExpenses = userData.transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = allTimeIncome - allTimeExpenses;

    const assignedToGoals = userData.goals
      ? userData.goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
      : 0;

    const available = totalBalance - assignedToGoals;

    const savings = currentTotals.balance;

    if (viewBy !== 'All-Time') {
      if (previousTransactions.length > 0) {
        const previousTotals = calculateTotals(previousTransactions);

        balanceComparison = {
          percentage: calculatePercentageChange(totalBalance, totalBalance - currentTotals.balance),
          isPositive: currentTotals.balance >= 0,
          previousValue: totalBalance - currentTotals.balance
        };

        savingsComparison = {
          percentage: calculatePercentageChange(
            currentTotals.balance,
            previousTotals.balance
          ),
          isPositive: currentTotals.balance >= previousTotals.balance,
          previousValue: previousTotals.balance
        };

        incomeComparison = {
          percentage: calculatePercentageChange(
            currentTotals.income,
            previousTotals.income
          ),
          isPositive: currentTotals.income >= previousTotals.income,
          previousValue: previousTotals.income
        };

        expensesComparison = {
          percentage: calculatePercentageChange(
            currentTotals.expenses,
            previousTotals.expenses
          ),
          isPositive: currentTotals.expenses < previousTotals.expenses,
          previousValue: previousTotals.expenses
        };
      } else {
        balanceComparison = { noData: true };
        savingsComparison = { noData: true };
        incomeComparison = { noData: true };
        expensesComparison = { noData: true };
      }
    }

    return {
      totalBalance,
      available,
      assignedToGoals,
      savings,
      income: currentTotals.income,
      expenses: currentTotals.expenses,
      balanceComparison,
      savingsComparison,
      incomeComparison,
      expensesComparison,
      loading: false,
      error: null
    };
  }, [userData, viewBy, loading, error]);

  return financialData;
};