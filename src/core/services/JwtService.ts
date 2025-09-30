import { TokenStorage } from "@/utils/storage";

/**
 * JWT Service for token management
 * Now uses the enhanced TokenStorage utility
 */

/**
 * @description get token from localStorage
 */
export const getToken = (): string | null => {
  return TokenStorage.getToken();
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  TokenStorage.setToken(token);
};

/**
 * @description remove token from localStorage
 */
export const destroyToken = (): void => {
  TokenStorage.removeToken();
};

/**
 * @description check if token exists
 */
export const hasToken = (): boolean => {
  return TokenStorage.hasToken();
};

/**
 * @description check if token is expired
 */
export const isTokenExpired = (): boolean => {
  return TokenStorage.isTokenExpired();
};

export default {
  getToken,
  saveToken,
  destroyToken,
  hasToken,
  isTokenExpired,
};
