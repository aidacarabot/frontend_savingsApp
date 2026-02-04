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

  useEffect(() => {
    setDateFrom('');
    setDateTo('');
    setPriceMin('');
    setPriceMax('');
    setCategory('');
    onChange({});
  }, [view, onChange]);

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
      {isAnyFilterActive && (
        <div className="filter-header">
          <Button text="Clear" onClick={handleReset} />
        </div>
      )}

      <div className="filter-row">
        <label>From</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <label>To</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      {(view === 'Expenses' || view === 'Income') && (
        <div className="filter-row">
          <label>Min</label>
          <input
            type="number"
            step="0.01"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="0"
          />
          <label>Max</label>
          <input
            type="number"
            step="0.01"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="0"
          />
        </div>
      )}

      {view === 'Expenses' && (
        <div className="filter-row">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
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