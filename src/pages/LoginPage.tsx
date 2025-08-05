import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/forms';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;