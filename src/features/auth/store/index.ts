import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse, AuthTokens, User } from "../types";

type AuthStore = {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  // بعد از ثبت‌نام / ورود / رفرش
  setSession: (session: AuthResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setSession: ({ user, tokens }) =>
        set({ user, tokens, isAuthenticated: true }),

      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);
