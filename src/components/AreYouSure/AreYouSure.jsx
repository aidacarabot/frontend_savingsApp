import { TriangleAlert } from 'lucide-react';
import { createPortal } from 'react-dom';
import './AreYouSure.css'

const AreYouSure = ({ message = 'Are you sure you want to proceed?', onConfirm = () => {}, onCancel = () => {} }) => {
  return createPortal(
    <div className='confirmation-overlay' onClick={onCancel}>
      <div className='confirmation-card' onClick={(e) => e.stopPropagation()}>
        <button className="confirmation-close-btn" onClick={onCancel} type="button">&times;</button>
        
        <div className="confirmation-icon">
          <TriangleAlert size={28} color="var(--color-danger)" strokeWidth={1.8} />
        </div>
        
        <h3 className="confirmation-title">Confirm Action</h3>
        <p className="confirmation-message">{message}</p>
        
        <div className='confirmation-buttons'>
          <button className="conf-btn conf-btn-cancel" onClick={onCancel} type="button">Cancel</button>
          <button className="conf-btn conf-btn-confirm" onClick={onConfirm} type="button">Confirm</button>
        </div>
      </div>
    </div>,
    document.getElementById('root')
  )
}

export default AreYouSure