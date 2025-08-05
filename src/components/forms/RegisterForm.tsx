import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input, Alert } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { userRegisterSchema, UserRegisterFormData } from '@/utils/validation';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser, isLoading, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
  });

  const onSubmit = async (data: UserRegisterFormData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('full_name')}
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.full_name?.message}
          autoComplete="name"
        />

        <Input
          {...register('email')}
          type="email"
          label="Email address"
          placeholder="Enter your email"
          error={errors.email?.message}
          autoComplete="email"
        />

        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="Create a password"
          error={errors.password?.message}
          autoComplete="new-password"
          helperText="Must contain at least 8 characters with uppercase, lowercase, and number"
        />

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-primary-600 hover:text-primary-500">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;