import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import Title from "../components/Title/Title";
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";
import ViewBy from "../components/ViewBy/ViewBy";
import { Banknote, Search, SearchX, Plus, ChartPie, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';


const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('All');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const viewOptions = [
    { value: 'All', label: 'ALL', icon: <Banknote /> },
    { value: 'Expenses', label: 'EXPENSES', icon: <BanknoteArrowDown /> },
    { value: 'Income', label: 'INCOME', icon: <BanknoteArrowUp /> }
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
        <Title icon={<ChartPie size={30} color="#27ebc8" />} title="TRANSACTIONS" className="title-transactions" />
      </div>

      <div className="transactions-controls">
        <ViewBy 
          options={viewOptions}
          currentValue={view}
          onChange={setView}
        />
        
        <div className="transactions-actions">
          <Button 
            text={
              <>
                {showFilters ? <SearchX size={18} /> : <Search size={18} />}
                <span>{showFilters ? 'Hide' : 'Filter'}</span>
              </>
            }
            onClick={toggleFilters}
            className="transactions-filter-toggle"
          />
          <Button text={<Plus size={20} />} onClick={handleOpenForm} className="btn-add-transaction" />
        </div>
      </div>

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