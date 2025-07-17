import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStatus } from '../store/slices/authSlice';

export const useAuthRehydration = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = () => {
      console.log('Initializing auth rehydration...');
      
      // Check if user is already authenticated
      if (!isAuthenticated) {
        console.log('Checking for existing authentication...');
        dispatch(checkAuthStatus());
      }
      
      console.log('Auth rehydration complete');
    };
    
    initializeAuth();
  }, [dispatch, isAuthenticated]);

  return {
    token,
    user,
    isAuthenticated,
  };
}; 