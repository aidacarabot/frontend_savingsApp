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

  // Format number with commas
  const formatNumber = (value) => {
    if (!value) return '';
    const num = value.replace(/[^\d.]/g, '');
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Parse formatted number to float
  const parseFormattedNumber = (value) => {
    if (!value) return '';
    return value.replace(/,/g, '');
  };

  const handlePriceChange = (setter) => (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d.]/g, '');
    const formatted = formatNumber(cleaned);
    setter(formatted);
  };

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
      priceMin: priceMin !== '' ? parseFloat(parseFormattedNumber(priceMin)) : null,
      priceMax: priceMax !== '' ? parseFloat(parseFormattedNumber(priceMax)) : null,
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

      <div className="filter-section">
        <h4 className="filter-section-title">Date Range</h4>
        <div className="filter-row">
          <label>From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <label>To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      {(view === 'Expenses' || view === 'Income') && (
        <div className="filter-section">
          <h4 className="filter-section-title">Price Range</h4>
          <div className="filter-row price-row">
            <div className="price-input-group">
              <label>Min</label>
              <div className="input-with-currency">
                <span className="currency-symbol">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={priceMin}
                  onChange={handlePriceChange(setPriceMin)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="price-input-group">
              <label>Max</label>
              <div className="input-with-currency">
                <span className="currency-symbol">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={priceMax}
                  onChange={handlePriceChange(setPriceMax)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'Expenses' && (
        <div className="filter-section">
          <h4 className="filter-section-title">Category</h4>
          <div className="filter-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsFilter;