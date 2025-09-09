import useMessageVisibility from '../../hooks/useMessageVisibility';
import './Messages.css';

const SuccessMessage = ({ text, duration = 3000 }) => {
  const visible = useMessageVisibility(duration);

  if (!visible) return null;

  return (
    <div className="success-message">
      {text}
    </div>
  );
};

const ErrorMessage = ({ text, duration = 3000 }) => {
  const visible = useMessageVisibility(duration);

  if (!visible) return null;

  return (
    <div className="error-message">
      {text}
    </div>
  );
};

export { SuccessMessage, ErrorMessage };