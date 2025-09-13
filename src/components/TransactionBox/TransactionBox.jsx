import { useState, useEffect } from 'react';
import './TransactionBox.css';
import { fetchData } from '../../utils/api/fetchData';
import Loader from '../Loader/Loader';
import DropDown from '../DropDown/DropDown';
import getTransactionImage from '../../utils/getTransactionImage';
import { ErrorMessage } from '../Messages/Messages';
import AreYouSure from '../AreYouSure/AreYouSure';
import IncomeExpenseForm from '../IncomeExpenseForm/IncomeExpenseForm';

const TransactionBox = ({ refresh, view = 'All', filters = {} }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //? estados para confirmación y edición
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [showAreYouSure, setShowAreYouSure] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

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

  //? peticiones de dropDown
  const handleDeleteRequest = (transactionId) => {
    setDeleteCandidateId(transactionId);
    setShowAreYouSure(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidateId) {
      setShowAreYouSure(false);
      return;
    }
    try {
      await fetchData(`/transactions/${deleteCandidateId}`, 'DELETE');
      setTransactions((prev) => prev.filter((t) => t._id !== deleteCandidateId));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    } finally {
      setShowAreYouSure(false);
      setDeleteCandidateId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowAreYouSure(false);
    setDeleteCandidateId(null);
  };

  const handleEditRequest = (transactionId) => {
    const tx = transactions.find((t) => t._id === transactionId);
    if (tx) {
      setEditingTransaction(tx);
    }
  };

  const handleEditClose = () => {
    setEditingTransaction(null);
  };

  const handleTransactionUpdated = (updatedTx) => {
    // actualizar en la lista local
    setTransactions((prev) =>
      prev.map((t) => (t._id === updatedTx._id ? updatedTx : t))
    );
    setEditingTransaction(null);
  };

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage text="Transactions are currently unavailable. Get in touch with support." duration={5000} />;
  }

  return (
    <div className="transaction-box">
      {showAreYouSure && (
        <AreYouSure
          message="Are you sure you want to delete this transaction?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {editingTransaction && (
        <IncomeExpenseForm
          initialData={editingTransaction}
          onClose={handleEditClose}
          onTransactionUpdated={handleTransactionUpdated}
        />
      )}

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
                transactionId={transaction._id}
                onDeleteRequest={handleDeleteRequest}
                onEditRequest={handleEditRequest}
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