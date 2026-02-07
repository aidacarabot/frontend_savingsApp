import { useState, useEffect, useRef, useCallback } from 'react';
import './TransactionBox.css';
import { fetchData } from '../../utils/api/fetchData';
import Loader from '../Loader/Loader';
import DropDown from '../DropDown/DropDown';
import { CATEGORY_STYLES } from '../../utils/constants';
import { ErrorMessage } from '../Messages/Messages';
import { 
  House, Car, ShoppingCart, HeartPulse, Drama, Plane, 
  Rss, ShoppingBag, GraduationCap, Gift, Landmark, Beer, 
  Coins, Wallet, TrendingUp, User, ChartNoAxesCombined 
} from 'lucide-react';
import AreYouSure from '../AreYouSure/AreYouSure';
import IncomeExpenseForm from '../IncomeExpenseForm/IncomeExpenseForm';

const TransactionBox = ({ refresh, view = 'All', filters = {} }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);
  const observerRef = useRef();

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
    setDisplayCount(20);
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
      if (view === 'Expenses' && tx.type !== 'Expense') return false;
      if (view === 'Income' && tx.type !== 'Income') return false;

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

      if (filters.priceMin != null) {
        if (Number(tx.amount) < Number(filters.priceMin)) return false;
      }
      if (filters.priceMax != null) {
        if (Number(tx.amount) > Number(filters.priceMax)) return false;
      }

      if (filters.category) {
        if (!tx.category) return false;
        if (tx.category !== filters.category) return false;
      }

      return true;
    });
  };

  const filteredTransactions = applyFilters(transactions);

  //? Callback para el intersection observer
  const lastTransactionElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayCount < filteredTransactions.length) {
          setDisplayCount((prev) => Math.min(prev + 20, filteredTransactions.length));
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, displayCount, filteredTransactions.length]
  );

  //? Función para obtener el estilo de la categoría
  const getCategoryStyle = (transaction) => {
    const key = transaction.category || transaction.type;
    return CATEGORY_STYLES[key] || CATEGORY_STYLES['Other ❓'];
  };

  //? Mapa de iconos
  const iconMap = {
    House, Car, ShoppingCart, HeartPulse, Drama, Plane,
    Rss, ShoppingBag, GraduationCap, Gift, Landmark, Beer,
    Coins, Wallet, TrendingUp, User, ChartNoAxesCombined
  };

  //? Función para obtener el componente de icono
  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Coins;
  };

  //? Agrupar transacciones por fecha
  const groupByDate = (items) => {
    const grouped = {};
    items.forEach((tx) => {
      const date = new Date(tx.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(tx);
    });
    return grouped;
  };

  const groupedTransactions = groupByDate(filteredTransactions.slice(0, displayCount));

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
        Object.keys(groupedTransactions).map((date, dateIndex) => (
          <div key={date} className="transaction-group">
            <div className="transaction-date-header">{date}</div>
            {groupedTransactions[date].map((transaction, txIndex) => {
              const style = getCategoryStyle(transaction);
              const IconComponent = getIconComponent(style.icon);
              const isLastTransaction = dateIndex === Object.keys(groupedTransactions).length - 1 && 
                                       txIndex === groupedTransactions[date].length - 1;
              return (
              <div 
                key={transaction._id} 
                className="transaction-item"
                ref={isLastTransaction ? lastTransactionElementRef : null}
              >
                <div className="transaction-icon-wrapper">
                  <div className="transaction-icon-circle" style={{ backgroundColor: style.color }}>
                    <IconComponent className="transaction-icon" strokeWidth={2} />
                  </div>
                </div>
                <div className="transaction-details">
                  <h3 className="transaction-name">{transaction.name}</h3>
                  <p className="transaction-category">
                    {transaction.category || transaction.type}
                  </p>
                </div>
                <div className="transaction-right">
                  <p className={transaction.type === 'Income' ? 'income-amount' : 'expense-amount'}>
                    {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <DropDown
                    transactionId={transaction._id}
                    onDeleteRequest={handleDeleteRequest}
                    onEditRequest={handleEditRequest}
                  />
                </div>
              </div>
            );
            })}
          </div>
        ))
      ) : (
        <ErrorMessage text="No transactions yet." duration={5000} />
      )}
    </div>
  );
};

export default TransactionBox;