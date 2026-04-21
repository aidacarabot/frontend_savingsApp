
const Button = ({ text, onClick, type = 'button', variant, className = '', ...rest }) => {
  const buttonClass = variant ? `btn btn-${variant}` : `btn ${className}`.trim();
  
  return (
    <button onClick={onClick} type={type} className={buttonClass} {...rest}>
      {text}
    </button>
  );
};

export default Button;