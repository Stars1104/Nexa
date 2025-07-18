import { apiClient } from '../../services/apiClient';

export interface Portfolio {
  id: number;
  user_id: number;
  title: string | null;
  bio: string | null;
  profile_picture: string | null;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
  items?: PortfolioItem[];
}

export interface PortfolioItem {
  id: number;
  portfolio_id: number;
  file_path: string;
  file_name: string;
  file_type: string;
  media_type: 'image' | 'video';
  file_size: number;
  title: string | null;
  description: string | null;
  order: number;
  file_url?: string;
  thumbnail_url?: string;
  formatted_file_size?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioStats {
  total_items: number;
  images_count: number;
  videos_count: number;
  is_complete: boolean;
  has_minimum_items: boolean;
  profile_complete: boolean;
}

export interface PortfolioResponse {
  portfolio: Portfolio;
  items_count: number;
  images_count: number;
  videos_count: number;
  is_complete: boolean;
}

export interface ReorderRequest {
  item_orders: Array<{
    id: number;
    order: number;
  }>;
}

// Get user's portfolio
export const getPortfolio = async (token: string): Promise<PortfolioResponse> => {
  const response = await apiClient.get('/portfolio', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  console.log('Portfolio API Response:', response.data);
  return response.data.data;
};

// Update portfolio profile
export const updatePortfolioProfile = async (
  token: string, 
  data: FormData
): Promise<Portfolio> => {
  console.log('=== API updatePortfolioProfile DEBUG ===');
  console.log('Token:', !!token);
  console.log('FormData type:', typeof data);
  console.log('FormData instanceof FormData:', data instanceof FormData);
  
  // Log FormData contents
  console.log('FormData entries:');
  for (const [key, value] of data.entries()) {
    console.log(`  ${key}:`, value);
  }
  
  console.log('Sending FormData to API:', data);
  
  const response = await apiClient.put('/portfolio/profile', data, {
    headers: { 
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type for FormData - let the browser set it with boundary
    }
  });
  
  console.log('API Response:', response.data);
  return response.data.data;
};

// Upload portfolio media
export const uploadPortfolioMedia = async (
  token: string, 
  files: File[]
): Promise<{ items: PortfolioItem[]; total_items: number }> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files[]', file);
  });

  const response = await apiClient.post('/portfolio/media', formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

// Update portfolio item
export const updatePortfolioItem = async (
  token: string,
  itemId: number,
  data: {
    title?: string;
    description?: string;
    order?: number;
  }
): Promise<PortfolioItem> => {
  const response = await apiClient.put(`/portfolio/items/${itemId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

// Delete portfolio item
export const deletePortfolioItem = async (
  token: string,
  itemId: number
): Promise<void> => {
  await apiClient.delete(`/portfolio/items/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Reorder portfolio items
export const reorderPortfolioItems = async (
  token: string,
  data: ReorderRequest
): Promise<void> => {
  await apiClient.post('/portfolio/reorder', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Get portfolio statistics
export const getPortfolioStats = async (token: string): Promise<PortfolioStats> => {
  const response = await apiClient.get('/portfolio/statistics', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
}; 