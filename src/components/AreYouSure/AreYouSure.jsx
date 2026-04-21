import { TriangleAlert } from 'lucide-react';
import { createPortal } from 'react-dom';
import Button from '../Button/Button';
import './AreYouSure.css'

const AreYouSure = ({ message = 'Are you sure you want to proceed?', onConfirm = () => {}, onCancel = () => {} }) => {
  return createPortal(
    <div className='confirmation-overlay' onClick={onCancel}>
      <div className='confirmation-card' onClick={(e) => e.stopPropagation()}>
        <Button className="confirmation-close-btn" onClick={onCancel} text="×" />
        
        <div className="confirmation-icon">
          <TriangleAlert size={28} color="var(--color-danger)" strokeWidth={1.8} />
        </div>
        
        <h3 className="confirmation-title">Confirm Action</h3>
        <p className="confirmation-message">{message}</p>
        
        <div className='confirmation-buttons'>
          <Button className="conf-btn conf-btn-cancel" onClick={onCancel} text="Cancel" />
          <Button className="conf-btn conf-btn-confirm" onClick={onConfirm} text="Confirm" />
        </div>
      </div>
    </div>,
    document.getElementById('root')
  )
}

export default AreYouSure