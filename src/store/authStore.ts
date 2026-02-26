import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';
import { setAccessToken } from '../api/axios';

interface AuthState {
  user: User | null;
  tokenType: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, tokenType: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokenType: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, tokenType) => {
        // accessToken은 메모리에만 저장 (XSS 방지)
        setAccessToken(accessToken);
        
        set({
          user,
          tokenType,
          isAuthenticated: true,
        });
      },
      
      clearAuth: () => {
        // 메모리의 accessToken 제거
        setAccessToken(null);
        
        set({
          user: null,
          tokenType: null,
          isAuthenticated: false,
        });
      },
      
      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      // 민감한 토큰 정보는 persist에서 제외
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
