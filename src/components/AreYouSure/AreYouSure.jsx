import { TriangleAlert } from 'lucide-react';
import './AreYouSure.css'

const AreYouSure = ({ message = 'Are you sure you want to proceed?', onConfirm = () => {}, onCancel = () => {} }) => {
  return (
    <div className='confirmation-overlay' onClick={onCancel}>
      <div className='confirmation-card' onClick={(e) => e.stopPropagation()}>
        <button className="confirmation-close-btn" onClick={onCancel} type="button">&times;</button>
        
        <div className="confirmation-icon">
          <TriangleAlert size={30} color="var(--color-primary)" strokeWidth={1.8} />
        </div>
        
        <h3 className="confirmation-title">Confirm Action</h3>
        <p className="confirmation-message">{message}</p>
        
        <div className='confirmation-buttons'>
          <button className="conf-btn conf-btn-cancel" onClick={onCancel} type="button">Cancel</button>
          <button className="conf-btn conf-btn-confirm" onClick={onConfirm} type="button">Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default AreYouSure