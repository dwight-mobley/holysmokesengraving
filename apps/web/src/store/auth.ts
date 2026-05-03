import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
};

interface AuthState {
  user: AuthUser | null;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const authState = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setAuth: (user) => set({ user }),

      clearAuth: () => set({ user: null }),
    }),
    { name: 'auth-storage' },
  ),
);
