import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, type GoogleLoginRequest } from '@/shared/api/auth';
import { useAuthStore } from '@/entities/user/model/store';
import { ROUTES } from '@/shared/constants/routes';
import { useToast } from '@/shared/hooks';

/**
 * Google 로그인 Mutation
 */
export const useGoogleLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GoogleLoginRequest) => authApi.googleLogin(data),
    onSuccess: (response) => {
      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: {
          adminId: response.adminId,
          name: response.name,
          email: response.email,
          role: response.role,
        },
      });
      toast.success('로그인 성공', '환영합니다!');
      navigate(ROUTES.HOME);
    },
    onError: () => {
      // 백엔드 에러 메시지를 보여주지 않고 일반적인 메시지만 표시
      toast.error('로그인 실패', 'Google 로그인에 실패했습니다. 다시 시도해주세요.');
      navigate(ROUTES.LOGIN);
    },
  });
};
