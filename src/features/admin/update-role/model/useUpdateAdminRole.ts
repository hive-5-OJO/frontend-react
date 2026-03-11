import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin';
import { useToast } from '@/shared/hooks';

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ adminId, role }: { adminId: number; role: string }) =>
      adminApi.updateAdminRole(adminId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('권한 변경 완료', '관리자 권한이 변경되었습니다.');
    },
    onError: () => {
      toast.error('권한 변경 실패', '권한 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
