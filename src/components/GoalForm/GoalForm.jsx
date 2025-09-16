import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import { fetchData } from '../../utils/api/fetchData';
import useApiFetch from '../../hooks/useApiFetch';
import useCalculateAge from '../../hooks/useCalculateAge';
import { useGoalCalculations } from '../../hooks/useGoalCalculations';
import './GoalForm.css';

const GoalForm = ({ onClose, onGoalAdded }) => {
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  
  // Hooks para datos del usuario
  const { responseData: userData } = useApiFetch('/users', 'GET');
  const currentAge = useCalculateAge(userData?.birthDate);

  // Observar campos del formulario
  const totalGoal = watch('totalGoal');
  const completionDate = watch('completionDate');
  const monthlyContribution = watch('monthlyContribution');

  // Hook personalizado para cálculos
  const {
    calculatedData,
    setLastUpdatedField,
    setCalculatedData
  } = useGoalCalculations(totalGoal, completionDate, monthlyContribution, setValue, userData, currentAge);

  // Función para manejar el envío del formulario
  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        goalName: data.goalName,
        targetAmount: parseFloat(data.totalGoal),
        completionDate: data.completionDate || null,
        monthlyContribution: data.monthlyContribution ? parseFloat(data.monthlyContribution) : null
      };

      await fetchData('/goals', 'POST', payload);
      
      if (onGoalAdded) onGoalAdded();
      reset();
      setCalculatedData({
        monthlySavingsNeeded: 0,
        calculatedCompletionDate: '',
        ageAtCompletion: 0
      });
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <div className='goal-form-div'>
      <Button text="X" onClick={onClose} />
      <h3>NEW GOAL</h3>
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="completion-date">Completion Date:</label>
          <input
            id="completion-date"
            type="date"
            {...register('completionDate')}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setLastUpdatedField('completionDate');
              register('completionDate').onChange(e);
            }}
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
            onChange={(e) => {
              setLastUpdatedField('monthlyContribution');
              register('monthlyContribution').onChange(e);
            }}
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
                ${totalGoal && totalGoal > 0 
                  ? calculatedData.monthlySavingsNeeded.toFixed(2) 
                  : '0.00'
                }
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Completion Date:</span>
              <span className="info-value">
                {totalGoal && totalGoal > 0 && calculatedData.calculatedCompletionDate 
                  ? new Date(calculatedData.calculatedCompletionDate).toLocaleDateString()
                  : 'Not calculated'
                }
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Age at goal completion:</span>
              <span className="info-value">
                {calculatedData.ageAtCompletion > 0
                  ? `${calculatedData.ageAtCompletion} years`
                  : `${currentAge || 0} years`
                }
              </span>
            </div>
          </div>
        </>

        <Button text="Submit" type="submit" />
      </form>
    </div>
  );
};

export default GoalForm;