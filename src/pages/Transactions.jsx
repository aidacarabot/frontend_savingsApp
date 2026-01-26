import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import Title from "../components/Title/Title";
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";
import ViewBy from "../components/ViewBy/ViewBy";


const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('All'); // 'All' | 'Expenses' | 'Income'
  const [filters, setFilters] = useState({}); // recibirá { dateFrom, dateTo, priceMin, priceMax, category }

  const viewOptions = [
    { value: 'All', label: 'All' },
    { value: 'Expenses', label: 'Expenses', icon: '💸' },
    { value: 'Income', label: 'Income', icon: '💰' }
  ];

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
      <Title icon="💳" title="Transactions" />
      <div className="transactions-header">
        <Button text="+ Add New" onClick={handleOpenForm} className="btn-add-transaction" />
      </div>

      <ViewBy 
        options={viewOptions}
        currentValue={view}
        onChange={setView}
      />

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