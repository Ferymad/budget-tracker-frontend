// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  password?: string;
}

// Auth types
export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Transaction types
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

export interface Transaction {
  id: string;
  amount: string;
  description: string;
  transaction_type: TransactionType;
  transaction_date: string;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  amount: string;
  description: string;
  transaction_type: TransactionType;
  transaction_date: string;
  category_id: string;
}

export interface TransactionUpdate {
  amount?: string;
  description?: string;
  transaction_type?: TransactionType;
  transaction_date?: string;
  category_id?: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

// Budget types
export interface Budget {
  id: string;
  name: string;
  amount: string;
  period: string;
  start_date: string;
  end_date: string;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetCreate {
  name: string;
  amount: string;
  period: string;
  start_date: string;
  end_date: string;
  category_id: string;
}

export interface BudgetUpdate {
  name?: string;
  amount?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  category_id?: string;
}

// Query parameters
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface TransactionFilters extends PaginationParams {
  transaction_type?: TransactionType;
  category_id?: string;
  start_date?: string;
  end_date?: string;
}

// Dashboard types
export interface DashboardStats {
  total_income: string;
  total_expenses: string;
  net_income: string;
  transaction_count: number;
  categories_count: number;
  budgets_count: number;
}

export interface SpendingByCategory {
  category_id: string;
  category_name: string;
  category_color: string;
  total_amount: string;
  transaction_count: number;
}

export interface MonthlySpending {
  month: string;
  income: string;
  expenses: string;
  net: string;
}

export interface BudgetProgress {
  budget_id: string;
  budget_name: string;
  budget_amount: string;
  spent_amount: string;
  remaining_amount: string;
  percentage_used: number;
  is_over_budget: boolean;
  category_name: string;
  category_color: string;
}