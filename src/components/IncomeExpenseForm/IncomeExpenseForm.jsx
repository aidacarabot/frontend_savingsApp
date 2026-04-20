import { useForm } from 'react-hook-form';
import './IncomeExpenseForm.css';
import Button from '../Button/Button';
import { ErrorMessage } from '../Messages/Messages';
import { fetchData } from '../../utils/api/fetchData';
import { CATEGORIES } from '../../utils/constants';
import { useEffect, useState } from 'react';

const IncomeExpenseForm = ({ onClose, onTransactionAdded, initialData = null, onTransactionUpdated }) => {
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: initialData
      ? {
          type: initialData.type || '',
          title: initialData.name || '',
          price: initialData.amount != null ? String(initialData.amount) : '',
          date: initialData.date ? initialData.date.slice(0,10) : '', // YYYY-MM-DD
          category: initialData.category || '',
        }
      : undefined,
  });

  const [displayPrice, setDisplayPrice] = useState(initialData?.amount ? initialData.amount.toLocaleString('en-US') : '');
  const [errorMessage, setErrorMessage] = useState('');

  const type = watch('type'); // Observa el campo 'type' para cambios

  // Si initialData cambia después del montaje, reseteamos via useEffect (evita llamadas sincronas a setValue)
  useEffect(() => {
    if (initialData) {
      setValue('type', initialData.type || '');
      setValue('title', initialData.name || '');
      setValue('price', initialData.amount != null ? String(initialData.amount) : '');
      setValue('date', initialData.date ? initialData.date.slice(0,10) : '');
      setValue('category', initialData.category || '');
      setDisplayPrice(initialData.amount != null ? initialData.amount.toLocaleString('en-US') : '');
    } else {
      // si no hay initialData, limpiamos el formulario
      reset();
      setDisplayPrice('');
    }
  }, [initialData, setValue, reset]);

  // Función para formatear el precio con separador de miles
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, ''); // Remover comas existentes
    
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setValue('price', value);
      
      // Formatear con separador de miles
      if (value !== '') {
        const [intPart, decPart] = value.split('.');
        const formattedInt = parseInt(intPart || '0').toLocaleString('en-US');
        const formatted = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
        setDisplayPrice(formatted);
      } else {
        setDisplayPrice('');
      }
    }
  };
  
  //? Función para manejar el envío del formulario
  const handleFormSubmit = async (data) => {
    setErrorMessage('');
    try {
      // Ajustamos los datos para que coincidan con los requerimientos del backend
      const payload = {
        type: data.type,
        name: data.title, // El backend espera "name" en lugar de "title"
        amount: parseFloat(data.price), // Convertimos el precio a número
        date: data.date,
        category: data.category || null, // Si no hay categoría, enviamos null
      };

      if (initialData && initialData._id) {
        // modo edición -> PUT
        const response = await fetchData(`/transactions/${initialData._id}`, 'PUT', payload);
        if (onTransactionUpdated) onTransactionUpdated(response);
      } else {
        // modo creación -> POST
        await fetchData('/transactions', 'POST', payload); // no necesitamos la variable response aquí
        if (onTransactionAdded) onTransactionAdded();
      }

      // Reseteamos el formulario después de enviarlo (solo si no es edición)
      if (!initialData) reset();

      // Opcional: Cierra el formulario después de guardar
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrorMessage('Error saving transaction. Please try again.');
    }
  };

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