import './ViewBy.css';
import Button from '../Button/Button';

const ViewBy = ({ options, currentValue, onChange, label }) => {
  return (
    <div className="view-by-container">
      {label && <label className="view-by-label">{label}</label>}
      
      <div className="view-by-buttons">
        {options.map((option) => (
          <Button
            key={option.value}
            text={
              <>
                {option.icon && <span className="option-icon">{option.icon}</span>}
                {option.label}
              </>
            }
            className={`view-by-button ${currentValue === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default ViewBy