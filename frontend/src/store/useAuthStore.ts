import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, AuthState } from "@/types";
import { authApi } from "@/lib/api";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login(email, password);
          localStorage.setItem("cf_token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.register({ name, email, password });
          localStorage.setItem("cf_token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem("cf_token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),

      fetchMe: async () => {
        const token = localStorage.getItem("cf_token");
        if (!token) return;
        try {
          const { data } = await authApi.me();
          set({ user: data, isAuthenticated: true, token });
        } catch {
          localStorage.removeItem("cf_token");
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "careerforge-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
