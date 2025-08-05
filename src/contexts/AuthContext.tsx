import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserLogin, UserCreate, UserUpdate } from '@/types';
import { authService } from '@/services';
import { tokenStorage, jwtUtils } from '@/utils';

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: UserUpdate) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    dispatch({ type: 'AUTH_START' });

    try {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken || !refreshToken) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No tokens found' });
        return;
      }

      // Check if access token is expired
      if (jwtUtils.isTokenExpired(accessToken)) {
        // Try to refresh the token
        try {
          const tokenResponse = await authService.refreshToken(refreshToken);
          tokenStorage.setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
        } catch (refreshError) {
          // Refresh failed, clear tokens
          tokenStorage.clearTokens();
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
          return;
        }
      }

      // Get current user
      const user = await authService.getCurrentUser();
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      tokenStorage.clearTokens();
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Authentication failed' });
    }
  };

  // Login function
  const login = async (credentials: UserLogin) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const tokenResponse = await authService.login(credentials);
      tokenStorage.setTokens(tokenResponse.access_token, tokenResponse.refresh_token);

      const user = await authService.getCurrentUser();
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  // Register function
  const register = async (userData: UserCreate) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const user = await authService.register(userData);
      
      // Auto-login after registration
      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenStorage.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile function
  const updateProfile = async (userData: UserUpdate) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};