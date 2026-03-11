import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin';
import { useToast } from '@/shared/hooks';

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ adminId, status }: { adminId: number; status: string }) =>
      adminApi.updateAdminStatus(adminId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('상태 변경 완료', '관리자 상태가 변경되었습니다.');
    },
    onError: () => {
      toast.error('상태 변경 실패', '상태 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
