import { useEffect, useState } from 'react';
import { fetchData } from '../utils/api/fetchData';

const useIncomeExpenseForm = ({ initialData, onClose, onTransactionAdded, onTransactionUpdated, setValue, reset }) => {
  const [displayPrice, setDisplayPrice] = useState(
    initialData?.amount ? initialData.amount.toLocaleString('en-US') : ''
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setValue('type', initialData.type || '');
      setValue('title', initialData.name || '');
      setValue('price', initialData.amount != null ? String(initialData.amount) : '');
      setValue('date', initialData.date ? initialData.date.slice(0, 10) : '');
      setValue('category', initialData.category || '');
      setDisplayPrice(initialData.amount != null ? initialData.amount.toLocaleString('en-US') : '');
    } else {
      reset();
      setDisplayPrice('');
    }
  }, [initialData, setValue, reset]);

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setValue('price', value);
      if (value !== '') {
        const [intPart, decPart] = value.split('.');
        const formattedInt = parseInt(intPart || '0').toLocaleString('en-US');
        setDisplayPrice(decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt);
      } else {
        setDisplayPrice('');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    setErrorMessage('');
    try {
      const payload = {
        type: data.type,
        name: data.title,
        amount: parseFloat(data.price),
        date: data.date,
        category: data.category || null,
      };
      if (initialData && initialData._id) {
        const response = await fetchData(`/transactions/${initialData._id}`, 'PUT', payload);
        if (onTransactionUpdated) onTransactionUpdated(response);
      } else {
        await fetchData('/transactions', 'POST', payload);
        if (onTransactionAdded) onTransactionAdded();
      }
      if (!initialData) reset();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrorMessage('Error saving transaction. Please try again.');
    }
  };

  return { displayPrice, errorMessage, handlePriceChange, handleFormSubmit };
};

export default useIncomeExpenseForm;
