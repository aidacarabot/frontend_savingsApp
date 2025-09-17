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

export const calculateGoalData = (
  totalGoal, 
  completionDate, 
  monthlyContribution, 
  lastUpdatedField, 
  userData, 
  currentAge
) => {
  if (!totalGoal || totalGoal <= 0) {
    return {
      monthlySavingsNeeded: 0,
      calculatedCompletionDate: '',
      ageAtCompletion: currentAge || 0,
      shouldUpdateMonthly: false,
      shouldUpdateDate: false
    };
  }

  const currentDate = new Date();
  const targetAmount = parseFloat(totalGoal);
  let calculatedMonthly = 0;
  let calculatedDate = '';
  let ageAtGoal = currentAge || 0;
  let shouldUpdateMonthly = false;
  let shouldUpdateDate = false;

  // Priorizar cálculos basado en el último campo actualizado
  if (completionDate && (lastUpdatedField === 'completionDate' || lastUpdatedField === 'totalGoal')) {
    // Calcular monthly contribution basado en fecha
    const targetDate = new Date(completionDate);
    if (targetDate > currentDate) {
      const monthsToGoal = calculateMonthsBetween(currentDate, targetDate);
      calculatedMonthly = targetAmount / monthsToGoal;
      calculatedDate = completionDate;
      ageAtGoal = userData?.birthDate ? calculateAgeAtDate(userData.birthDate, targetDate, currentAge) : currentAge || 0;
      shouldUpdateMonthly = lastUpdatedField !== 'monthlyContribution';
    }
  } else if (monthlyContribution && monthlyContribution > 0 && (lastUpdatedField === 'monthlyContribution' || lastUpdatedField === 'totalGoal')) {
    // Calcular fecha basado en contribución mensual
    const monthly = parseFloat(monthlyContribution);
    if (monthly > 0) {
      const monthsNeeded = Math.ceil(targetAmount / monthly);
      if (monthsNeeded <= 600) { // Límite de 50 años
        const calculatedDateObj = addMonthsToDate(currentDate, monthsNeeded);
        calculatedDate = calculatedDateObj.toISOString().split('T')[0];
        calculatedMonthly = monthly;
        ageAtGoal = userData?.birthDate ? calculateAgeAtDate(userData.birthDate, calculatedDateObj, currentAge) : currentAge || 0;
        shouldUpdateDate = lastUpdatedField !== 'completionDate';
      }
    }
  } else if (completionDate && monthlyContribution && monthlyContribution > 0) {
    // Ambos campos tienen valores - solo mostrar información
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
    ageAtCompletion: ageAtGoal,
    shouldUpdateMonthly,
    shouldUpdateDate
  };
};