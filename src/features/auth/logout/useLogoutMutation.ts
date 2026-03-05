import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/shared/api/auth';
import { useAuthStore } from '@/entities/user/model/store';
import { ROUTES } from '@/shared/constants/routes';
import { useToast } from '@/shared/hooks';
import { queryClient } from '@/shared/lib/react-query';

/**
 * 로그아웃 Mutation
 */
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // 모든 캐시 초기화
      toast.success('로그아웃 되었습니다.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : '로그아웃에 실패했습니다.';
      toast.error(errorMessage);
    },
  });
};
