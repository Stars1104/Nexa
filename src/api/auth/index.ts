import axios from "axios";

const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Auth API
const AuthAPI = axios.create({
    baseURL: `${BackendURL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // Don't send cookies for API requests
});

// Request interceptor to add token dynamically
AuthAPI.interceptors.request.use(
    (config) => {
        // Don't add Authorization header for login/register requests
        if (config.url && (config.url.includes('/login') || config.url.includes('/register'))) {
            console.log('Login/Register request - skipping Authorization header');
        } else {
            // Get token from Redux store if available
            const token = getTokenFromStore();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        // Handle FormData properly - don't set Content-Type for FormData
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized responses
AuthAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is expired or invalid, clear authentication
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Clear Redux persist state
            localStorage.removeItem('persist:auth');
            
            // Redirect to login page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && 
                !window.location.pathname.includes('/auth')) {
                window.location.href = '/auth';
            }
        } else if (error.response?.status === 403) {
            // Forbidden - user doesn't have permission
            console.warn('Access forbidden - user may not have required permissions');
        } else if (error.response?.status === 404) {
            // Not found
            console.warn('Resource not found');
        } else if (error.response?.status >= 500) {
            // Server error
            console.error('Server error:', error.response?.status, error.response?.statusText);
        }
        return Promise.reject(error);
    }
);

// Helper function to get token from Redux store
function getTokenFromStore(): string | null {
    try {
        // First try to get from localStorage directly (as stored by authSlice)
        const directToken = localStorage.getItem('token');
        if (directToken) {
            return directToken;
        }
        
        // Fallback to Redux persist state
        const persistedState = localStorage.getItem('persist:auth');
        if (persistedState) {
            const parsedState = JSON.parse(persistedState);
            const token = JSON.parse(parsedState.token || 'null');
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error getting token from store:', error);
        return null;
    }
}

// Signup Function
export const signup = async (data: any) => {
    const response = await AuthAPI.post("/api/register", data);
    return response.data;
};

// Health check function to test backend connectivity
export const healthCheck = async () => {
    try {
        const response = await AuthAPI.get("/api/health");
        return response.data;
    } catch (error: any) {
        console.error('Health check failed:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};



// Signin Function
export const signin = async (data: any) => {
    try {
        console.log('Sending login request with data:', data);
        console.log('Data type:', typeof data);
        console.log('Data stringified:', JSON.stringify(data));
        
        // First try the debug endpoint to see what's being sent
        try {
            const debugResponse = await AuthAPI.post("/api/debug-login", data);
            console.log('Debug endpoint response:', debugResponse.data);
        } catch (debugError: any) {
            console.log('Debug endpoint error:', debugError.response?.data);
        }
        
        // Try with explicit JSON stringification
        const jsonData = JSON.stringify(data);
        console.log('Sending JSON data:', jsonData);
        
        const response = await AuthAPI.post("/api/login", jsonData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Login response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Login error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
                data: error.config?.data
            }
        });
        throw error;
    }
};

// Profile Update Function
export const profileUpdate = async (data: any) => {
    try {
        const isFormData = data instanceof FormData;
        
        console.log('=== API PROFILE UPDATE DEBUG ===');
        console.log('Data type:', typeof data);
        console.log('Is FormData:', isFormData);
        
        // If it's FormData, log its contents
        if (isFormData) {
            console.log('[API] FormData contents:');
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }
            
            // Log headers that will be sent
            console.log('[API] Request headers:', {
                "Content-Type": "multipart/form-data (will be set by browser)"
            });
        } else {
            console.log('[API] JSON data:', data);
            console.log('[API] Request headers:', {
                "Content-Type": "application/json"
            });
        }
        
        const config = {
            headers: {
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
            },
        };
        
        // For FormData, let the browser set the Content-Type with boundary
        if (isFormData) {
            delete config.headers["Content-Type"];
        }
        
        console.log('[API] Final config:', config);
        
        const response = await AuthAPI.put("/api/profile", data, config);
        console.log('[API] Response:', response.data);
        
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update profile');
        }
        return response.data;
    } catch (error: any) {
        console.error('[API] Profile update error:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message,
            validationErrors: error?.response?.data?.errors
        });
        throw error;
    }
};

// Get Profile Function
export const getProfile = async () => {
    try {
        const response = await AuthAPI.get("/api/profile");
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch profile');
        }
        return response.data;
    } catch (error: any) {
        console.error('[API] Profile fetch error:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message
        });
        throw error;
    }
};

// Get User Function - Comprehensive user data for profile editing
export const getUser = async (userId?: string) => {
    try {
        const endpoint = userId ? `/api/users/${userId}` : "/api/user";
        const response = await AuthAPI.get(endpoint);
        // Ensure consistent response format
        if (response.data.success === false) {
            throw new Error(response.data.message || 'Failed to fetch user data');
        }
        
        return {
            success: true,
            user: response.data.user || response.data,
            message: response.data.message || 'User data retrieved successfully'
        };
    } catch (error: any) {
        console.error('Get user error:', error);
        throw error;
    }
};

// Forgot Password Function
export const forgotPassword = async (data: any) => {
    const response = await AuthAPI.post("/forgot-password", data);
    return response.data;
};

// Update Password Function
export const updatePassword = async (user_id: string, newPassword: string, currentPassword: string) => {
    const response = await AuthAPI.put("/api/update-password", {
        user_id,
        current_password: currentPassword,
        new_password: newPassword
    });
    return response.data;
};
// Logout Function
export const logout = async () => {
    const response = await AuthAPI.post("/api/logout");
};

 