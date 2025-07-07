import axios from "axios";

const BackendURL = import.meta.env.VITE_BACKEND_URL;

// Auth API
const AuthAPI = axios.create({
    baseURL: `${BackendURL}/auth`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Signup Function
export const signup = async (data: any) => {
    const response = await AuthAPI.post("/signup", data);
    return response.data;
};

// Signin Function
export const signin = async (data: any) => {
    const response = await AuthAPI.post("/signin", data);
    return response.data;
};

// Profile Update Function
export const profileUpdate = async (data: any) => {
    const response = await AuthAPI.put("/profile", data);
    return response.data;
};

// Forgot Password Function
export const forgotPassword = async (data: any) => {
    const response = await AuthAPI.post("/forgot-password", data);
    return response.data;
};