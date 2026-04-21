import { useState, useEffect } from 'react';

const useMessageVisibility = (duration = 3000) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration === null) return; 
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return visible;
};

export default useMessageVisibility;