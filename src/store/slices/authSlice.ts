import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'brand' | 'student' | 'admin';
  whatsapp?: string;
  isStudent?: boolean;
  isPremium?: boolean; // Added for testing
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isSigningUp: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isSigningUp: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Also store in localStorage as backup
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Sign-up actions
    signupStart: (state) => {
      state.isSigningUp = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isSigningUp = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Also store in localStorage as backup
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.isSigningUp = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage as well
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    // New action to handle initial authentication check
    checkAuthStatus: (state) => {
      if (state.token && state.user) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
    // Toggle premium status (for testing)
    togglePremium: (state) => {
      if (state.user) {
        state.user.isPremium = !state.user.isPremium;
      }
    },
    // Temporary action to toggle admin role for testing
    toggleAdminRole: (state) => {
      if (state.user) {
        state.user.role = state.user.role === 'admin' ? 'creator' : 'admin';
      }
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  signupStart, 
  signupSuccess, 
  signupFailure, 
  logout, 
  clearError,
  checkAuthStatus,
  togglePremium,
  toggleAdminRole
} = authSlice.actions;
export default authSlice.reducer; 