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

    // Auto-completar campos basado en cálculos
    if (totalGoal && totalGoal > 0) {
      if (completionDate && lastUpdatedField === 'completionDate' && newData.monthlySavingsNeeded > 0) {
        if (!monthlyContribution || Math.abs(newData.monthlySavingsNeeded - parseFloat(monthlyContribution || 0)) > 1) {
          setIsCalculating(true);
          setValue('monthlyContribution', newData.monthlySavingsNeeded.toFixed(2), { shouldDirty: false });
          setTimeout(() => setIsCalculating(false), 50);
        }
      } else if (monthlyContribution && monthlyContribution > 0 && lastUpdatedField === 'monthlyContribution' && newData.calculatedCompletionDate) {
        if (newData.calculatedCompletionDate !== completionDate) {
          setIsCalculating(true);
          setValue('completionDate', newData.calculatedCompletionDate, { shouldDirty: false });
          setTimeout(() => setIsCalculating(false), 50);
        }
      }
    }

    setCalculatedData(newData);

    if (lastUpdatedField) {
      const timer = setTimeout(() => setLastUpdatedField(null), 200);
      return () => clearTimeout(timer);
    }
  }, [totalGoal, completionDate, monthlyContribution, setValue, userData?.birthDate, currentAge, lastUpdatedField, isCalculating]);

  return {
    calculatedData,
    setLastUpdatedField,
    isCalculating,
    setIsCalculating,
    setCalculatedData
  };
};