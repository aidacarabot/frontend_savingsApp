import { CircleCheck, CircleAlert } from 'lucide-react';
import useMessageVisibility from '../../hooks/useMessageVisibility';
import './Messages.css';

const SuccessMessage = ({ text, duration = 3000 }) => {
  const visible = useMessageVisibility(duration);

  if (!visible) return null;

  return (
    <div className="success-message">
      <CircleCheck size={18} className="message-icon" />
      <span>{text}</span>
    </div>
  );
};

const ErrorMessage = ({ text, duration = 3000 }) => {
  const visible = useMessageVisibility(duration);

  if (!visible) return null;

  return (
    <div className="error-message">
      <CircleAlert size={18} className="message-icon" />
      <span>{text}</span>
    </div>
  );
};

export { SuccessMessage, ErrorMessage };