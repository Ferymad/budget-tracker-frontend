import { z } from 'zod';

// User validation schemas
export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userRegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const userUpdateSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .optional(),
});

// Transaction validation schemas
export const transactionCreateSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Amount must be a positive number')
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 999999999.99;
    }, 'Amount cannot exceed 999,999,999.99')
    .refine((val) => {
      const decimalPlaces = (val.split('.')[1] || '').length;
      return decimalPlaces <= 2;
    }, 'Amount cannot have more than 2 decimal places'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters')
    .transform((val) => val.trim()),
  transaction_type: z.enum(['income', 'expense', 'transfer'], {
    required_error: 'Transaction type is required',
  }),
  transaction_date: z.string().min(1, 'Transaction date is required'),
  category_id: z.string().min(1, 'Category is required'),
});

export const transactionUpdateSchema = transactionCreateSchema.partial();

// Category validation schemas
export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name cannot exceed 100 characters')
    .transform((val) => val.trim()),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .optional()
    .default('#3B82F6'),
  icon: z.string().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// Budget validation schemas
const baseBudgetSchema = z.object({
  name: z
    .string()
    .min(1, 'Budget name is required')
    .max(100, 'Budget name cannot exceed 100 characters')
    .transform((val) => val.trim()),
  amount: z
    .string()
    .min(1, 'Budget amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Budget amount must be a positive number')
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 999999999.99;
    }, 'Budget amount cannot exceed 999,999,999.99')
    .refine((val) => {
      const decimalPlaces = (val.split('.')[1] || '').length;
      return decimalPlaces <= 2;
    }, 'Budget amount cannot have more than 2 decimal places'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
    required_error: 'Budget period is required',
  }),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  category_id: z.string().min(1, 'Category is required'),
});

export const budgetCreateSchema = baseBudgetSchema.refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const budgetUpdateSchema = baseBudgetSchema.partial();

// Type exports for form data
export type UserLoginFormData = z.infer<typeof userLoginSchema>;
export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type TransactionCreateFormData = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdateFormData = z.infer<typeof transactionUpdateSchema>;
export type CategoryCreateFormData = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateFormData = z.infer<typeof categoryUpdateSchema>;
export type BudgetCreateFormData = z.infer<typeof budgetCreateSchema>;
export type BudgetUpdateFormData = z.infer<typeof budgetUpdateSchema>;