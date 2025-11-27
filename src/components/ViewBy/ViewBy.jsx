import { useFinancialContext } from '../../context/FinancialContext';
import './ViewBy.css';

const ViewBy = () => {
  const { viewBy, setViewBy, refresh } = useFinancialContext();

  const periods = ['Month', 'Year', 'All-Time'];

  return (
    <div className="view-by-container">
      <label>View by:</label>
      
      <div className="period-buttons">
        {periods.map((period) => (
          <button
            key={period}
            className={`period-button ${viewBy === period ? 'active' : ''}`}
            onClick={() => setViewBy(period)}
          >
            {period}
          </button>
        ))}
      </div>

      <button className="refresh-button" onClick={refresh}>
        🔄 Refresh
      </button>
    </div>
  )
}

export default ViewBy