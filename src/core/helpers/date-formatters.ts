/**
 * Date formatting utilities for form inputs
 */

/**
 * Formats a date string to YYYY-MM-DD format for HTML date inputs
 * @param dateString - The date string to format (ISO, or any valid date format)
 * @returns Formatted date string (YYYY-MM-DD) or empty string if invalid
 */
export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  
  try {
    // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Convertir fecha ISO o cualquier formato válido a YYYY-MM-DD para input date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return "";
    }
    
    // Usar toISOString y dividir por 'T' para obtener solo la parte de fecha
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return "";
  }
};

/**
 * Formats a date string to YYYY-MM-DDTHH:mm format for HTML datetime-local inputs
 * @param dateString - The date string to format (ISO, or any valid date format)
 * @returns Formatted datetime string (YYYY-MM-DDTHH:mm) or empty string if invalid
 */
export const formatDateTimeForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return "";
    }
    
    // Formatear para datetime-local input
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error formatting datetime:', dateString, error);
    return "";
  }
};

/**
 * Formats a time string to HH:mm format for HTML time inputs
 * @param timeString - The time string to format
 * @returns Formatted time string (HH:mm) or empty string if invalid
 */
export const formatTimeForInput = (timeString: string | null | undefined): string => {
  if (!timeString) return "";
  
  try {
    // Si es una fecha completa, extraer solo la hora
    if (timeString.includes('T') || timeString.includes(' ')) {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid time format:', timeString);
        return "";
      }
      return date.toTimeString().slice(0, 5); // HH:mm
    }
    
    // Si ya está en formato HH:mm, devolverlo tal como está
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    console.warn('Unrecognized time format:', timeString);
    return "";
  } catch (error) {
    console.error('Error formatting time:', timeString, error);
    return "";
  }
};