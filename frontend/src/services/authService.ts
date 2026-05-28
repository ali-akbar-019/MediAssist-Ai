import api from "./api";
import type {
    APIResponse,
    User,
    LoginCredentials,
    RegisterCredentials,
} from "../types";

interface AuthResponseData {
    token: string;
    user: User;
}

// Register new user
export const registerUser = async (
    credentials: RegisterCredentials
): Promise<AuthResponseData> => {
    const response = await api.post<APIResponse<AuthResponseData>>(
        "/api/auth/register",
        credentials
    );
    return response.data.data;
};

// Login user
export const loginUser = async (
    credentials: LoginCredentials
): Promise<AuthResponseData> => {
    const response = await api.post<APIResponse<AuthResponseData>>(
        "/api/auth/login",
        credentials
    );
    return response.data.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<APIResponse<{ user: User }>>(
        "/api/auth/me"
    );
    return response.data.data.user;
};

// Update user profile
export const updateUserProfile = async (
    profileData: Partial<User>
): Promise<User> => {
    const response = await api.put<APIResponse<{ user: User }>>(
        "/api/auth/profile",
        profileData
    );
    return response.data.data.user;
};

// Change password
export const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
): Promise<void> => {
    await api.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
    });
};

// Logout
export const logoutUser = async (): Promise<void> => {
    await api.post("/api/auth/logout");
};