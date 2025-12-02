import { useMemo } from 'react';
import { useFinancialContext } from '../context/FinancialContext';
import useApiFetch from './useApiFetch';

export const useExpensesData = () => {
  const { viewBy } = useFinancialContext();
  const { responseData: userData, loading, error } = useApiFetch('/users');

  const expensesData = useMemo(() => {
    if (!userData || !userData.transactions) {
      return { expensesData: [], totalExpenses: 0, periodLabel: '', loading, error };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let filteredTransactions = [];
    let periodLabel = '';

    switch (viewBy) {
      case 'Month': {
        periodLabel = `${monthNames[currentMonth]} ${currentYear}`;
        filteredTransactions = userData.transactions.filter((t) => {
          const date = new Date(t.date);
          return (
            t.type === 'Expense' &&
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth
          );
        });
        break;
      }

      case 'Year': {
        periodLabel = `${currentYear}`;
        filteredTransactions = userData.transactions.filter((t) => {
          const date = new Date(t.date);
          return t.type === 'Expense' && date.getFullYear() === currentYear;
        });
        break;
      }

      case 'All-Time': {
        periodLabel = 'All Time';
        filteredTransactions = userData.transactions.filter((t) => t.type === 'Expense');
        break;
      }

      default:
        break;
    }

    // Agrupar por categoría
    const categoryTotals = {};
    filteredTransactions.forEach((transaction) => {
      const category = transaction.category || 'Other';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += transaction.amount;
    });

    // Calcular total
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    // Convertir a array para el gráfico
    const chartData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value); // Ordenar de mayor a menor

    return {
      expensesData: chartData,
      totalExpenses,
      periodLabel,
      loading: false,
      error: null
    };
  }, [userData, viewBy, loading, error]);

  return expensesData;
};