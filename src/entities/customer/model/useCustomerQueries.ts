import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { queryKeys } from '@/shared/constants';

/**
 * 고객 목록 조회 쿼리
 */
export const useCustomerList = (params?: {
  page?: number;
  size?: number;
  filters?: Record<string, unknown>;
}) => {
  return useQuery({
    queryKey: queryKeys.customer.list(params || {}),
    queryFn: () => customerApi.getList(params),
  });
};

/**
 * 고객 상세 조회 쿼리
 */
export const useCustomer = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.detail(id),
    queryFn: () => customerApi.getById(id),
    enabled,
  });
};
