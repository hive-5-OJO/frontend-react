import { axiosInstance } from './axios';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/api/auth/login', data);
    // refreshToken은 httpOnly 쿠키로 백엔드에서 자동 설정됨
    return response.data;
  },

  logout: async (): Promise<void> => {
    // 백엔드에서 refreshToken 쿠키 삭제
    await axiosInstance.post('/api/auth/logout');
  },

  // refreshToken은 쿠키로 자동 전송되므로 파라미터 불필요
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post('/api/auth/refresh');
    return response.data;
  },
};
