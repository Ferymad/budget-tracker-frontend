import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/forms';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </div>
  );
};

export default RegisterPage;