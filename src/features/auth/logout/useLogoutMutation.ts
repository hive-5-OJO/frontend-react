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
      toast.success('로그아웃되었습니다.');
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      // 로그아웃 실패해도 클라이언트 상태는 초기화
      clearAuth();
      queryClient.clear();
      toast.error('로그아웃 중 오류가 발생했습니다.');
      navigate(ROUTES.LOGIN);
    },
  });
};
