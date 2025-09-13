import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";


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
      <h2>Transactions</h2>
      <div className='transaction-type-view'>
        <Button text="All" onClick={() => setView('All')} />
        <Button text="Expenses" onClick={() => setView('Expenses')} />
        <Button text="Income" onClick={() => setView('Income')} />
      </div>
      <Button text="+ Add New Transaction" onClick={handleOpenForm} />
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