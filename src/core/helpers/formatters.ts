import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format a date string to a readable format
 * Handles date-only strings (YYYY-MM-DD) without timezone issues
 * @param dateString - ISO date string or Date object
 * @param formatString - Optional format string (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | null | undefined, formatString: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return '';

  try {
    let date: Date;

    if (typeof dateString === 'string') {
      // For date-only strings (YYYY-MM-DD), parse as local date to avoid timezone issues
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day); // month is 0-indexed
      } else {
        // For ISO datetime strings, use parseISO
        date = parseISO(dateString);
      }
    } else {
      date = dateString;
    }

    return format(date, formatString, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date string to a readable datetime format
 * @param dateString - ISO date string
 * @param formatString - Optional format string (default: 'dd/MM/yyyy HH:mm')
 * @returns Formatted datetime string
 */
export const formatDateTime = (dateString: string | Date | null | undefined, formatString: string = 'dd/MM/yyyy HH:mm'): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString, { locale: es });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};

/**
 * Format a date string to a time format
 * @param dateString - ISO date string
 * @param formatString - Optional format string (default: 'HH:mm')
 * @returns Formatted time string
 */
export const formatTime = (dateString: string | Date | null | undefined, formatString: string = 'HH:mm'): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString, { locale: es });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Format a number as currency
 * @param value - Numeric value
 * @param currency - Currency code (default: 'GTQ')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | null | undefined, currency: string = 'GTQ'): string => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number with thousand separators
 * @param value - Numeric value
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (value: number | null | undefined, decimals: number = 0): string => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a phone number
 * @param phone - Phone number string
 * @returns Formatted phone string
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXXX-XXXX for Guatemala
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  // Return original if doesn't match expected format
  return phone;
};

/**
 * Format a DPI number
 * @param dpi - DPI number string
 * @returns Formatted DPI string
 */
export const formatDPI = (dpi: string | null | undefined): string => {
  if (!dpi) return '';
  
  // Remove all non-digits
  const cleaned = dpi.replace(/\D/g, '');
  
  // Format as XXXX XXXXX XXXX (13 digits)
  if (cleaned.length === 13) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 9)} ${cleaned.slice(9)}`;
  }
  
  // Return original if doesn't match expected format
  return dpi;
};

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format percentage
 * @param value - Numeric value (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | null | undefined, decimals: number = 0): string => {
  if (value === null || value === undefined) return '';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export const truncateText = (text: string | null | undefined, length: number, suffix: string = '...'): string => {
  if (!text) return '';
  
  if (text.length <= length) return text;
  
  return text.substring(0, length) + suffix;
};

/**
 * Format name (capitalize first letter of each word)
 * @param name - Name string
 * @returns Formatted name
 */
export const formatName = (name: string | null | undefined): string => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format boolean value to Yes/No
 * @param value - Boolean value
 * @param trueText - Text for true value (default: 'Sí')
 * @param falseText - Text for false value (default: 'No')
 * @returns Formatted boolean string
 */
export const formatBoolean = (value: boolean | null | undefined, trueText: string = 'Sí', falseText: string = 'No'): string => {
  if (value === null || value === undefined) return '';
  
  return value ? trueText : falseText;
};

/**
 * Get relative time from now
 * @param dateString - ISO date string
 * @returns Relative time string (e.g., "hace 2 horas")
 */
export const getRelativeTime = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 604800)} semanas`;
    if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
    
    return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatCurrency,
  formatNumber,
  formatPhone,
  formatDPI,
  formatFileSize,
  formatPercentage,
  truncateText,
  formatName,
  formatBoolean,
  getRelativeTime
};