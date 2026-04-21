import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { Goal } from 'lucide-react';
import Button from '../Button/Button';
import { ErrorMessage } from '../Messages/Messages';
import useApiFetch from '../../hooks/useApiFetch';
import useCalculateAge from '../../hooks/useCalculateAge';
import { useGoalCalculations } from '../../hooks/useGoalCalculations';
import GoalFormSummary from './GoalFormSummary';
import useGoalForm from '../../hooks/useGoalForm';
import './GoalForm.css';

const GoalForm = ({ onClose, onGoalAdded, initialData = null, isEditing = false }) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
  const isInitializedRef = useRef(false);

  const { responseData: userData } = useApiFetch('/users', 'GET');
  const currentAge = useCalculateAge(userData?.birthDate);

  const totalGoal = watch('totalGoal');
  const completionDate = watch('completionDate');
  const monthlyContribution = watch('monthlyContribution');
  const ageAtCompletion = watch('ageAtCompletion');

  const { calculatedData, setLastUpdatedField, setCalculatedData } = useGoalCalculations(
    isInitializedRef.current ? totalGoal : null,
    isInitializedRef.current ? completionDate : null,
    isInitializedRef.current ? monthlyContribution : null,
    isInitializedRef.current ? ageAtCompletion : null,
    setValue,
    userData,
    currentAge
  );

  const { errorMessage, handleFormSubmit, handleFieldChange } = useGoalForm({
    isEditing, initialData, onGoalAdded, setValue, reset,
    setCalculatedData, setLastUpdatedField, isInitializedRef, register,
  });

  return (
    <div className="gf-overlay">
      <div className="gf-card">
        <Button className="gf-close" onClick={onClose} text="×" />

        <div className="gf-header">
          <h2><Goal size={22} color="var(--color-primary)" style={{ verticalAlign: 'middle', marginRight: 10, marginBottom: 6 }} />{isEditing ? 'Edit Goal' : 'New Goal'}</h2>
          <p>Define your goal, timeline, or monthly amount — we’ll create your plan.</p>
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
            {errors.goalName && <p className="gf-field-error">{errors.goalName.message}</p>}
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
            {errors.totalGoal && <p className="gf-field-error">{errors.totalGoal.message}</p>}
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

          <GoalFormSummary totalGoal={totalGoal} calculatedData={calculatedData} />

          {errorMessage && <ErrorMessage text={errorMessage} />}
          <Button type="submit" className="gf-submit" text={isEditing ? 'Update Goal' : 'Create Goal'} />
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
