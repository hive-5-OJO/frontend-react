import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@/shared/constants/config';

/**
 * Google OAuth 인증 URL로 리다이렉트
 */
export const redirectToGoogleAuth = () => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile`;
  window.location.href = googleAuthUrl;
};
