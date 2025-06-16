
import { Stats } from '../types';
import { UserData } from '../types';

export const calculateStats = (userData: UserData | null): Stats => {
  if (!userData || !userData.currentAttemptStartDate) {
    return { daysSmokeFree: 0, hoursSmokeFree: 0, minutesSmokeFree: 0, secondsSmokeFree: 0, cigarettesNotSmoked: 0, moneySaved: 0 };
  }

  const now = new Date();
  const startDate = new Date(userData.currentAttemptStartDate);
  const diffMs = now.getTime() - startDate.getTime();

  if (diffMs < 0) {
     return { daysSmokeFree: 0, hoursSmokeFree: 0, minutesSmokeFree: 0, secondsSmokeFree: 0, cigarettesNotSmoked: 0, moneySaved: 0 };
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const cigarettesNotSmoked = Math.floor(days * userData.cigarettesPerDay + (hours % 24) * (userData.cigarettesPerDay / 24));
  const moneySaved = userData.packSize > 0 ? (cigarettesNotSmoked / userData.packSize) * userData.packPrice : 0;

  return {
    daysSmokeFree: days,
    hoursSmokeFree: hours % 24,
    minutesSmokeFree: minutes % 60,
    secondsSmokeFree: seconds % 60,
    cigarettesNotSmoked: Math.max(0, cigarettesNotSmoked),
    moneySaved: Math.max(0, parseFloat(moneySaved.toFixed(2))),
  };
};

export const formatTimeDifference = (days: number, hours: number, minutes: number): string => {
  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`); // Show hours if days > 0 even if hours is 0
  parts.push(`${minutes}m`);
  return parts.join(' ');
};

export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
    