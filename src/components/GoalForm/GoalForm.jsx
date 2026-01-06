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
  const ageAtCompletion = watch('ageAtCompletion');

  // Hook personalizado para cálculos - solo si no estamos editando o ya se inicializó
  const {
    calculatedData,
    setLastUpdatedField,
    setCalculatedData
  } = useGoalCalculations(
    isInitializedRef.current ? totalGoal : null,
    isInitializedRef.current ? completionDate : null, 
    isInitializedRef.current ? monthlyContribution : null,
    isInitializedRef.current ? ageAtCompletion : null,
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

  // Manejar cambios en los inputs de forma controlada
  const handleFieldChange = (fieldName, event) => {
    if (isInitializedRef.current) {
      setLastUpdatedField(fieldName);
    }
    register(fieldName).onChange(event);
  };

  return (
    <div className='goal-form-overlay'>
      <div className='goal-form-card'>
        <Button 
          text="×" 
          onClick={onClose} 
          type="button"
          className="close-btn"
        />
        
        <div className="form-header">
          <h2>{isEditing ? 'Edit Goal' : 'Create New Goal'}</h2>
          <p className="subtitle">Define your financial goals and let us help you achieve them</p>
        </div>

        <form className='goal-form' onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Goal Name */}
          <div className="input-group">
            <label htmlFor="goal-name">
              <span className="label-icon">🎯</span>
              Goal Name
            </label>
            <input
              id="goal-name"
              type="text"
              {...register('goalName', { required: 'Goal name is required' })}
              placeholder="e.g., Vacation to Japan"
              className="modern-input"
            />
          </div>

          {/* Total Goal */}
          <div className="input-group">
            <label htmlFor="total-goal">
              <span className="label-icon">💰</span>
              Target Amount
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                id="total-goal"
                type="number"
                step="0.01"
                {...register('totalGoal', { 
                  required: 'Total goal amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than zero' }
                })}
                placeholder="5,000"
                className="modern-input with-prefix"
                onChange={(e) => handleFieldChange('totalGoal', e)}
              />
            </div>
          </div>

          {/* Grid de 3 columnas para los campos calculables */}
          <div className="calculation-grid">
            <div className="input-group">
              <label htmlFor="completion-date">
                <span className="label-icon">📅</span>
                Target Date
              </label>
              <input
                id="completion-date"
                type="date"
                {...register('completionDate')}
                min={new Date().toISOString().split('T')[0]}
                className="modern-input date-input"
                onChange={(e) => handleFieldChange('completionDate', e)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="monthly-contribution">
                <span className="label-icon">💸</span>
                Monthly
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  id="monthly-contribution"
                  type="number"
                  step="0.01"
                  {...register('monthlyContribution', {
                    min: { value: 0.01, message: 'Monthly contribution must be greater than zero' }
                  })}
                  placeholder="200"
                  className="modern-input with-prefix"
                  onChange={(e) => handleFieldChange('monthlyContribution', e)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="age-at-completion">
                <span className="label-icon">🎂</span>
                Age
              </label>
              <input
                id="age-at-completion"
                type="number"
                {...register('ageAtCompletion', {
                  min: { value: currentAge, message: `Age must be at least ${currentAge}` }
                })}
                placeholder={currentAge ? currentAge.toString() : "25"}
                className="modern-input"
                onChange={(e) => handleFieldChange('ageAtCompletion', e)}
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-icon">✨</span>
              <h3>Goal Summary</h3>
            </div>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Monthly Needed</span>
                <span className="summary-value">
                  {totalGoal && totalGoal > 0 && calculatedData.monthlySavingsNeeded > 0
                    ? `$${calculatedData.monthlySavingsNeeded.toFixed(2)}`
                    : '—'
                  }
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Target Date</span>
                <span className="summary-value">
                  {totalGoal && totalGoal > 0 && calculatedData.calculatedCompletionDate 
                    ? new Date(calculatedData.calculatedCompletionDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })
                    : '—'
                  }
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Your Age</span>
                <span className="summary-value">
                  {totalGoal && totalGoal > 0 && calculatedData.ageAtCompletion > 0
                    ? `${calculatedData.ageAtCompletion} years`
                    : '—'
                  }
                </span>
              </div>
            </div>
          </div>

          <Button 
            text={isEditing ? "Update Goal" : "Create Goal"} 
            type="submit" 
          />
        </form>
      </div>
    </div>
  );
};

export default GoalForm;