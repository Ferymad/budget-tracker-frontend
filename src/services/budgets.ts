import { apiClient, handleApiError } from './api';
import { 
  Budget, 
  BudgetCreate, 
  BudgetUpdate,
  BudgetProgress,
  PaginationParams 
} from '@/types';

export const budgetService = {
  // Get all budgets
  getBudgets: async (params?: PaginationParams): Promise<Budget[]> => {
    try {
      const response = await apiClient.get<Budget[]>('/budgets/', params);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get budget by ID
  getBudget: async (id: string): Promise<Budget> => {
    try {
      const response = await apiClient.get<Budget>(`/budgets/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new budget
  createBudget: async (budgetData: BudgetCreate): Promise<Budget> => {
    try {
      const response = await apiClient.post<Budget>('/budgets/', budgetData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Update budget
  updateBudget: async (id: string, budgetData: BudgetUpdate): Promise<Budget> => {
    try {
      const response = await apiClient.put<Budget>(`/budgets/${id}`, budgetData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete budget
  deleteBudget: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/budgets/${id}`);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get budget progress/analytics
  getBudgetProgress: async (filters?: { 
    start_date?: string; 
    end_date?: string;
    category_id?: string;
  }): Promise<BudgetProgress[]> => {
    try {
      const response = await apiClient.get<BudgetProgress[]>('/budgets/progress', filters);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get active budgets (current period)
  getActiveBudgets: async (): Promise<Budget[]> => {
    try {
      const response = await apiClient.get<Budget[]>('/budgets/active');
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get budget alerts (over-budget warnings)
  getBudgetAlerts: async (): Promise<Array<{
    budget_id: string;
    budget_name: string;
    budget_amount: string;
    spent_amount: string;
    over_amount: string;
    percentage_over: number;
    category_name: string;
  }>> => {
    try {
      const response = await apiClient.get('/budgets/alerts');
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }
};