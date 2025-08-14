import IncomeExpenseForm from "../components/IncomeExpenseForm/IncomeExpenseForm"


const Transactions = () => {
  return (
    <div className='transactions-container'>
      <h2>Transactions</h2>
      <div className='transaction-type-view'></div>
      <div className='transaction-list'></div>
      <IncomeExpenseForm />
    </div>
  )
}

export default Transactions