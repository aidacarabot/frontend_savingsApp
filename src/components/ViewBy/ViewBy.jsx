import './ViewBy.css';

const ViewBy = ({ options, currentValue, onChange, label }) => {
  return (
    <div className="view-by-container">
      {label && <label className="view-by-label">{label}</label>}
      
      <div className="view-by-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            className={`view-by-button ${currentValue === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.icon && <span className="option-icon">{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ViewBy