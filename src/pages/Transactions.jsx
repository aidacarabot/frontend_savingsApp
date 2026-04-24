import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import Title from "../components/Title/Title";
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";
import ViewBy from "../components/ViewBy/ViewBy";
import BulkImport from "../components/BulkImport/BulkImport";
import { Banknote, Search, SearchX, Plus, ChartPie, BanknoteArrowDown, BanknoteArrowUp, FileUp, X } from 'lucide-react';

const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('All');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);

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
              <span className="transactions-filter-content">
                <span className="transactions-filter-icon" aria-hidden="true">
                  {showFilters ? <SearchX size={18} /> : <Search size={18} />}
                </span>
                <span className="transactions-filter-label">{showFilters ? 'Hide' : 'Filter'}</span>
              </span>
            }
            onClick={toggleFilters}
            className="transactions-filter-toggle"
          />
          <Button text={<Plus size={20} />} onClick={handleOpenForm} className="btn-add-transaction" />
          <Button
            text={
              showBulkImport
                ? <X size={20} />
                : <span className="transactions-filter-content"><FileUp size={18} /><span className="transactions-filter-label">Add in Bulk</span></span>
            }
            onClick={() => setShowBulkImport((prev) => !prev)}
            className="btn-bulk-import"
          />
        </div>
      </div>

      {showFilters && (
        <TransactionsFilter view={view} onChange={setFilters} />
      )}

      {showBulkImport && <BulkImport onImported={handleTransactionAdded} />}

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