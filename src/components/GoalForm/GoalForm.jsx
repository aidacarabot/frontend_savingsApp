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

  const { responseData: userData } = useApiFetch('/users', 'GET');
  const currentAge = useCalculateAge(userData?.birthDate);

  const totalGoal = watch('totalGoal');
  const completionDate = watch('completionDate');
  const monthlyContribution = watch('monthlyContribution');
  const ageAtCompletion = watch('ageAtCompletion');

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

  useEffect(() => {
    if (isEditing && initialData && !isInitializedRef.current) {
      setValue('goalName', initialData.goalName);
      setValue('totalGoal', initialData.targetAmount);
      setValue('monthlyContribution', initialData.monthlyContribution);

      if (initialData.completionDate) {
        const date = new Date(initialData.completionDate);
        const formattedDate = date.toISOString().split('T')[0];
        setValue('completionDate', formattedDate);
      }

      setTimeout(() => {
        isInitializedRef.current = true;
      }, 100);
    } else if (!isEditing) {
      isInitializedRef.current = true;
    }
  }, [isEditing, initialData, setValue]);

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        goalName: data.goalName,
        targetAmount: parseFloat(data.totalGoal),
        completionDate: data.completionDate || null,
        monthlyContribution: data.monthlyContribution ? parseFloat(data.monthlyContribution) : null
      };

      if (isEditing) {
        await fetchData(`/goals/${initialData._id}`, 'PUT', payload);
      } else {
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

  const handleFieldChange = (fieldName, event) => {
    if (isInitializedRef.current) {
      setLastUpdatedField(fieldName);
    }
    register(fieldName).onChange(event);
  };

  return (
    <div className="gf-overlay">
      <div className="gf-card">
        <button className="gf-close" onClick={onClose} type="button">
          &times;
        </button>

        <div className="gf-header">
          <h2>{isEditing ? 'Edit Goal' : 'New Goal'}</h2>
          <p>Define your target and we'll map the path</p>
        </div>

        <form className="gf-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="gf-group">
            <label htmlFor="goal-name">Goal Name</label>
            <input
              id="goal-name"
              type="text"
              {...register('goalName', { required: 'Goal name is required' })}
              placeholder="e.g., Vacation to Japan"
              className="gf-input"
            />
          </div>

          <div className="gf-group">
            <label htmlFor="total-goal">Target Amount</label>
            <div className="gf-input-prefix-wrap">
              <span className="gf-prefix">$</span>
              <input
                id="total-goal"
                type="number"
                step="0.01"
                {...register('totalGoal', {
                  required: 'Total goal amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than zero' }
                })}
                placeholder="5,000"
                className="gf-input gf-input-prefixed"
                onChange={(e) => handleFieldChange('totalGoal', e)}
              />
            </div>
          </div>

          <div className="gf-grid-3">
            <div className="gf-group">
              <label htmlFor="completion-date">Target Date</label>
              <input
                id="completion-date"
                type="date"
                {...register('completionDate')}
                min={new Date().toISOString().split('T')[0]}
                className="gf-input gf-input-date"
                onChange={(e) => handleFieldChange('completionDate', e)}
              />
            </div>

            <div className="gf-group">
              <label htmlFor="monthly-contribution">Monthly</label>
              <div className="gf-input-prefix-wrap">
                <span className="gf-prefix">$</span>
                <input
                  id="monthly-contribution"
                  type="number"
                  step="0.01"
                  {...register('monthlyContribution', {
                    min: { value: 0.01, message: 'Must be greater than zero' }
                  })}
                  placeholder="200"
                  className="gf-input gf-input-prefixed"
                  onChange={(e) => handleFieldChange('monthlyContribution', e)}
                />
              </div>
            </div>

            <div className="gf-group">
              <label htmlFor="age-at-completion">Age</label>
              <input
                id="age-at-completion"
                type="number"
                {...register('ageAtCompletion', {
                  min: { value: currentAge, message: `Age must be at least ${currentAge}` }
                })}
                placeholder={currentAge ? currentAge.toString() : "25"}
                className="gf-input"
                onChange={(e) => handleFieldChange('ageAtCompletion', e)}
              />
            </div>
          </div>

          <div className="gf-summary">
            <h3 className="gf-summary-title">Goal Summary</h3>
            <div className="gf-summary-grid">
              <div className="gf-summary-item">
                <span className="gf-summary-label">Monthly Needed</span>
                <span className="gf-summary-value">
                  {totalGoal && totalGoal > 0 && calculatedData.monthlySavingsNeeded > 0
                    ? `$${calculatedData.monthlySavingsNeeded.toFixed(2)}`
                    : '\u2014'
                  }
                </span>
              </div>
              <div className="gf-summary-item">
                <span className="gf-summary-label">Target Date</span>
                <span className="gf-summary-value">
                  {totalGoal && totalGoal > 0 && calculatedData.calculatedCompletionDate
                    ? new Date(calculatedData.calculatedCompletionDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })
                    : '\u2014'
                  }
                </span>
              </div>
              <div className="gf-summary-item">
                <span className="gf-summary-label">Your Age</span>
                <span className="gf-summary-value">
                  {totalGoal && totalGoal > 0 && calculatedData.ageAtCompletion > 0
                    ? `${calculatedData.ageAtCompletion} years`
                    : '\u2014'
                  }
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="gf-submit">
            {isEditing ? 'Update Goal' : 'Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
