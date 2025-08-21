const getTransactionImage = (type, category) => {
  if (type === 'Income') {
    return '/assets/income.png'; // Imagen por defecto para "Income"
  }

  if (type === 'Expense') {
    // Devuelve una imagen específica según la categoría
    switch (category) {
      case 'Home 🏠':
        return '/assets/home.png';
      case 'Transportation 🚗':
        return '/assets/transportation.png';
      case 'Groceries 🛒':
        return '/assets/groceries.png';
      case 'Health 🏥':
        return '/assets/health.png';
      case 'Entertainment 🎭':
        return '/assets/entertainment.png';
      case 'Travel ✈️':
        return '/assets/travel.png';
      case 'Subscriptions 💳':
        return '/assets/subscriptions.png';
      case 'Shopping 🛍️':
        return '/assets/shopping.png';
      case 'Education 📚':
        return '/assets/education.png';
      case 'Gifts 🎁':
        return '/assets/gifts.png';
      case 'Debt 🏦':
        return '/assets/debt.png';
      case 'Leisure 🍸':
        return '/assets/leisure.png';
      case 'Other ❓':
        return '/assets/other.png';
      default:
        return '/assets/expense.png'; // Imagen por defecto para "Expense"
    }
  }

  return '/assets/default.png'; // Imagen por defecto si no se cumple ninguna condición
};

export default getTransactionImage;