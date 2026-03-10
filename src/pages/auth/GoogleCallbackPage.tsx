import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLoginMutation } from '@/features/auth/google-auth/model/useGoogleLoginMutation';
import { ROUTES } from '@/shared/constants/routes';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: googleLogin, isPending } = useGoogleLoginMutation();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      navigate(ROUTES.LOGIN);
      return;
    }

    if (code) {
      googleLogin({ code });
    } else {
      navigate(ROUTES.LOGIN);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-lg text-gray-700">
          {isPending ? 'Google 로그인 처리 중...' : '로그인 중...'}
        </p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
