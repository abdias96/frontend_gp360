/**
 * Configuration utilities for GP360 application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_APP_API_URL,
  TIMEOUT: parseInt(import.meta.env.VITE_APP_API_TIMEOUT) || 30000,
  TOKEN_REFRESH_THRESHOLD:
    parseInt(import.meta.env.VITE_APP_TOKEN_REFRESH_THRESHOLD) || 300000,
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME,
  VERSION: import.meta.env.VITE_APP_VERSION,
  FULL_NAME: import.meta.env.VITE_APP_FULL_NAME,
  FRONTEND_URL: import.meta.env.VITE_APP_FRONTEND_URL,
  ENV: import.meta.env.VITE_APP_ENV || "development",
} as const;

// Feature Flags
export const FEATURES = {
  LOGGING: import.meta.env.VITE_APP_ENABLE_LOGGING === "true",
  ANALYTICS: import.meta.env.VITE_APP_ENABLE_ANALYTICS === "true",
  DEBUG: import.meta.env.VITE_APP_ENABLE_DEBUG === "true",
} as const;

// Storage Configuration
export const STORAGE_CONFIG = {
  PREFIX: import.meta.env.VITE_APP_STORAGE_PREFIX || "gp360_",
  TOKEN_KEY: "id_token",
  LANGUAGE_KEY: "lang",
  THEME_KEY: "theme",
  USER_PREFERENCES_KEY: "user_preferences",
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: parseInt(import.meta.env.VITE_APP_MAX_FILE_SIZE) || 10485760, // 10MB
  ALLOWED_TYPES: (
    import.meta.env.VITE_APP_ALLOWED_FILE_TYPES ||
    "pdf,doc,docx,xls,xlsx,jpg,jpeg,png"
  ).split(","),
  IMAGE_TYPES: ["jpg", "jpeg", "png", "gif", "webp"],
  DOCUMENT_TYPES: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_APP_DEFAULT_PAGE_SIZE) || 15,
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_APP_MAX_PAGE_SIZE) || 100,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100],
} as const;

// Internationalization Configuration
export const I18N_CONFIG = {
  DEFAULT_LOCALE: import.meta.env.VITE_APP_DEFAULT_LOCALE || "es",
  AVAILABLE_LOCALES: (
    import.meta.env.VITE_APP_AVAILABLE_LOCALES || "en,es"
  ).split(","),
  FALLBACK_LOCALE: "en",
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: import.meta.env.VITE_APP_DEFAULT_THEME || "light",
  AVAILABLE_THEMES: ["light", "dark"],
} as const;

// Contact Information
export const CONTACT_INFO = {
  EMAIL: import.meta.env.VITE_APP_CONTACT_EMAIL,
  PHONE: import.meta.env.VITE_APP_CONTACT_PHONE,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Local Storage Keys with prefix
export const STORAGE_KEYS = {
  TOKEN: `${STORAGE_CONFIG.PREFIX}${STORAGE_CONFIG.TOKEN_KEY}`,
  LANGUAGE: `${STORAGE_CONFIG.PREFIX}${STORAGE_CONFIG.LANGUAGE_KEY}`,
  THEME: `${STORAGE_CONFIG.PREFIX}${STORAGE_CONFIG.THEME_KEY}`,
  USER_PREFERENCES: `${STORAGE_CONFIG.PREFIX}${STORAGE_CONFIG.USER_PREFERENCES_KEY}`,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  NAME_MAX_LENGTH: 100,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DATE_ONLY: "YYYY-MM-DD",
  DATE_TIME: "YYYY-MM-DD HH:mm:ss",
  TIME_ONLY: "HH:mm:ss",
  DISPLAY_DATE: "DD/MM/YYYY",
  DISPLAY_DATE_TIME: "DD/MM/YYYY HH:mm",
} as const;

// Application Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PASSWORD_RESET: "/auth/password-reset",
  DASHBOARD: "/dashboard",
  PROFILE: "/user/profile",
  USERS: "/users",
  SETTINGS: "/user/settings",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  OPERATOR: "operator",
  USER: "user",
} as const;

// Application States
export const APP_STATES = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
} as const;

export default {
  API_CONFIG,
  APP_CONFIG,
  FEATURES,
  STORAGE_CONFIG,
  FILE_CONFIG,
  PAGINATION_CONFIG,
  I18N_CONFIG,
  THEME_CONFIG,
  CONTACT_INFO,
  HTTP_STATUS,
  STORAGE_KEYS,
  VALIDATION_RULES,
  DATE_FORMATS,
  ROUTES,
  USER_ROLES,
  APP_STATES,
};
