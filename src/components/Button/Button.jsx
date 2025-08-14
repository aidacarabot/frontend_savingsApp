import './Button.css';

const Button = ({ text, onClick, type = 'button' }) => {
  return (
    <button onClick={onClick} type={type} className="btn">
      {text}
    </button>
  );
};

export default Button;