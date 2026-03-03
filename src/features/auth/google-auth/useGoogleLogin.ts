import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/shared/api/auth';
import { useAuthStore } from '@/entities/user/model/store';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@/shared/constants/config';
import { ROUTES } from '@/shared/constants/routes';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = googleAuthUrl;
  };

  const handleGoogleCallback = async (code: string) => {
    setIsLoading(true);

    try {
      const response = await authApi.googleLogin({
        code,
        redirectUri: GOOGLE_REDIRECT_URI,
      });

      setAuth({
        accessToken: response.accessToken,
        user: {
          adminId: response.adminId,
          email: response.email,
          role: response.role,
        },
      });

      navigate(ROUTES.HOME);
    } catch (err) {
      console.error('Google login failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGoogleLogin, handleGoogleCallback, isLoading };
};
