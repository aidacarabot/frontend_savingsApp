import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";
import './Transactions.css';


const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('All'); // 'All' | 'Expenses' | 'Income'
  const [filters, setFilters] = useState({}); // recibirá { dateFrom, dateTo, priceMin, priceMax, category }

  //? Función para abrir el formulario
  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  //? Función para cerrar el formulario
  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  // Toggle usado para forzar refresco de TransactionBox cuando se añade una transacción
  const handleTransactionAdded = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className='transactions-container'>
      <div className="transactions-header">
        <div className="header-title-section">
          <span className="header-icon">💳</span>
          <h1>Transactions</h1>
        </div>
        <Button text="+ Add New" onClick={handleOpenForm} className="btn-add-transaction" />
      </div>

      <div className='transaction-type-view'>
        <button 
          className={`type-btn ${view === 'All' ? 'active' : ''}`}
          onClick={() => setView('All')}
        >
          All
        </button>
        <button 
          className={`type-btn ${view === 'Expenses' ? 'active' : ''}`}
          onClick={() => setView('Expenses')}
        >
          💸 Expenses
        </button>
        <button 
          className={`type-btn ${view === 'Income' ? 'active' : ''}`}
          onClick={() => setView('Income')}
        >
          💰 Income
        </button>
      </div>

      {isFormVisible && (
        <IncomeExpenseForm
          onClose={handleCloseForm}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      <TransactionsFilter view={view} onChange={setFilters} />

      <div className='transaction-list'>
        <TransactionBox refresh={refresh} view={view} filters={filters} />
      </div>
      
    </div>
  )
}

export default Transactions