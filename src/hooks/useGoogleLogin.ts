import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';


export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = 'http://localhost:5173/oauth/google/callback';
    const scope = 'email profile';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    window.location.href = googleAuthUrl;
  };

  const handleGoogleCallback = async (code: string) => {
    setIsLoading(true);

    try {
      // 디버깅: 백엔드로 보내는 데이터 확인
      console.log('=== Google Login Debug ===');
      console.log('Code:', code);
      console.log('Request body:', { code });
      
      // 백엔드에 code를 전달
      const response = await authApi.googleLogin(code);
      
      const user = {
        adminId: response.adminId,
        email: response.email,
        role: response.role,
      };
      
      setAuth(user, response.accessToken, response.tokenType);
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
      // 에러 상세 정보 출력
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        console.error('Error details:', {
          message: error.message,
          response: axiosError.response?.data,
          status: axiosError.response?.status,
        });
        
        // 백엔드 에러 메시지가 있으면 표시
        const backendMessage = axiosError.response?.data?.message;
        if (backendMessage) {
          console.error('Backend error:', backendMessage);
        }
      }
      navigate('/login?error=google_auth_failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGoogleLogin, handleGoogleCallback, isLoading };
};
