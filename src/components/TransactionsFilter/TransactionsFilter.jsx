import { useEffect, useState, useMemo } from 'react';
import { CATEGORIES } from '../../utils/constants';
import Button from '../Button/Button';
import './TransactionsFilter.css';

const TransactionsFilter = ({ view = 'All', onChange = () => {} }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [category, setCategory] = useState('');

  // Resetea filtros cuando cambia la view
  useEffect(() => {
    setDateFrom('');
    setDateTo('');
    setPriceMin('');
    setPriceMax('');
    setCategory('');
    onChange({});
  }, [view, onChange]);

  // Emitir cambios al padre
  useEffect(() => {
    const payload = {
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      priceMin: priceMin !== '' ? parseFloat(priceMin) : null,
      priceMax: priceMax !== '' ? parseFloat(priceMax) : null,
      category: category || null,
    };
    onChange(payload);
  }, [dateFrom, dateTo, priceMin, priceMax, category, onChange]);

  // Determina si hay algún filtro activo (usa comparación con '' para incluir 0)
  const isAnyFilterActive = useMemo(() => {
    return (
      dateFrom !== '' ||
      dateTo !== '' ||
      priceMin !== '' ||
      priceMax !== '' ||
      category !== ''
    );
  }, [dateFrom, dateTo, priceMin, priceMax, category]);

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    setPriceMin('');
    setPriceMax('');
    setCategory('');
    onChange({});
  };

  return (
    <div className="transactions-filter">
      <div className="filter-header">
        {isAnyFilterActive && (
          <Button text="Reset Filters" onClick={handleReset} />
        )}
      </div>

      {/* Date range aparece en todas las views (All, Expenses, Income) */}
      <div className="filter-row">
        <label>Date from</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <label>to</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      {/* Price range para Expenses e Income */}
      {(view === 'Expenses' || view === 'Income') && (
        <div className="filter-row">
          <label>Price min</label>
          <input
            type="number"
            step="0.01"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="0.00"
          />
          <label>max</label>
          <input
            type="number"
            step="0.01"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="0.00"
          />
        </div>
      )}

      {/* Category selector solo para Expenses */}
      {view === 'Expenses' && (
        <div className="filter-row">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TransactionsFilter;