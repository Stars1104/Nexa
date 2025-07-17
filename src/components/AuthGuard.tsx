import React, { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen bg-gray-50 dark:bg-[#171717] flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          Please log in to access this page
        </div>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated and we have a user object, check if token is valid
    if (!isAuthenticated && !user?.id) {
      // Check if there's a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // No token found, redirect to login
        navigate('/login');
      }
    }
  }, [isAuthenticated, user?.id, navigate]);

  // Show fallback if not authenticated
  if (!isAuthenticated || !user?.id) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthGuard; 