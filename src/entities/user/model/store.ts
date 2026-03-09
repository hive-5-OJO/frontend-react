import { create } from 'zustand';
import type { User } from './types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (data: { accessToken: string; user: User }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: sessionStorage.getItem('accessToken'),
  user: null,

  setAuth: ({ accessToken, user }) => {
    sessionStorage.setItem('accessToken', accessToken);
    set({ accessToken, user });
  },

  clearAuth: () => {
    sessionStorage.removeItem('accessToken');
    set({ accessToken: null, user: null });
  },
}));
