import {
  House, Car, ShoppingCart, HeartPulse, Drama, Plane,
  ShoppingBag, Landmark, Beer,
  Coins, Wallet, ChartNoAxesCombined
} from 'lucide-react';
import { CATEGORY_STYLES } from '../../utils/constants';

const iconMap = {
  House, Car, ShoppingCart, HeartPulse, Drama, Plane,
  ShoppingBag, Landmark, Beer,
  Coins, Wallet, ChartNoAxesCombined
};

export const getCategoryStyle = (transaction) => {
  const key = transaction.category || transaction.type;
  return CATEGORY_STYLES[key] || CATEGORY_STYLES['Other'];
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || Coins;
};

export const formatAmount = (amount) => {
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [integerPart, decimalPart] = formatted.split('.');
  return (
    <>
      {integerPart}
      <span className="cents">.{decimalPart}</span>
    </>
  );
};

export const groupByDate = (items) => {
  const grouped = {};
  items.forEach((tx) => {
    const date = new Date(tx.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(tx);
  });
  return grouped;
};

export const applyFilters = (items, view, filters) => {
  return items.filter((tx) => {
    if (view === 'Expenses' && tx.type !== 'Expense') return false;
    if (view === 'Income' && tx.type !== 'Income') return false;

    if (filters.dateFrom) {
      const txDate = new Date(tx.date).setHours(0, 0, 0, 0);
      const from = new Date(filters.dateFrom).setHours(0, 0, 0, 0);
      if (txDate < from) return false;
    }
    if (filters.dateTo) {
      const txDate = new Date(tx.date).setHours(0, 0, 0, 0);
      const to = new Date(filters.dateTo).setHours(0, 0, 0, 0);
      if (txDate > to) return false;
    }

    if (filters.priceMin != null && Number(tx.amount) < Number(filters.priceMin)) return false;
    if (filters.priceMax != null && Number(tx.amount) > Number(filters.priceMax)) return false;

    if (filters.category) {
      if (!tx.category || tx.category !== filters.category) return false;
    }

    return true;
  });
};
