import { useState, useEffect } from 'react';

const useMessageVisibility = (duration = 3000) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, [duration]);

  return visible;
};

export default useMessageVisibility;