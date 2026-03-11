import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAdminList = (params: { page?: number; size?: number } = {}) => {
  return useQuery({
    queryKey: ['admins', 'list', params],
    queryFn: () => adminApi.getAdminList(params),
  });
};
