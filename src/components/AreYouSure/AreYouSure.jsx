import Button from '../Button/Button'
import './AreYouSure.css'

const AreYouSure = ({ message = 'Are you sure you want to proceed?', onConfirm = () => {}, onCancel = () => {} }) => {
  return (
    <div className='confirmation-overlay' onClick={(e) => e.stopPropagation()}>
      <div className='confirmation-card'>
        <Button 
          text="×" 
          onClick={onCancel} 
          className="confirmation-close-btn"
        />
        
        <div className="confirmation-icon">
          <span className="warning-emoji">⚠️</span>
        </div>
        
        <h3 className="confirmation-title">Confirm Action</h3>
        <p className="confirmation-message">{message}</p>
        
        <div className='confirmation-buttons'>
          <Button 
            text='Cancel' 
            onClick={onCancel}
            className="btn-secondary"
          />
          <Button 
            text='Confirm' 
            onClick={onConfirm}
            className="btn-danger"
          />
        </div>
      </div>
    </div>
  )
}

export default AreYouSure