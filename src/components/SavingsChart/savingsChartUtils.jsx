export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

export const formatTooltipTitle = (name, viewBy) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (viewBy) {
    case 'Month': {
      const date = new Date(currentYear, currentMonth, parseInt(name));
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    case 'Year': {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(name);
      const date = new Date(currentYear, monthIndex, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    case 'All-Time':
      return name;
    default:
      return name;
  }
};

export const formatPreviousPeriodLabel = (name, viewBy) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (viewBy) {
    case 'Month': {
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const date = new Date(previousYear, previousMonth, parseInt(name));
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    case 'Year': {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(name);
      const date = new Date(currentYear - 1, monthIndex, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    default:
      return name;
  }
};

export const getLegendNames = (viewBy) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  switch (viewBy) {
    case 'Month': {
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return {
        current: `${monthNames[currentMonth]} ${currentYear}`,
        previous: `${monthNames[previousMonth]} ${previousYear}`
      };
    }
    case 'Year':
      return { current: `${currentYear}`, previous: `${currentYear - 1}` };
    case 'All-Time':
      return { current: 'Balance', previous: '' };
    default:
      return { current: 'Current Period', previous: 'Previous Period' };
  }
};
