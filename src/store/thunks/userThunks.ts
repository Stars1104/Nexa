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
import { getProfile, profileUpdate } from '../../api/auth';

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
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch profile';
      dispatch(fetchProfileFailure(errorMessage));
      return rejectWithValue(errorMessage);
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
      if (profileData.image && profileData.image instanceof File) {
        const formData = new FormData();
        
        // Add all profile fields to FormData
        Object.keys(profileData).forEach(key => {
          if (key === 'image') {
            formData.append('avatar', profileData.image);
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
        const { image, ...otherData } = profileData;
        dataToSend = otherData;
      }
      
      const response = await profileUpdate(dataToSend);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }

      dispatch(updateProfileSuccess(response.profile));
      return response.profile;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update profile';
      dispatch(updateProfileFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
); 