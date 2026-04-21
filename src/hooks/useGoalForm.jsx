import { useState, useEffect } from 'react';
import { fetchData } from '../utils/api/fetchData';

const useGoalForm = ({ isEditing, initialData, onGoalAdded, setValue, reset, setCalculatedData, setLastUpdatedField, isInitializedRef, register }) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isEditing && initialData && !isInitializedRef.current) {
      setValue('goalName', initialData.goalName);
      setValue('totalGoal', initialData.targetAmount);
      setValue('monthlyContribution', initialData.monthlyContribution);
      if (initialData.completionDate) {
        const formattedDate = new Date(initialData.completionDate).toISOString().split('T')[0];
        setValue('completionDate', formattedDate);
      }
      setTimeout(() => { isInitializedRef.current = true; }, 100);
    } else if (!isEditing) {
      isInitializedRef.current = true;
    }
  }, [isEditing, initialData, setValue, isInitializedRef]);

  const handleFormSubmit = async (data) => {
    setErrorMessage('');
    try {
      const payload = {
        goalName: data.goalName,
        targetAmount: parseFloat(data.totalGoal),
        completionDate: data.completionDate || null,
        monthlyContribution: data.monthlyContribution ? parseFloat(data.monthlyContribution) : null,
      };
      if (isEditing) {
        await fetchData(`/goals/${initialData._id}`, 'PUT', payload);
      } else {
        await fetchData('/goals', 'POST', payload);
      }
      if (onGoalAdded) onGoalAdded();
      reset();
      setCalculatedData({ monthlySavingsNeeded: 0, calculatedCompletionDate: '', ageAtCompletion: 0 });
      isInitializedRef.current = false;
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} goal:`, error);
      setErrorMessage(`Error ${isEditing ? 'updating' : 'creating'} goal. Please try again.`);
    }
  };

  const handleFieldChange = (fieldName, event) => {
    if (isInitializedRef.current) setLastUpdatedField(fieldName);
    register(fieldName).onChange(event);
  };

  return { errorMessage, handleFormSubmit, handleFieldChange };
};

export default useGoalForm;
