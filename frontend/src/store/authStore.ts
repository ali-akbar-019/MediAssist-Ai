import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { STORAGE_KEYS } from "../constants";

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setLoading: (loading: boolean) => void;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user: User) =>
                set({
                    user,
                    isAuthenticated: true,
                }),

            setToken: (token: string) =>
                set({
                    token,
                }),

            setLoading: (loading: boolean) =>
                set({
                    isLoading: loading,
                }),

            login: (user: User, token: string) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            updateUser: (updatedUser: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedUser } : null,
                })),
        }),
        {
            name: STORAGE_KEYS.USER,
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);