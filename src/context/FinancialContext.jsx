
import { createContext, useContext, useState } from 'react';

const FinancialContext = createContext();

export const useFinancialContext = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialContext must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider = ({ children }) => {
  const [viewBy, setViewBy] = useState('Month'); 
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <FinancialContext.Provider value={{ 
      viewBy, 
      setViewBy, 
      refresh, 
      refreshTrigger 
    }}>
      {children}
    </FinancialContext.Provider>
  );
};