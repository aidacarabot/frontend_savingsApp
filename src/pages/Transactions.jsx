import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";


const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
        <Button text="All" />
        <Button text="Expenses"/>
        <Button text="Income"/>
      </div>
      <Button text="+ Add New Transaction" onClick={handleOpenForm} />
      {isFormVisible && (
        <IncomeExpenseForm
          onClose={handleCloseForm}
      onTransactionAdded={handleTransactionAdded}
        />
      )}

      <TransactionsFilter />

      <div className='transaction-list'>
    <TransactionBox refresh={refresh} />
      </div>
      
    </div>
  )
}

export default Transactions