import CurrentData from "../components/CurrentData/CurrentData"
import ExpensesChart from "../components/ExpensesChart/ExpensesChart"
import GoalsOverview from "../components/GoalsOverview/GoalsOverview"
import SavingsChart from "../components/SavingsChart/SavingsChart"
import ViewBy from "../components/ViewBy/ViewBy"
import { FinancialProvider } from "../context/FinancialContext"

const Overview = () => {
  return (
    <FinancialProvider>
      <div className='overview-container'>
        Overview
        <ViewBy />
        <CurrentData />
        <GoalsOverview />
        <SavingsChart />
        <ExpensesChart />
      </div>
    </FinancialProvider>
  )
}

export default Overview