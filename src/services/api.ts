import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { tokenStorage } from '@/utils';
import { Token, RefreshTokenRequest } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Process failed queue after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;
        
        // Store new tokens
        tokenStorage.setTokens(access_token, new_refresh_token);
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Process queued requests
        processQueue(null, access_token);
        
        isRefreshing = false;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API response wrapper
export const apiResponse = <T>(response: AxiosResponse<T>) => response.data;

// Error handler
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data) {
    const errorData = error.response.data as any;
    if (errorData.detail) {
      return typeof errorData.detail === 'string' ? errorData.detail : 'An error occurred';
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Generic API methods
export const apiClient = {
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  put: <T>(url: string, data?: any) => api.put<T>(url, data),
  patch: <T>(url: string, data?: any) => api.patch<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};

export default api;