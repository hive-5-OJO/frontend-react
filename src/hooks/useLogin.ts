import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest } from '../types/auth';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data);
      
      // refreshToken은 httpOnly 쿠키로 백엔드에서 자동 설정됨
      const user = {
        adminId: response.adminId,
        email: response.email,
        role: response.role,
      };
      
      // accessToken만 전달 (메모리에 저장됨)
      setAuth(user, response.accessToken, response.tokenType);
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '로그인에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
