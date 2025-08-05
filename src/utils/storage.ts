import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';

// Generic storage utilities
export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

// Token-specific storage utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return storage.get(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    storage.set(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return storage.get(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    storage.set(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },

  hasValidTokens: (): boolean => {
    const accessToken = storage.get(ACCESS_TOKEN_KEY);
    const refreshToken = storage.get(REFRESH_TOKEN_KEY);
    return !!(accessToken && refreshToken);
  }
};

