import axios from "axios";

const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Auth API
const AuthAPI = axios.create({
    baseURL: `${BackendURL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token dynamically
AuthAPI.interceptors.request.use(
    (config) => {
        // Get token from Redux store if available
        const token = getTokenFromStore();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            // Token might be expired, let the calling code handle it
            console.warn('Authentication failed - token may be expired');
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
        // Get the persisted state from localStorage
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
        console.log('Health check response:', response.data);
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
    console.log('Login payload:', data);
    console.log('Backend URL:', BackendURL);
    
    try {
        const response = await AuthAPI.post("/api/login", data);
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
    // Determine if this is FormData (for file uploads) or regular data
    const isFormData = data instanceof FormData;
    
    const config = {
        headers: {
            "Content-Type": isFormData ? "multipart/form-data" : "application/json",
        },
    };
    
    const response = await AuthAPI.put("/api/profile", data, config);
    return response.data;
};

// Get Profile Function
export const getProfile = async () => {
    const response = await AuthAPI.get("/api/profile");
    console.log(response.data);
    return response.data;
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
        new_password: newPassword,
        password_confirmation: newPassword
    });
    return response.data;
};
// Logout Function
export const logout = async () => {
    const response = await AuthAPI.post("/api/logout");
}; 