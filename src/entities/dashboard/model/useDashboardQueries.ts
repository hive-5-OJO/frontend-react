import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { queryKeys } from '@/shared/constants';

/**
 * 상담 카테고리 통계 조회 쿼리
 */
export const useConsultCategories = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.consultCategories(),
    queryFn: () => dashboardApi.getConsultCategories(),
  });
};
