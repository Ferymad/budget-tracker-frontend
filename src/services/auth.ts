import { apiClient, handleApiError } from './api';
import { 
  Token, 
  User, 
  UserCreate, 
  UserLogin, 
  UserUpdate,
  RefreshTokenRequest 
} from '@/types';

export const authService = {
  // Register new user
  register: async (userData: UserCreate): Promise<User> => {
    try {
      const response = await apiClient.post<User>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Login user
  login: async (credentials: UserLogin): Promise<Token> => {
    try {
      const response = await apiClient.post<Token>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<Token> => {
    try {
      const response = await apiClient.post<Token>('/auth/refresh', {
        refresh_token: refreshToken
      });
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout user
  logout: async (refreshToken: string): Promise<void> => {
    try {
      await apiClient.post('/auth/logout', {
        refresh_token: refreshToken
      });
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/users/me');
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Update user profile
  updateProfile: async (userData: UserUpdate): Promise<User> => {
    try {
      const response = await apiClient.put<User>('/users/me', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete user account
  deleteAccount: async (): Promise<void> => {
    try {
      await apiClient.delete('/users/me');
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }
};