import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input, Alert } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { userLoginSchema, UserLoginFormData } from '@/utils/validation';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit = async (data: UserLoginFormData) => {
    try {
      await login(data);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-gray-600">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
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
          placeholder="Enter your password"
          error={errors.password?.message}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;