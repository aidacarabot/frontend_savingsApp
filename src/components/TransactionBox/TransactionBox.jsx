import { useState, useEffect } from 'react';
import './TransactionBox.css';
import { fetchData } from '../../utils/api/fetchData';
import Loader from '../Loader/Loader';
import DropDown from '../DropDown/DropDown';
import getTransactionImage from '../../utils/getTransactionImage';
import { ErrorMessage } from '../Messages/Messages';


const TransactionBox = ({ refresh, view = 'All', filters = {} }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //? Función para obtener las transacciones
  const fetchTransactions = async () => {
    try {
      const response = await fetchData('/transactions', 'GET');
      setTransactions(response); // Actualiza el estado con las transacciones obtenidas
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  //? useEffect para cargar las transacciones al montar el componente
  useEffect(() => {
    // cada vez que cambia `refresh` (o al montar), volvemos a pedir las transacciones
    setLoading(true);
    fetchTransactions();
  }, [refresh]);

  //? Filtrado aplicado en cliente
    const applyFilters = (items) => {
    return items.filter((tx) => {
      // view filter
      if (view === 'Expenses' && tx.type !== 'Expense') return false;
      if (view === 'Income' && tx.type !== 'Income') return false;

      // date range filter
      if (filters.dateFrom) {
        const txDate = new Date(tx.date).setHours(0,0,0,0);
        const from = new Date(filters.dateFrom).setHours(0,0,0,0);
        if (txDate < from) return false;
      }
      if (filters.dateTo) {
        const txDate = new Date(tx.date).setHours(0,0,0,0);
        const to = new Date(filters.dateTo).setHours(0,0,0,0);
        if (txDate > to) return false;
      }

      // price range filter (aplica tanto a Income como Expense cuando se define)
      if (filters.priceMin != null) {
        if (Number(tx.amount) < Number(filters.priceMin)) return false;
      }
      if (filters.priceMax != null) {
        if (Number(tx.amount) > Number(filters.priceMax)) return false;
      }

      // category filter (solo aplica para expenses; si backend guarda null para income)
      if (filters.category) {
        if (!tx.category) return false;
        if (tx.category !== filters.category) return false;
      }

      return true;
    });
  };

  const filteredTransactions = applyFilters(transactions);


  //? Función para eliminar una transacción del estado local
  const handleDeleteTransaction = (transactionId) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction._id !== transactionId) // Cambia a transaction.id si el backend usa id
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage text="Transactions are currently unavailable. Get in touch with support." duration={5000} />;
  }

  return (
    <div className="transaction-box">
      {filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="transaction-item"
          >
            <div className="transaction-category-div">
              <img
                src={getTransactionImage(transaction.type, transaction.category)}
                alt={`${transaction.type} - ${transaction.category}`}
                className="transaction-image"
              />
              {transaction.category ? (
                <p className="transaction-category">Expense - {transaction.category}</p>
              ) : (
                <p className="transaction-category">{transaction.type}</p>
              )}
            </div>
            <div className="transaction-details-div">
              <h3 className="transaction-name">{transaction.name}</h3>
              <p className="transaction-date">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="transaction-amount-div">
              <p
                className={
                  transaction.type === 'Income'
                    ? 'income-amount'
                    : transaction.type === 'Expense'
                    ? 'expense-amount'
                    : ''
                }
              >
                {transaction.type === 'Income' ? '+' : transaction.type === 'Expense' ? '-' : ''}
                ${transaction.amount.toFixed(2)}
              </p>
              <DropDown
                transactionId={transaction._id} // Cambia a transaction.id si el backend usa id
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        ))
      ) : (
        <ErrorMessage text="No transactions yet created." duration={5000} />
      )}
    </div>
  );
};

export default TransactionBox;