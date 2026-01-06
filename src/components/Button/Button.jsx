import './Button.css';

const Button = ({ text, onClick, type = 'button', variant, className = '' }) => {
  const buttonClass = variant ? `btn btn-${variant}` : `btn ${className}`.trim();
  
  return (
    <button onClick={onClick} type={type} className={buttonClass}>
      {text}
    </button>
  );
};

export default Button;