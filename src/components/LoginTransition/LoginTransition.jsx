import { useEffect, useState } from 'react';
import './LoginTransition.css';

const STATUS_MESSAGES = [
  'Authenticating...',
  'Loading dashboard...',
  'Welcome back.',
];

const LoginTransition = ({ onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev =>
        prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 700);

    const exitTimer = setTimeout(() => setExiting(true), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`lt-overlay${exiting ? ' lt-overlay--exit' : ''}`}>
      <div className="lt-grid" />
      <div className="lt-scanline" />

      <div className="lt-center">
        <div className="lt-logo-ring">
          <div className="lt-ring lt-ring--outer" />
          <div className="lt-ring lt-ring--inner" />
          <div className="lt-logo-icon">F</div>
        </div>

        <div className="lt-logo-text">FinApp</div>

        <div className="lt-status" key={messageIndex}>
          {STATUS_MESSAGES[messageIndex]}
        </div>

        <div className="lt-progress-track">
          <div className="lt-progress-bar" />
        </div>
      </div>
    </div>
  );
};

export default LoginTransition;
