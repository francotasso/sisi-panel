import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/lib/api-client";
import { setToken, clearToken } from "@/lib/auth";

interface User {
  id: string;
  aud?: string;
  role: string;
  email: string;
  phone?: string;
  email_confirmed_at?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{
    access_token: string;
    user: User;
  }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await apiClient.post<{
          access_token: string;
          user: User;
        }>("/auth/login", { email, password });

        setToken(response.access_token);
        set({ user: response.user, token: response.access_token, isAuthenticated: true });
        return response;
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/logout");
        } catch {
          // ignore
        }
        clearToken();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "sisi-auth-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
