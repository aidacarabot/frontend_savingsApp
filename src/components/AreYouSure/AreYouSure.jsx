import Button from '../Button/Button'
import './AreYouSure.css'

const AreYouSure = () => {
  return (
    <div className='are-you-sure'>
      <Button text='X' />
      <h4>Are you sure you want to proceed?</h4>
      <div className='are-you-sure-buttons'>
        <Button text='Yes' />
        <Button text='No' />
      </div>
    </div>
  )
}

export default AreYouSure