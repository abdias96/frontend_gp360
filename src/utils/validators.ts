/**
 * Validation utilities for GP360 application
 */

import { VALIDATION_RULES } from "./config";

export type ValidationResult = {
  valid: boolean;
  message?: string;
};

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, message: "El correo electrónico es requerido" };
  }

  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      message: "El formato del correo electrónico no es válido",
    };
  }

  return { valid: true };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: "La contraseña es requerida" };
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`,
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos una letra mayúscula",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos una letra minúscula",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos un número",
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos un carácter especial",
    };
  }

  return { valid: true };
}

/**
 * Username validation
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { valid: false, message: "El nombre de usuario es requerido" };
  }

  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `El nombre de usuario debe tener al menos ${VALIDATION_RULES.USERNAME_MIN_LENGTH} caracteres`,
    };
  }

  if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `El nombre de usuario no puede tener más de ${VALIDATION_RULES.USERNAME_MAX_LENGTH} caracteres`,
    };
  }

  // Only allow alphanumeric characters, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      message:
        "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos",
    };
  }

  return { valid: true };
}

/**
 * Name validation
 */
export function validateName(
  name: string,
  fieldName: string = "nombre",
): ValidationResult {
  if (!name) {
    return { valid: false, message: `El ${fieldName} es requerido` };
  }

  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `El ${fieldName} no puede tener más de ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`,
    };
  }

  // Only allow letters, spaces, apostrophes, and hyphens
  if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/.test(name)) {
    return {
      valid: false,
      message: `El ${fieldName} solo puede contener letras, espacios, apostrofes y guiones`,
    };
  }

  return { valid: true };
}

/**
 * Phone validation
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, message: "El número de teléfono es requerido" };
  }

  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return {
      valid: false,
      message: "El formato del número de teléfono no es válido",
    };
  }

  return { valid: true };
}

/**
 * Required field validation
 */
export function validateRequired(
  value: any,
  fieldName: string,
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return { valid: false, message: `${fieldName} es requerido` };
  }

  if (typeof value === "string" && value.trim() === "") {
    return { valid: false, message: `${fieldName} es requerido` };
  }

  return { valid: true };
}

/**
 * Minimum length validation
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string,
): ValidationResult {
  if (!value) {
    return { valid: false, message: `${fieldName} es requerido` };
  }

  if (value.length < minLength) {
    return {
      valid: false,
      message: `${fieldName} debe tener al menos ${minLength} caracteres`,
    };
  }

  return { valid: true };
}

/**
 * Maximum length validation
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string,
): ValidationResult {
  if (value && value.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} no puede tener más de ${maxLength} caracteres`,
    };
  }

  return { valid: true };
}

/**
 * Numeric validation
 */
export function validateNumeric(
  value: string,
  fieldName: string,
): ValidationResult {
  if (!value) {
    return { valid: false, message: `${fieldName} es requerido` };
  }

  if (!/^\d+$/.test(value)) {
    return {
      valid: false,
      message: `${fieldName} debe contener solo números`,
    };
  }

  return { valid: true };
}

/**
 * Range validation for numbers
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): ValidationResult {
  if (value < min || value > max) {
    return {
      valid: false,
      message: `${fieldName} debe estar entre ${min} y ${max}`,
    };
  }

  return { valid: true };
}

/**
 * Date validation
 */
export function validateDate(
  dateString: string,
  fieldName: string = "fecha",
): ValidationResult {
  if (!dateString) {
    return { valid: false, message: `La ${fieldName} es requerida` };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      message: `La ${fieldName} no tiene un formato válido`,
    };
  }

  return { valid: true };
}

/**
 * Future date validation
 */
export function validateFutureDate(
  dateString: string,
  fieldName: string = "fecha",
): ValidationResult {
  const dateValidation = validateDate(dateString, fieldName);
  if (!dateValidation.valid) {
    return dateValidation;
  }

  const date = new Date(dateString);
  const now = new Date();

  if (date <= now) {
    return {
      valid: false,
      message: `La ${fieldName} debe ser en el futuro`,
    };
  }

  return { valid: true };
}

/**
 * Past date validation
 */
export function validatePastDate(
  dateString: string,
  fieldName: string = "fecha",
): ValidationResult {
  const dateValidation = validateDate(dateString, fieldName);
  if (!dateValidation.valid) {
    return dateValidation;
  }

  const date = new Date(dateString);
  const now = new Date();

  if (date >= now) {
    return {
      valid: false,
      message: `La ${fieldName} debe ser en el pasado`,
    };
  }

  return { valid: true };
}

/**
 * File validation
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number,
): ValidationResult {
  if (!file) {
    return { valid: false, message: "El archivo es requerido" };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      message: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`,
    };
  }

  // Check file type
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      message: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * URL validation
 */
export function validateURL(
  url: string,
  fieldName: string = "URL",
): ValidationResult {
  if (!url) {
    return { valid: false, message: `La ${fieldName} es requerida` };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return {
      valid: false,
      message: `La ${fieldName} no tiene un formato válido`,
    };
  }
}

/**
 * Validate multiple fields
 */
export function validateFields(
  data: Record<string, any>,
  rules: Record<string, (value: any) => ValidationResult>,
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let valid = true;

  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    if (!result.valid) {
      errors[field] = result.message || "Campo inválido";
      valid = false;
    }
  }

  return { valid, errors };
}

/**
 * Form validation helper
 */
export class FormValidator {
  private errors: Record<string, string> = {};

  validate(
    field: string,
    value: any,
    validators: ((value: any) => ValidationResult)[],
  ): boolean {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        this.errors[field] = result.message || "Campo inválido";
        return false;
      }
    }

    delete this.errors[field];
    return true;
  }

  getErrors(): Record<string, string> {
    return { ...this.errors };
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getError(field: string): string | undefined {
    return this.errors[field];
  }

  clearErrors(): void {
    this.errors = {};
  }

  clearError(field: string): void {
    delete this.errors[field];
  }
}

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validateRange,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateFile,
  validateURL,
  validateFields,
  FormValidator,
};
