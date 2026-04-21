import { Frown, Meh, Smile, Laugh, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const colors = ['#27ebc8', '#1bc9aa', '#0fa88d'];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors }), 150);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors }), 300);
};

export const getGoalIcon = (percentage, isCompleted) => {
  if (isCompleted) return PartyPopper;
  if (percentage < 20) return Frown;
  if (percentage < 50) return Meh;
  if (percentage < 75) return Smile;
  return Laugh;
};

export const getNextValidCompletionDate = (completionDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedDate = completionDate ? new Date(completionDate) : null;
  const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
  if (hasValidDate && parsedDate > today) {
    return parsedDate.toISOString().split('T')[0];
  }
  const fallbackDate = new Date(today);
  fallbackDate.setDate(fallbackDate.getDate() + 1);
  return fallbackDate.toISOString().split('T')[0];
};

export const calculateAgeAtCompletion = (completionDate, birthDate) => {
  if (!completionDate || !birthDate) return 0;
  const birth = new Date(birthDate);
  const goalDate = new Date(completionDate);
  let age = goalDate.getFullYear() - birth.getFullYear();
  const monthDiff = goalDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && goalDate.getDate() < birth.getDate())) age--;
  return age;
};

export const calculateCompletionPercentage = (currentAmount, targetAmount) => {
  if (!targetAmount || targetAmount <= 0) return 0;
  return Math.min((currentAmount / targetAmount) * 100, 100);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const updateGoalAmount = async (goal, newAmount, fetchData) => {
  try {
    await fetchData(`/goals/${goal._id}`, 'PUT', { currentAmount: newAmount });
    return null;
  } catch (error) {
    const hasCompletionDateError =
      typeof error?.error === 'string' && error.error.includes('completionDate');
    if (!hasCompletionDateError) throw error;
    const adjustedCompletionDate = getNextValidCompletionDate(goal.completionDate);
    await fetchData(`/goals/${goal._id}`, 'PUT', { currentAmount: newAmount, completionDate: adjustedCompletionDate });
    return adjustedCompletionDate;
  }
};
