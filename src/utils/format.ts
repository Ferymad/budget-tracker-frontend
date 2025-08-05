import { format, parseISO, isValid } from 'date-fns';
import { CURRENCY_FORMAT, DATE_FORMATS } from './constants';

// Currency formatting
export const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '$0.00';
  
  return new Intl.NumberFormat(CURRENCY_FORMAT.LOCALE, {
    style: 'currency',
    currency: CURRENCY_FORMAT.CURRENCY,
    minimumFractionDigits: CURRENCY_FORMAT.MINIMUM_FRACTION_DIGITS,
    maximumFractionDigits: CURRENCY_FORMAT.MAXIMUM_FRACTION_DIGITS,
  }).format(numAmount);
};

// Date formatting
export const formatDate = (date: string | Date, formatString: string = DATE_FORMATS.DISPLAY): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

// Format for date input fields
export const formatDateForInput = (date: string | Date): string => {
  return formatDate(date, DATE_FORMATS.INPUT);
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format large numbers
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format transaction type for display
export const formatTransactionType = (type: string): string => {
  return capitalize(type);
};

// Format budget period for display
export const formatBudgetPeriod = (period: string): string => {
  return capitalize(period);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Format validation errors
export const formatValidationError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (Array.isArray(error)) {
    return error.join(', ');
  }
  
  return 'Invalid input';
};