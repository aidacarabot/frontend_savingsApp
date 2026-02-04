import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import Title from "../components/Title/Title";
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";
import ViewBy from "../components/ViewBy/ViewBy";
import { Banknote, Search, SearchX } from 'lucide-react';


const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('All');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const viewOptions = [
    { value: 'All', label: 'All', icon: <Banknote /> },
    { value: 'Expenses', label: 'Expenses', icon: '💸' },
    { value: 'Income', label: 'Income', icon: '💰' }
  ];

  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleTransactionAdded = () => {
    setRefresh((prev) => !prev);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className='transactions-container'>
      <div className="transactions-header">
        <Title icon="💳" title="Transactions" />
        <Button text="+" onClick={handleOpenForm} className="btn-add-transaction" />
      </div>

      <ViewBy 
        options={viewOptions}
        currentValue={view}
        onChange={setView}
      />

      <Button 
        text={
          <>
            {showFilters ? <SearchX /> : <Search />}
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </>
        }
        onClick={toggleFilters}
        className="transactions-filter-toggle"
      />

      {showFilters && (
        <TransactionsFilter view={view} onChange={setFilters} />
      )}

      {isFormVisible && (
        <IncomeExpenseForm
          onClose={handleCloseForm}
          onTransactionAdded={handleTransactionAdded}
        />
      )}

      <TransactionBox refresh={refresh} view={view} filters={filters} />
    </div>
  )
}

export default Transactions