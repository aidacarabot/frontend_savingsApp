import { useForm } from 'react-hook-form';
import './IncomeExpenseForm.css';
import Button from '../Button/Button';
import { ErrorMessage } from '../Messages/Messages';
import { CATEGORIES } from '../../utils/constants';
import useIncomeExpenseForm from '../../hooks/useIncomeExpenseForm';

const IncomeExpenseForm = ({ onClose, onTransactionAdded, initialData = null, onTransactionUpdated }) => {
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: initialData
      ? {
          type: initialData.type || '',
          title: initialData.name || '',
          price: initialData.amount != null ? String(initialData.amount) : '',
          date: initialData.date ? initialData.date.slice(0, 10) : '',
          category: initialData.category || '',
        }
      : undefined,
  });

  const type = watch('type');

  const { displayPrice, errorMessage, handlePriceChange, handleFormSubmit } = useIncomeExpenseForm({
    initialData, onClose, onTransactionAdded, onTransactionUpdated, setValue, reset,
  });

  return (
    <div className="form-overlay">
      <div className="form-container">
        <Button text="X" onClick={onClose} />
        <h2>{type === 'Expense' ? 'Expense Form' : 'Income Form'}</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select id="type" {...register('type', { required: 'Type is required' })}>
              <option value="">Select Type</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            {errors.type && <p className="ief-field-error">{errors.type.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter title"
            />
            {errors.title && <p className="ief-field-error">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <p className="ief-field-error">{errors.date.message}</p>}
          </div>

          {type === 'Expense' && (
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select id="category" {...register('category', { required: 'Category is required' })}>
                <option value="">Select Category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="ief-field-error">{errors.category.message}</p>}
            </div>
          )}

          <div className="form-group form-price-input-group">
            <label htmlFor="price">Price ($):</label>
            <input
              id="price"
              type="text"
              value={displayPrice}
              onChange={handlePriceChange}
              placeholder="Enter price"
            />
            <input
              type="hidden"
              {...register('price', {
                required: 'Price is required',
                validate: (value) => {
                  const num = parseFloat(value);
                  if (isNaN(num) || num <= 0) return 'Price must be greater than zero';
                  return true;
                },
              })}
            />
          </div>
          {errors.price && <p className="ief-field-error">{errors.price.message}</p>}

          {errorMessage && <ErrorMessage text={errorMessage} />}
          <Button text={initialData ? 'Save' : 'Submit'} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default IncomeExpenseForm;