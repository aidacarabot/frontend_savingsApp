import CurrentData from "../components/CurrentData/CurrentData"
import ExpensesChart from "../components/ExpensesChart/ExpensesChart"
import GoalsOverview from "../components/GoalsOverview/GoalsOverview"
import SavingsChart from "../components/SavingsChart/SavingsChart"
import ViewBy from "../components/ViewBy/ViewBy"
import { FinancialProvider, useFinancialContext } from "../context/FinancialContext"

const OverviewContent = () => {
  const { viewBy, setViewBy } = useFinancialContext();

  const viewByOptions = [
    { value: 'Month', label: 'Month' },
    { value: 'Year', label: 'Year' },
    { value: 'All-Time', label: 'All-Time' }
  ];

  return (
    <div className='overview-container'>
      <ViewBy 
        options={viewByOptions}
        currentValue={viewBy}
        onChange={setViewBy}
      />
      <CurrentData />
      <SavingsChart />
      <ExpensesChart />
      <GoalsOverview />
    </div>
  );
};

const Overview = () => {
  return (
    <FinancialProvider>
      <OverviewContent />
    </FinancialProvider>
  )
}

export default Overview