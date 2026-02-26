import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback, isLoading } = useGoogleLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      window.location.href = '/login?error=google_auth_cancelled';
      return;
    }

    if (code) {
      handleGoogleCallback(code);
    } else {
      window.location.href = '/login?error=no_code';
    }
  }, [searchParams, handleGoogleCallback]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {isLoading ? (
          <>
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">Google 로그인 처리 중...</p>
          </>
        ) : (
          <p className="text-gray-600">로그인 처리 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
