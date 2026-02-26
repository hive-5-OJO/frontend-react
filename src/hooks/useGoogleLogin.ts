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
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'email profile';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    window.location.href = googleAuthUrl;
  };

  const handleGoogleCallback = async (code: string) => {
    setIsLoading(true);

    try {
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
      navigate('/login?error=google_auth_failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGoogleLogin, handleGoogleCallback, isLoading };
};
