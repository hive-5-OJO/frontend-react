import { create } from 'zustand';
import type { User } from './types';
import { setCookie, deleteCookie } from '@/shared/lib/cookies';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: sessionStorage.getItem('accessToken'),
  user: null,

  setAuth: ({ accessToken, refreshToken, user }) => {
    sessionStorage.setItem('accessToken', accessToken);
    setCookie('refreshToken', refreshToken, 7); // 7일 동안 유효
    set({ accessToken, user });
  },

  clearAuth: () => {
    sessionStorage.removeItem('accessToken');
    deleteCookie('refreshToken');
    set({ accessToken: null, user: null });
  },
}));
