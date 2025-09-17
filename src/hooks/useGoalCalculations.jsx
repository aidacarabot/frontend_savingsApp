import { useState, useEffect } from 'react';
import { calculateGoalData } from '../utils/calc/goalCalculations';

export const useGoalCalculations = (totalGoal, completionDate, monthlyContribution, setValue, userData, currentAge) => {
  const [calculatedData, setCalculatedData] = useState({
    monthlySavingsNeeded: 0,
    calculatedCompletionDate: '',
    ageAtCompletion: 0
  });
  const [lastUpdatedField, setLastUpdatedField] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isCalculating) return;

    const newData = calculateGoalData(
      totalGoal, 
      completionDate, 
      monthlyContribution, 
      lastUpdatedField, 
      userData, 
      currentAge
    );

    // Auto-completar campos solo cuando es necesario
    if (totalGoal && totalGoal > 0) {
      // Actualizar monthly contribution si es necesario
      if (newData.shouldUpdateMonthly && newData.monthlySavingsNeeded > 0) {
        const currentMonthly = parseFloat(monthlyContribution || 0);
        if (Math.abs(newData.monthlySavingsNeeded - currentMonthly) > 0.01) {
          setIsCalculating(true);
          setValue('monthlyContribution', newData.monthlySavingsNeeded.toFixed(2), { shouldDirty: false });
          setTimeout(() => setIsCalculating(false), 100);
        }
      }
      
      // Actualizar completion date si es necesario
      if (newData.shouldUpdateDate && newData.calculatedCompletionDate) {
        if (newData.calculatedCompletionDate !== completionDate) {
          setIsCalculating(true);
          setValue('completionDate', newData.calculatedCompletionDate, { shouldDirty: false });
          setTimeout(() => setIsCalculating(false), 100);
        }
      }
    }

    // Siempre actualizar los datos calculados para mostrar en el summary
    setCalculatedData({
      monthlySavingsNeeded: newData.monthlySavingsNeeded,
      calculatedCompletionDate: newData.calculatedCompletionDate,
      ageAtCompletion: newData.ageAtCompletion
    });

    // Reset lastUpdatedField después de procesar
    if (lastUpdatedField) {
      const timer = setTimeout(() => setLastUpdatedField(null), 150);
      return () => clearTimeout(timer);
    }
  }, [totalGoal, completionDate, monthlyContribution, setValue, userData, currentAge, lastUpdatedField, isCalculating]);

  return {
    calculatedData,
    setLastUpdatedField,
    isCalculating,
    setIsCalculating,
    setCalculatedData
  };
};