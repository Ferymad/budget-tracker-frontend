import { apiClient, handleApiError } from './api';
import { 
  Transaction, 
  TransactionCreate, 
  TransactionUpdate,
  TransactionFilters
} from '@/types';

export const transactionService = {
  // Get all transactions with filters
  getTransactions: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get<Transaction[]>('/transactions/', filters);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get transaction by ID
  getTransaction: async (id: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get<Transaction>(`/transactions/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new transaction
  createTransaction: async (transactionData: TransactionCreate): Promise<Transaction> => {
    try {
      const response = await apiClient.post<Transaction>('/transactions/', transactionData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Update transaction
  updateTransaction: async (id: string, transactionData: TransactionUpdate): Promise<Transaction> => {
    try {
      const response = await apiClient.put<Transaction>(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete transaction
  deleteTransaction: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get transaction statistics
  getTransactionStats: async (filters?: { start_date?: string; end_date?: string }): Promise<{
    total_income: string;
    total_expenses: string;
    net_income: string;
    transaction_count: number;
  }> => {
    try {
      const response = await apiClient.get('/transactions/stats', filters);
      return response.data as {
        total_income: string;
        total_expenses: string;
        net_income: string;
        transaction_count: number;
      };
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get spending by category
  getSpendingByCategory: async (filters?: { start_date?: string; end_date?: string }): Promise<Array<{
    category_id: string;
    category_name: string;
    category_color: string;
    total_amount: string;
    transaction_count: number;
  }>> => {
    try {
      const response = await apiClient.get('/transactions/spending-by-category', filters);
      return response.data as Array<{
        category_id: string;
        category_name: string;
        category_color: string;
        total_amount: string;
        transaction_count: number;
      }>;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get monthly spending trends
  getMonthlySpending: async (year?: number): Promise<Array<{
    month: string;
    income: string;
    expenses: string;
    net: string;
  }>> => {
    try {
      const response = await apiClient.get('/transactions/monthly-spending', { year });
      return response.data as Array<{
        month: string;
        income: string;
        expenses: string;
        net: string;
      }>;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }
};