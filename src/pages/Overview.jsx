import CurrentData from "../components/CurrentData/CurrentData"
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
        <SavingsChart />
      </div>
    </FinancialProvider>
  )
}

export default Overview