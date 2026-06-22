import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    changeUserPassword,
} from "../services/authService";
import type {
    LoginCredentials,
    RegisterCredentials,
    User,
} from "../types";
import { ROUTES } from "../constants";
import { parseErrorMessage } from "../lib/utils";

export const useAuth = () => {
    const navigate = useNavigate();
    const { login, logout, updateUser, setLoading, isLoading } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            setError(null);
            setLoading(true);
            const data = await loginUser(credentials);
            login(data.user, data.token);
            navigate(ROUTES.DASHBOARD);
            return true;
        } catch (err) {
            setError(parseErrorMessage(err));
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (
        credentials: RegisterCredentials
    ): Promise<{
        success: boolean;
        fieldErrors?: Record<string, string>;
    }> => {
        try {
            setError(null);
            setLoading(true);

            const data = await registerUser(credentials);

            login(data.user, data.token);
            navigate(ROUTES.DASHBOARD);

            return { success: true };
        } catch (err: any) {
            const data = err?.response?.data;

            // field validation errors
            if (data?.errors) {
                const fieldErrors: Record<string, string> = {};

                data.errors.forEach((e: any) => {
                    fieldErrors[e.field] = e.message;
                });

                return {
                    success: false,
                    fieldErrors,
                };
            }

            setError(parseErrorMessage(err));

            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logoutUser();
        } catch {
            // Logout locally even if API fails
        } finally {
            logout();
            navigate(ROUTES.HOME);
        }
    };
    const handleUpdateProfile = async (
        profileData: Partial<User>
    ): Promise<{
        success: boolean;
        fieldErrors?: Record<string, string>;
    }> => {
        try {
            setError(null);
            setLoading(true);
            const updatedUser = await updateUserProfile(profileData);
            updateUser(updatedUser);
            return { success: true };
        } catch (err: any) {
            const data = err?.response?.data;

            if (data?.errors) {
                const fieldErrors: Record<string, string> = {};
                data.errors.forEach((e: any) => {
                    fieldErrors[e.field] = e.message;
                });
                return { success: false, fieldErrors };
            }

            setError(parseErrorMessage(err));
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (
        currentPassword: string,
        newPassword: string
    ): Promise<boolean> => {
        try {
            setError(null);
            setLoading(true);
            await changeUserPassword(currentPassword, newPassword);
            return true;
        } catch (err) {
            setError(parseErrorMessage(err));
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        isLoading,
        error,
        clearError,
        handleLogin,
        handleRegister,
        handleLogout,
        handleUpdateProfile,
        handleChangePassword,
    };
};