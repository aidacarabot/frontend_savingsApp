import { useState, useEffect } from 'react';
import './TransactionBox.css';
import { fetchData } from '../../utils/api/fetchData';
import Loader from '../Loader/Loader';
import DropDown from '../DropDown/DropDown';
import getTransactionImage from '../../utils/getTransactionImage';


const TransactionBox = () => {
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
    fetchTransactions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>; //! CREAR MENSAJE DE ERROR
  }

  return (
    <div className="transaction-box">
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <div
            key={transaction.id || `transaction-${index}`} // Usa el id o un fallback único
            className="transaction-item"
          >
            <div className="transaction-category-div">
              <img
                src={getTransactionImage(transaction.type, transaction.category)} // Usar la función normal
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
              <DropDown />
            </div>
          </div>
        ))
      ) : (
        <p>No transactions yet created.</p> //! crear message error
      )}
    </div>
  );
};

export default TransactionBox;