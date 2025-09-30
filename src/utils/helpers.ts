/**
 * General utility functions for GP360 application
 */

import { FILE_CONFIG, VALIDATION_RULES, DATE_FORMATS } from "./config";

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(FILE_CONFIG.MAX_SIZE)}`,
    };
  }

  // Check file type
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!FILE_CONFIG.ALLOWED_TYPES.includes(fileExtension)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${FILE_CONFIG.ALLOWED_TYPES.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Generate user initials from name
 */
export function generateInitials(name: string): string {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  return VALIDATION_RULES.PHONE_REGEX.test(phone);
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format date to display format
 */
export function formatDate(
  date: string | Date,
  format: string = DATE_FORMATS.DISPLAY_DATE,
): string {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const pad = (num: number) => num.toString().padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

/**
 * Format relative time (time ago)
 */
export function formatTimeAgo(
  date: string | Date,
  locale: string = "es",
): string {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const timeUnits = {
    es: {
      second: "segundo",
      seconds: "segundos",
      minute: "minuto",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
      day: "día",
      days: "días",
      week: "semana",
      weeks: "semanas",
      month: "mes",
      months: "meses",
      year: "año",
      years: "años",
      now: "ahora mismo",
      ago: "hace",
    },
    en: {
      second: "second",
      seconds: "seconds",
      minute: "minute",
      minutes: "minutes",
      hour: "hour",
      hours: "hours",
      day: "day",
      days: "days",
      week: "week",
      weeks: "weeks",
      month: "month",
      months: "months",
      year: "year",
      years: "years",
      now: "just now",
      ago: "",
    },
  };

  const units = timeUnits[locale as keyof typeof timeUnits] || timeUnits.es;

  if (diffInSeconds < 60) {
    if (diffInSeconds < 5) return units.now;
    const count = diffInSeconds;
    const unit = count === 1 ? units.second : units.seconds;
    return locale === "es"
      ? `${units.ago} ${count} ${unit}`
      : `${count} ${unit} ${units.ago}`;
  }

  if (diffInSeconds < 3600) {
    const count = Math.floor(diffInSeconds / 60);
    const unit = count === 1 ? units.minute : units.minutes;
    return locale === "es"
      ? `${units.ago} ${count} ${unit}`
      : `${count} ${unit} ${units.ago}`;
  }

  if (diffInSeconds < 86400) {
    const count = Math.floor(diffInSeconds / 3600);
    const unit = count === 1 ? units.hour : units.hours;
    return locale === "es"
      ? `${units.ago} ${count} ${unit}`
      : `${count} ${unit} ${units.ago}`;
  }

  if (diffInSeconds < 604800) {
    const count = Math.floor(diffInSeconds / 86400);
    const unit = count === 1 ? units.day : units.days;
    return locale === "es"
      ? `${units.ago} ${count} ${unit}`
      : `${count} ${unit} ${units.ago}`;
  }

  if (diffInSeconds < 2629746) {
    const count = Math.floor(diffInSeconds / 604800);
    const unit = count === 1 ? units.week : units.weeks;
    return locale === "es"
      ? `${units.ago} ${count} ${unit}`
      : `${count} ${unit} ${units.ago}`;
  }

  if (diffInSeconds < 31556952) {
    const count = Math.floor(diffInSeconds / 2629746);
    const unit = count === 1 ? units.month : units.months;
    return locale === "es"
      ? `${units.ago} ${count} ${unit}`
      : `${count} ${unit} ${units.ago}`;
  }

  const count = Math.floor(diffInSeconds / 31556952);
  const unit = count === 1 ? units.year : units.years;
  return locale === "es"
    ? `${units.ago} ${count} ${unit}`
    : `${count} ${unit} ${units.ago}`;
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Convert string to slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  return Object.keys(obj).length === 0;
}

/**
 * Get nested object property safely
 */
export function getNestedProperty(
  obj: any,
  path: string,
  defaultValue: any = null,
): any {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== "object") return defaultValue;
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Download data as file
 */
export function downloadAsFile(
  data: string,
  filename: string,
  type: string = "text/plain",
): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "COP",
  locale: string = "es-CO",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Format number with separators
 */
export function formatNumber(num: number, locale: string = "es-CO"): string {
  return new Intl.NumberFormat(locale).format(num);
}

export default {
  formatFileSize,
  validateFile,
  generateInitials,
  isValidEmail,
  isValidPhone,
  generateRandomString,
  deepClone,
  debounce,
  throttle,
  formatDate,
  formatTimeAgo,
  capitalizeWords,
  truncateText,
  slugify,
  isEmpty,
  getNestedProperty,
  copyToClipboard,
  downloadAsFile,
  formatCurrency,
  formatNumber,
};
