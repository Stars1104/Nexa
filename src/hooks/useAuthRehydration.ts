import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStatus } from '../store/slices/authSlice';

export const useAuthRehydration = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check and update auth status after rehydration
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return {
    token,
    user,
    isAuthenticated,
  };
}; 