import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated or no token, redirect to signin page
  if (!isAuthenticated || !token) {
    // Store the current location so we can redirect back after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute; 