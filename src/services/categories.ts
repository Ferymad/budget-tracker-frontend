import { apiClient, handleApiError } from './api';
import { 
  Category, 
  CategoryCreate, 
  CategoryUpdate,
  PaginationParams 
} from '@/types';

export const categoryService = {
  // Get all categories
  getCategories: async (params?: PaginationParams): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>('/categories/', params);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get category by ID
  getCategory: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new category
  createCategory: async (categoryData: CategoryCreate): Promise<Category> => {
    try {
      const response = await apiClient.post<Category>('/categories/', categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Update category
  updateCategory: async (id: string, categoryData: CategoryUpdate): Promise<Category> => {
    try {
      const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  // Get categories with transaction counts
  getCategoriesWithStats: async (): Promise<Array<Category & {
    transaction_count: number;
    total_amount: string;
    last_transaction_date?: string;
  }>> => {
    try {
      const response = await apiClient.get('/categories/with-stats');
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }
};