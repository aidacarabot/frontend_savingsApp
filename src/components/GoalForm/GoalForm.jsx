import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import Button from '../Button/Button';
import { fetchData } from '../../utils/api/fetchData';
import useApiFetch from '../../hooks/useApiFetch';
import useCalculateAge from '../../hooks/useCalculateAge';
import { useGoalCalculations } from '../../hooks/useGoalCalculations';
import './GoalForm.css';

const GoalForm = ({ onClose, onGoalAdded, initialData = null, isEditing = false }) => {
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const isInitializedRef = useRef(false);
  
  // Hooks para datos del usuario
  const { responseData: userData } = useApiFetch('/users', 'GET');
  const currentAge = useCalculateAge(userData?.birthDate);

  // Observar campos del formulario
  const totalGoal = watch('totalGoal');
  const completionDate = watch('completionDate');
  const monthlyContribution = watch('monthlyContribution');

  // Hook personalizado para cálculos - solo si no estamos editando o ya se inicializó
  const {
    calculatedData,
    setLastUpdatedField,
    setCalculatedData
  } = useGoalCalculations(
    isInitializedRef.current ? totalGoal : null,
    isInitializedRef.current ? completionDate : null, 
    isInitializedRef.current ? monthlyContribution : null, 
    setValue, 
    userData, 
    currentAge
  );

  // Llenar el formulario con datos iniciales si estamos editando
  useEffect(() => {
    if (isEditing && initialData && !isInitializedRef.current) {
      setValue('goalName', initialData.goalName);
      setValue('totalGoal', initialData.targetAmount);
      setValue('monthlyContribution', initialData.monthlyContribution);
      
      // Formatear la fecha para el input date
      if (initialData.completionDate) {
        const date = new Date(initialData.completionDate);
        const formattedDate = date.toISOString().split('T')[0];
        setValue('completionDate', formattedDate);
      }
      
      // Marcar como inicializado después de un breve delay
      setTimeout(() => {
        isInitializedRef.current = true;
      }, 100);
    } else if (!isEditing) {
      isInitializedRef.current = true;
    }
  }, [isEditing, initialData, setValue]);

  // Función para manejar el envío del formulario
  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        goalName: data.goalName,
        targetAmount: parseFloat(data.totalGoal),
        completionDate: data.completionDate || null,
        monthlyContribution: data.monthlyContribution ? parseFloat(data.monthlyContribution) : null
      };

      if (isEditing) {
        // Actualizar goal existente
        await fetchData(`/goals/${initialData._id}`, 'PUT', payload);
      } else {
        // Crear nuevo goal
        await fetchData('/goals', 'POST', payload);
      }
      
      if (onGoalAdded) onGoalAdded();
      reset();
      setCalculatedData({
        monthlySavingsNeeded: 0,
        calculatedCompletionDate: '',
        ageAtCompletion: 0
      });
      isInitializedRef.current = false;
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} goal:`, error);
    }
  };

  // Función para cerrar al hacer click en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Manejar cambios en los inputs de forma controlada
  const handleFieldChange = (fieldName, event) => {
    if (isInitializedRef.current) {
      setLastUpdatedField(fieldName);
    }
    register(fieldName).onChange(event);
  };

  return (
    <div className='goal-form-overlay' onClick={handleOverlayClick}>
      <div className='goal-form-div'>
        <button className="close-button" onClick={onClose} type="button">
          ×
        </button>
        <h3>{isEditing ? 'EDIT GOAL' : 'NEW GOAL'}</h3>
        <form className='goal-form' onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-group">
            <label htmlFor="goal-name">Goal Name:</label>
            <input
              id="goal-name"
              type="text"
              {...register('goalName', { required: 'Goal name is required' })}
              placeholder="Enter Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="total-goal">Total Goal ($):</label>
            <input
              id="total-goal"
              type="number"
              step="0.01"
              {...register('totalGoal', { 
                required: 'Total goal amount is required',
                min: { value: 0.01, message: 'Amount must be greater than zero' }
              })}
              placeholder="Enter Amount"
              onChange={(e) => handleFieldChange('totalGoal', e)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="completion-date">Completion Date:</label>
            <input
              id="completion-date"
              type="date"
              {...register('completionDate')}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleFieldChange('completionDate', e)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="monthly-contribution">Monthly Contribution ($):</label>
            <input
              id="monthly-contribution"
              type="number"
              step="0.01"
              {...register('monthlyContribution', {
                min: { value: 0.01, message: 'Monthly contribution must be greater than zero' }
              })}
              placeholder="Enter Contribution"
              onChange={(e) => handleFieldChange('monthlyContribution', e)}
            />
          </div>

          {/* Goal Summary */}
          <>
            <div className="divider">
              <hr />
              <h3>Goal Summary</h3>
            </div>
            
            <div className="calculated-info">
              <div className="info-item">
                <span className="info-label">Monthly Savings Needed:</span>
                <span className="info-value">
                  {totalGoal && totalGoal > 0 && calculatedData.monthlySavingsNeeded > 0
                    ? `$${calculatedData.monthlySavingsNeeded.toFixed(2)}`
                    : ''
                  }
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Completion Date:</span>
                <span className="info-value">
                  {totalGoal && totalGoal > 0 && calculatedData.calculatedCompletionDate 
                    ? new Date(calculatedData.calculatedCompletionDate).toLocaleDateString()
                    : ''
                  }
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Age at goal completion:</span>
                <span className="info-value">
                  {totalGoal && totalGoal > 0 && calculatedData.ageAtCompletion > 0
                    ? `${calculatedData.ageAtCompletion} years`
                    : ''
                  }
                </span>
              </div>
            </div>
          </>

          <Button text={isEditing ? "Update Goal" : "Submit"} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default GoalForm;