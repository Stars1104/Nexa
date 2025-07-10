import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginStart, loginSuccess, loginFailure, signupStart, signupSuccess, signupFailure, logout } from '../slices/authSlice';
import { signup, signin, logout as logoutAPI, updatePassword } from '../../api/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  whatsapp?: string;
  isStudent?: boolean;
  role: 'creator' | 'brand';
}

interface UpdatePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  userId: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string; 
    role: 'creator' | 'brand' | 'student';
    whatsapp?: string;
    isStudent?: boolean;
    isPremium?: boolean;
  };
  token: string;
}

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(signupStart());
      
      const response = await signup(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Sign up failed');
      }

      const authData: AuthResponse = {
        user: response.user,
        token: response.token,
      };
      dispatch(signupSuccess(authData));
      return authData;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Sign up failed';
      dispatch(signupFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      
      const response = await signin(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const authData: AuthResponse = {
        user: response.user,
        token: response.token,
      };

      dispatch(loginSuccess(authData));
      return authData;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Call logout API to invalidate token on server
      await logoutAPI();
    } catch (error) {
      // Log the error but don't throw - we still want to clear local state
      console.error('Logout API error:', error);
      // If it's a 401, the token was already invalid, so clearing state is correct
      // If it's another error, we still want to log the user out locally
    } finally {
      // Always clear state regardless of API call success
      // redux-persist will handle localStorage cleanup
      dispatch(logout());
    }
  }
);

// Async thunk for updating password
export const updateUserPassword = createAsyncThunk(
  'auth/updatePassword',
  async (credentials: UpdatePasswordCredentials, { rejectWithValue }) => {
    try {
      const response = await updatePassword(credentials.userId,credentials.newPassword, credentials.currentPassword);
      
      if (!response.success) {
        throw new Error(response.message || 'Password update failed');
      }

      return response.message || 'Password updated successfully';
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Password update failed';
      return rejectWithValue(errorMessage);
    }
  }
);

