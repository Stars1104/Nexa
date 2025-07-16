import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStatus, loginSuccess } from '../store/slices/authSlice';

export const useAuthRehydration = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = () => {
      console.log('Initializing auth rehydration...');
      
      // For debugging: Always use the valid test token
      const validTestToken = '250|DwnQBXt1ViocJhIjNNgMLHRvTZ2EDkWbE7QbpygR95364c9e';
      const testUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'creator' as const
      };
      
      // Always set the test token in localStorage
      localStorage.setItem('token', validTestToken);
      localStorage.setItem('user', JSON.stringify(testUser));
      
      console.log('Set test token in localStorage:', validTestToken.substring(0, 20) + '...');
      
      // Update Redux state
      if (!isAuthenticated) {
        console.log('Updating Redux state with test user');
        dispatch(loginSuccess({ user: testUser, token: validTestToken }));
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