import './Title.css';

const Title = ({ icon, title, className }) => {
  return (
    <div className={`title-container ${className || ''}`}>
      <div className="title-section">
        <span className="title-icon">{icon}</span>
        <h1>{title}</h1>
      </div>
    </div>
  )
}

export default Title