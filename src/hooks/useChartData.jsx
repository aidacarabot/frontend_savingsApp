import { useMemo } from 'react';
import { useFinancialContext } from '../context/FinancialContext';
import useApiFetch from './useApiFetch';

export const useChartData = () => {
  const { viewBy } = useFinancialContext();
  const { responseData: userData, loading, error } = useApiFetch('/users');

  const chartData = useMemo(() => {
    if (!userData || !userData.transactions) {
      return { current: [], previous: [], loading, error };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calcular balance inicial (todas las transacciones antes del periodo)
    const calculateInitialBalance = (beforeDate) => {
      return userData.transactions
        .filter((t) => new Date(t.date) < beforeDate)
        .reduce((balance, t) => {
          return t.type === 'Income' 
            ? balance + t.amount 
            : balance - t.amount;
        }, 0);
    };

    // Función para agrupar transacciones por fecha
    const groupByDate = (transactions, groupBy) => {
      const grouped = {};

      transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        let key;

        if (groupBy === 'day') {
          key = date.getDate();
        } else if (groupBy === 'month') {
          key = date.getMonth();
        } else if (groupBy === 'year') {
          key = date.getFullYear();
        }

        if (!grouped[key]) {
          grouped[key] = { income: 0, expenses: 0 };
        }

        if (transaction.type === 'Income') {
          grouped[key].income += transaction.amount;
        } else if (transaction.type === 'Expense') {
          grouped[key].expenses += transaction.amount;
        }
      });

      return grouped;
    };

    let currentData = [];
    let xAxisLabel = '';

    switch (viewBy) {
      case 'Month': {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        xAxisLabel = monthNames[currentMonth];

        // Balance inicial del mes actual (antes del día 1)
        const monthStart = new Date(currentYear, currentMonth, 1);
        let currentAccumulatedBalance = calculateInitialBalance(monthStart);

        // Balance inicial del mes anterior (antes del día 1 del mes anterior)
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const previousMonthStart = new Date(previousYear, previousMonth, 1);
        let previousAccumulatedBalance = calculateInitialBalance(previousMonthStart);

        // Transacciones del mes actual
        const currentMonthTransactions = userData.transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
        });

        // Transacciones del mes anterior
        const previousMonthTransactions = userData.transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getFullYear() === previousYear && date.getMonth() === previousMonth;
        });

        const currentGrouped = groupByDate(currentMonthTransactions, 'day');
        const previousGrouped = groupByDate(previousMonthTransactions, 'day');

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const current = currentGrouped[day] || { income: 0, expenses: 0 };
          const previous = previousGrouped[day] || { income: 0, expenses: 0 };

          const periodSavings = current.income - current.expenses;
          const previousPeriodSavings = previous.income - previous.expenses;

          // Acumular para cada día
          currentAccumulatedBalance += periodSavings;
          previousAccumulatedBalance += previousPeriodSavings;

          currentData.push({
            name: day.toString(),
            balance: currentAccumulatedBalance,
            previousBalance: previousAccumulatedBalance,
            periodIncome: current.income,
            periodExpenses: current.expenses,
            periodSavings: periodSavings,
          });
        }
        break;
      }

      case 'Year': {
        xAxisLabel = currentYear.toString();

        // Balance inicial del año actual
        const yearStart = new Date(currentYear, 0, 1);
        let currentAccumulatedBalance = calculateInitialBalance(yearStart);

        // Balance inicial del año anterior
        const previousYearStart = new Date(currentYear - 1, 0, 1);
        let previousAccumulatedBalance = calculateInitialBalance(previousYearStart);

        // Transacciones del año actual
        const currentYearTransactions = userData.transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getFullYear() === currentYear;
        });

        // Transacciones del año anterior
        const previousYearTransactions = userData.transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getFullYear() === currentYear - 1;
        });

        const currentGrouped = groupByDate(currentYearTransactions, 'month');
        const previousGrouped = groupByDate(previousYearTransactions, 'month');

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let month = 0; month < 12; month++) {
          const current = currentGrouped[month] || { income: 0, expenses: 0 };
          const previous = previousGrouped[month] || { income: 0, expenses: 0 };

          const periodSavings = current.income - current.expenses;
          const previousPeriodSavings = previous.income - previous.expenses;

          currentAccumulatedBalance += periodSavings;
          previousAccumulatedBalance += previousPeriodSavings;

          currentData.push({
            name: monthNames[month],
            balance: currentAccumulatedBalance,
            previousBalance: previousAccumulatedBalance,
            periodIncome: current.income,
            periodExpenses: current.expenses,
            periodSavings: periodSavings,
          });
        }
        break;
      }

      case 'All-Time': {
        xAxisLabel = 'All-Time';

        const grouped = groupByDate(userData.transactions, 'year');
        const years = Object.keys(grouped).map(Number).sort((a, b) => a - b);

        let accumulatedBalance = 0;

        years.forEach((year) => {
          const data = grouped[year];
          const periodSavings = data.income - data.expenses;
          accumulatedBalance += periodSavings;

          currentData.push({
            name: year.toString(),
            balance: accumulatedBalance,
            periodIncome: data.income,
            periodExpenses: data.expenses,
            periodSavings: periodSavings,
          });
        });
        break;
      }

      default:
        break;
    }

    return {
      current: currentData,
      xAxisLabel,
      loading: false,
      error: null,
    };
  }, [userData, viewBy, loading, error]);

  return chartData;
};