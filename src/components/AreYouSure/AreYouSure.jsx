import Button from '../Button/Button'
import './AreYouSure.css'

const AreYouSure = ({ message = 'Are you sure you want to proceed?', onConfirm = () => {}, onCancel = () => {} }) => {
  return (
    <div className='are-you-sure'>
      <Button text='X' onClick={onCancel} />
      <h4>{message}</h4>
      <div className='are-you-sure-buttons'>
        <Button text='Yes' onClick={onConfirm} />
        <Button text='No' onClick={onCancel} />
      </div>
    </div>
  )
}

export default AreYouSure