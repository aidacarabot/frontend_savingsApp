export const calculateMonthsBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return monthsDiff > 0 ? monthsDiff : 1;
};

export const addMonthsToDate = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const calculateAgeAtDate = (birthDate, targetDate, currentAge = 0) => {
  if (!birthDate || !targetDate) return currentAge;
  const birth = new Date(birthDate);
  const target = new Date(targetDate);
  let age = target.getFullYear() - birth.getFullYear();
  const monthDiff = target.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const calculateGoalData = (totalGoal, completionDate, monthlyContribution, lastUpdatedField, userData, currentAge) => {
  if (!totalGoal || totalGoal <= 0) {
    return {
      monthlySavingsNeeded: 0,
      calculatedCompletionDate: '',
      ageAtCompletion: currentAge || 0
    };
  }

  const currentDate = new Date();
  const targetAmount = parseFloat(totalGoal);
  let calculatedMonthly = 0;
  let calculatedDate = '';
  let ageAtGoal = currentAge || 0;

  if (completionDate && lastUpdatedField === 'completionDate') {
    // Usuario cambió la fecha, calcular monthly contribution
    const targetDate = new Date(completionDate);
    if (targetDate > currentDate) {
      const monthsToGoal = calculateMonthsBetween(currentDate, targetDate);
      calculatedMonthly = targetAmount / monthsToGoal;
      calculatedDate = completionDate;
      ageAtGoal = userData?.birthDate ? calculateAgeAtDate(userData.birthDate, targetDate, currentAge) : currentAge || 0;
    }
  } else if (monthlyContribution && monthlyContribution > 0 && lastUpdatedField === 'monthlyContribution') {
    // Usuario cambió la contribución mensual, calcular fecha
    const monthly = parseFloat(monthlyContribution);
    if (monthly > 0) {
      const monthsNeeded = Math.ceil(targetAmount / monthly);
      // Limitar a un máximo razonable de años (ej: 50 años)
      if (monthsNeeded <= 600) { // 50 años * 12 meses
        const calculatedDateObj = addMonthsToDate(currentDate, monthsNeeded);
        calculatedDate = calculatedDateObj.toISOString().split('T')[0];
        calculatedMonthly = monthly;
        ageAtGoal = userData?.birthDate ? calculateAgeAtDate(userData.birthDate, calculatedDateObj, currentAge) : currentAge || 0;
      }
    }
  } else if (completionDate && monthlyContribution && monthlyContribution > 0) {
    // Ambos campos tienen valores, mostrar la información
    const targetDate = new Date(completionDate);
    const monthly = parseFloat(monthlyContribution);
    
    if (targetDate > currentDate && monthly > 0) {
      calculatedMonthly = monthly;
      calculatedDate = completionDate;
      ageAtGoal = userData?.birthDate ? calculateAgeAtDate(userData.birthDate, targetDate, currentAge) : currentAge || 0;
    }
  }

  return {
    monthlySavingsNeeded: calculatedMonthly,
    calculatedCompletionDate: calculatedDate,
    ageAtCompletion: ageAtGoal
  };
};