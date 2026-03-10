import axiosInstance from '@/shared/lib/axios/instance';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  adminId: number;
  email: string;
  role: string;
}

interface AuthApiResponse {
  status: string;
  data: AuthResponse;
  message: string | null;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthApiResponse>('/api/auth/login', credentials);
    return response.data.data;
  },

  googleLogin: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthApiResponse>('/api/auth/google', data);
    return response.data.data;
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<{ accessToken: string }>('/api/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/api/auth/logout');
  },
};
