import CurrentData from "../components/CurrentData/CurrentData"
import ExpensesChart from "../components/ExpensesChart/ExpensesChart"
import GoalsOverview from "../components/GoalsOverview/GoalsOverview"
import SavingsChart from "../components/SavingsChart/SavingsChart"
import Title from "../components/Title/Title"
import ViewBy from "../components/ViewBy/ViewBy"
import { FinancialProvider, useFinancialContext } from "../context/FinancialContext"
import { useCurrentDate } from "../hooks/useCurrentDate"

const OverviewContent = () => {
  const { viewBy, setViewBy } = useFinancialContext();
  const currentDate = useCurrentDate();

  const viewByOptions = [
    { value: 'Month', label: 'Month' },
    { value: 'Year', label: 'Year' },
    { value: 'All-Time', label: 'All-Time' }
  ];

  return (
    <div className='overview-container'>
      <Title icon="📅" title={`Today is ${currentDate}`} />
      <ViewBy 
        options={viewByOptions}
        currentValue={viewBy}
        onChange={setViewBy}
      />
      <CurrentData />
      <div className='charts-wrapper'>
        <SavingsChart />
        <ExpensesChart />
      </div>
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