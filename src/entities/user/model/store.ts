import { create } from 'zustand';
import type { User } from './types';
import { setCookie, deleteCookie } from '@/shared/lib/cookies';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  clearAuth: () => void;
}

// sessionStorage에서 user 정보 복원
const getStoredUser = (): User | null => {
  const userStr = sessionStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: sessionStorage.getItem('accessToken'),
  user: getStoredUser(),

  setAuth: ({ accessToken, refreshToken, user }) => {
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('user', JSON.stringify(user));
    setCookie('refreshToken', refreshToken, 7); // 7일 동안 유효
    set({ accessToken, user });
  },

  clearAuth: () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    deleteCookie('refreshToken');
    set({ accessToken: null, user: null });
  },
}));
