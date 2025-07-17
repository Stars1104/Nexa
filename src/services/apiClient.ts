import axios from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request:', { 
            url: config.url, 
            method: config.method,
            hasToken: !!token, 
            token: token ? token.substring(0, 20) + '...' : 'none' 
        });
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', { 
            url: response.config.url, 
            status: response.status,
            data: response.data 
        });
        return response;
    },
    async (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            console.log('Authentication failed, token may be invalid or expired');
            // Don't automatically clear token, let the auth hook handle it
        }
        
        // Handle 419 CSRF Token Mismatch with retry
        if (error.response?.status === 419) {
            console.log('CSRF token mismatch, attempting to refresh session...');
            
            // Try to refresh the session by making a GET request
            try {
                await apiClient.get('/user');
                console.log('Session refreshed, retrying original request...');
                
                // Retry the original request
                const originalRequest = error.config;
                return apiClient.request(originalRequest);
            } catch (refreshError) {
                console.log('Failed to refresh session:', refreshError);
                // If refresh fails, suggest user to refresh the page
                error.message = 'Session expired. Please refresh the page and try again.';
            }
        }
        
        return Promise.reject(error);
    }
); 