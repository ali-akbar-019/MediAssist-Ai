import axios from "axios";
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { BACKEND_URL } from "../constants";
import { useAuthStore } from "../store/authStore";

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — attach token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — logout user
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        if (error.response?.status === 429) {
            return Promise.reject(
                new Error("Too many requests. Please try again later.")
            );
        }

        if (!error.response) {
            return Promise.reject(
                new Error("Network error. Please check your connection.")
            );
        }

        const message =
            (error.response.data as { message?: string })?.message ||
            "An unexpected error occurred";

        return Promise.reject(new Error(message));
    }
);

export default api;