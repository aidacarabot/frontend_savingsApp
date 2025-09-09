import { useForm } from 'react-hook-form';
import './IncomeExpenseForm.css';
import Button from '../Button/Button';
import { fetchData } from '../../utils/api/fetchData';

const IncomeExpenseForm = ({ onClose, onTransactionAdded }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const type = watch('type'); // Observa el campo 'type' para cambios

  // Definimos las categorías como un array
  const categories = [
    'Home 🏠',
    'Transportation 🚗',
    'Groceries 🛒',
    'Health 🏥',
    'Entertainment 🎭',
    'Travel ✈️',
    'Subscriptions 💳',
    'Shopping 🛍️',
    'Education 📚',
    'Gifts 🎁',
    'Debt 🏦',
    'Leisure 🍸',
    'Other ❓',
  ];

  //? Función para manejar el envío del formulario
  const handleFormSubmit = async (data) => {
    try {
      // Ajustamos los datos para que coincidan con los requerimientos del backend
      const payload = {
        type: data.type,
        name: data.title, // El backend espera "name" en lugar de "title"
        amount: parseFloat(data.price), // Convertimos el precio a número
        date: data.date,
        category: data.category || null, // Si no hay categoría, enviamos null
      };

      // Llamada al backend usando fetchData
      const response = await fetchData('/transactions', 'POST', payload);
      console.log('Transaction saved:', response);

  // Reseteamos el formulario después de enviarlo
  reset();

  // Notificar al padre que se añadió una transacción para que refresque la lista
  if (onTransactionAdded) onTransactionAdded();

  // Opcional: Cierra el formulario después de guardar
  if (onClose) onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
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
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            {...register('date', { required: 'Date is required' })}
          />
        </div>

        {type === 'Expense' && (
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select id="category" {...register('category', { required: 'Category is required' })}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="price">Price ($):</label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0.01, message: 'Price must be greater than zero' },
            })}
            placeholder="Enter price"
          />
        </div>

        <Button text="Submit" type="submit" />
      </form>
    </div>
  );
};

export default IncomeExpenseForm;