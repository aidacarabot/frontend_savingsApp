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

  // Filtrar transacciones según el periodo
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

  // Calcular totales de un conjunto de transacciones
  const calculateTotals = (transactions) => {
    const income = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, savings: income - expenses };
  };

  // Calcular cambio porcentual
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const financialData = useMemo(() => {
    if (!userData || !userData.transactions) {
      return { 
        savings: 0, 
        income: 0, 
        expenses: 0,
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

    // Calcular totales del periodo actual
    const currentTotals = calculateTotals(currentTransactions);

    // Calcular Savings acumulado total (All-Time)
    const allTimeIncome = userData.transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const allTimeExpenses = userData.transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = allTimeIncome - allTimeExpenses;

    // Calcular comparaciones (si no es All-Time y hay datos previos)
    if (viewBy !== 'All-Time') {
      if (previousTransactions.length > 0) {
        const previousTotals = calculateTotals(previousTransactions);

        // Comparación de Savings
        savingsComparison = {
          percentage: calculatePercentageChange(
            currentTotals.savings,
            previousTotals.savings
          ),
          isPositive: currentTotals.savings >= previousTotals.savings
        };

        // Comparación de Income
        incomeComparison = {
          percentage: calculatePercentageChange(
            currentTotals.income,
            previousTotals.income
          ),
          isPositive: currentTotals.income >= previousTotals.income
        };

        // Comparación de Expenses (MENOS gastos = positivo)
        expensesComparison = {
          percentage: calculatePercentageChange(
            currentTotals.expenses,
            previousTotals.expenses
          ),
          isPositive: currentTotals.expenses < previousTotals.expenses
        };
      } else {
        // No hay datos del periodo anterior
        savingsComparison = { noData: true };
        incomeComparison = { noData: true };
        expensesComparison = { noData: true };
      }
    }

    return {
      savings,
      income: currentTotals.income,
      expenses: currentTotals.expenses,
      savingsComparison,
      incomeComparison,
      expensesComparison,
      loading: false,
      error: null
    };
  }, [userData, viewBy, loading, error]);

  return financialData;
};