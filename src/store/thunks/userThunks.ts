import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchProfileStart, 
  fetchProfileSuccess, 
  fetchProfileFailure, 
  updateProfile,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure 
} from '../slices/userSlice';
import { getProfile, profileUpdate, getUser } from '../../api/auth';
import { handleApiError } from '../../lib/api-error-handler';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchProfileStart());
      
      const response = await getProfile();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }

      dispatch(fetchProfileSuccess(response.profile));
      return response.profile;
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      dispatch(fetchProfileFailure(apiError.message));
      return rejectWithValue(apiError.message);
    }
  }
);

// Async thunk for fetching comprehensive user data for editing
export const fetchUserForEditing = createAsyncThunk(
  'user/fetchUserForEditing',
  async (userId: string | undefined = undefined, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchProfileStart());
      
      const response = await getUser(userId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user data');
      }

      // Use the same success action since we're storing user data
      dispatch(fetchProfileSuccess(response.user));
      return response.user;
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      dispatch(fetchProfileFailure(apiError.message));
      return rejectWithValue(apiError.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(updateProfileStart());
      
      // If there's an image file, we need to create FormData for file upload
      let dataToSend;
      if (profileData.avatar && profileData.avatar instanceof File) {
        const formData = new FormData();
        
        // Add all profile fields to FormData
        Object.keys(profileData).forEach(key => {
          if (key === 'avatar') {
            formData.append('avatar', profileData.avatar);
          } else if (key === 'languages' && Array.isArray(profileData[key])) {
            formData.append('languages', JSON.stringify(profileData[key]));
          } else if (key === 'categories' && Array.isArray(profileData[key])) {
            formData.append('categories', JSON.stringify(profileData[key]));
          } else if (profileData[key] !== undefined && profileData[key] !== null) {
            formData.append(key, profileData[key]);
          }
        });
        
        dataToSend = formData;
      } else {
        // Regular JSON data
        const { avatar, ...otherData } = profileData;
        dataToSend = otherData;
      }
      
      const response = await profileUpdate(dataToSend);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }

      dispatch(updateProfileSuccess(response.profile));
      return response.profile;
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      dispatch(updateProfileFailure(apiError.message));
      return rejectWithValue(apiError.message);
    }
  }
); 