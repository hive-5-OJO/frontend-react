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
      toast.success('로그인 성공');
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      toast.error(errorMessage);
    },
  });
};
