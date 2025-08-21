import { useState } from "react"
import Button from "../components/Button/Button"
import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"
import TransactionsFilter from "../components/TransactionsFilter/TransactionsFilter";
import TransactionBox from "../components/TransactionBox/TransactionBox";


const Transactions = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  //? Función para abrir el formulario
  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  //? Función para cerrar el formulario
  const handleCloseForm = () => {
    setIsFormVisible(false);
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
        />
      )}

      <TransactionsFilter />

      <div className='transaction-list'>
      <TransactionBox />
      </div>
    </div>
  )
}

export default Transactions