/**
 * Local Storage utilities for GP360 application
 */

import { STORAGE_KEYS } from "./config";

/**
 * Enhanced localStorage wrapper with error handling and type safety
 */
export class Storage {
  private static prefix = "siapen_";

  /**
   * Set item in localStorage
   */
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${this.prefix}${key}`, serializedValue);
      return true;
    } catch (error) {
      console.error("Error setting localStorage item:", error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  static getItem<T = any>(
    key: string,
    defaultValue: T | null = null,
  ): T | null {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
      return true;
    } catch (error) {
      console.error("Error removing localStorage item:", error);
      return false;
    }
  }

  /**
   * Clear all items with our prefix
   */
  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  static hasItem(key: string): boolean {
    return localStorage.getItem(`${this.prefix}${key}`) !== null;
  }

  /**
   * Get all keys with our prefix
   */
  static getKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.replace(this.prefix, ""));
  }

  /**
   * Get storage size in bytes
   */
  static getSize(): number {
    let total = 0;
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    });
    return total;
  }
}

/**
 * JWT Token management
 */
export class TokenStorage {
  private static readonly TOKEN_KEY = "id_token";

  static getToken(): string | null {
    return Storage.getItem<string>(this.TOKEN_KEY);
  }

  static setToken(token: string): boolean {
    return Storage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): boolean {
    return Storage.removeItem(this.TOKEN_KEY);
  }

  static hasToken(): boolean {
    return Storage.hasItem(this.TOKEN_KEY);
  }

  /**
   * Check if token is expired (basic check)
   */
  static isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }
}

/**
 * User preferences management
 */
export class PreferencesStorage {
  private static readonly PREFERENCES_KEY = "user_preferences";

  static getPreferences(): Record<string, any> {
    return Storage.getItem(this.PREFERENCES_KEY, {});
  }

  static setPreference(key: string, value: any): boolean {
    const preferences = this.getPreferences();
    preferences[key] = value;
    return Storage.setItem(this.PREFERENCES_KEY, preferences);
  }

  static getPreference<T = any>(
    key: string,
    defaultValue: T | null = null,
  ): T | null {
    const preferences = this.getPreferences();
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  }

  static removePreference(key: string): boolean {
    const preferences = this.getPreferences();
    delete preferences[key];
    return Storage.setItem(this.PREFERENCES_KEY, preferences);
  }

  static clearPreferences(): boolean {
    return Storage.removeItem(this.PREFERENCES_KEY);
  }
}

/**
 * Language settings management
 */
export class LanguageStorage {
  private static readonly LANGUAGE_KEY = "lang";

  static getLanguage(): string {
    return Storage.getItem<string>(this.LANGUAGE_KEY, "es") || "es";
  }

  static setLanguage(language: string): boolean {
    return Storage.setItem(this.LANGUAGE_KEY, language);
  }
}

/**
 * Theme settings management
 */
export class ThemeStorage {
  private static readonly THEME_KEY = "theme";

  static getTheme(): string {
    return Storage.getItem<string>(this.THEME_KEY, "light") || "light";
  }

  static setTheme(theme: string): boolean {
    return Storage.setItem(this.THEME_KEY, theme);
  }
}

/**
 * Cache item interface
 */
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Cache management for API responses
 */
export class CacheStorage {
  private static readonly CACHE_PREFIX = "cache_";
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): boolean {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    return Storage.setItem(`${this.CACHE_PREFIX}${key}`, cacheItem);
  }

  static get<T>(key: string): T | null {
    const cacheItem = Storage.getItem<CacheItem<T>>(
      `${this.CACHE_PREFIX}${key}`,
    );

    if (!cacheItem) return null;

    const now = Date.now();
    if (now - cacheItem.timestamp > cacheItem.ttl) {
      this.remove(key);
      return null;
    }

    return cacheItem.data;
  }

  static remove(key: string): boolean {
    return Storage.removeItem(`${this.CACHE_PREFIX}${key}`);
  }

  static clear(): boolean {
    const keys = Storage.getKeys();
    keys.forEach((key) => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        Storage.removeItem(key);
      }
    });
    return true;
  }

  static clearExpired(): number {
    const keys = Storage.getKeys();
    const now = Date.now();
    let clearedCount = 0;

    keys.forEach((key) => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        const cacheItem = Storage.getItem<CacheItem>(key);
        if (cacheItem && now - cacheItem.timestamp > cacheItem.ttl) {
          Storage.removeItem(key);
          clearedCount++;
        }
      }
    });

    return clearedCount;
  }
}

/**
 * Session storage wrapper
 */
export class SessionStorage {
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error("Error setting sessionStorage item:", error);
      return false;
    }
  }

  static getItem<T = any>(
    key: string,
    defaultValue: T | null = null,
  ): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error("Error getting sessionStorage item:", error);
      return defaultValue;
    }
  }

  static removeItem(key: string): boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing sessionStorage item:", error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
      return false;
    }
  }
}

export default {
  Storage,
  TokenStorage,
  PreferencesStorage,
  LanguageStorage,
  ThemeStorage,
  CacheStorage,
  SessionStorage,
};
