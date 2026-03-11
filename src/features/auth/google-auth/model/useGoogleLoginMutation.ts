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
  const { setAuth, clearAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GoogleLoginRequest) => authApi.googleLogin(data),
    onSuccess: (response) => {
      // GUEST 역할인 경우 권한 요청 알림 표시
      if (response.role === 'GUEST') {
        toast.warning(
          '권한 승인 대기 중',
          '관리자에게 권한 설정을 요청해주세요. 승인 후 다시 로그인해주세요.'
        );
        navigate(ROUTES.LOGIN);
        return;
      }

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
