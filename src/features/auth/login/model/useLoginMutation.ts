import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, type LoginRequest } from '@/shared/api/auth';
import { useAuthStore } from '@/entities/user/model/store';
import { ROUTES } from '@/shared/constants/routes';
import { useToast } from '@/shared/hooks';

/**
 * 로그인 Mutation
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth({
        accessToken: response.accessToken,
        user: {
          adminId: response.adminId,
          email: response.email,
          role: response.role,
        },
      });
      toast.success('로그인 성공', '환영합니다!');
      navigate(ROUTES.HOME);
    },
    onError: () => {
      // 백엔드 에러 메시지를 보여주지 않고 일반적인 메시지만 표시
      toast.error('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    },
  });
};
