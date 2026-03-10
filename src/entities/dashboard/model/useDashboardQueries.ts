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

/**
 * 상담 시간대별 통계 조회 쿼리
 */
export const useConsultTimeStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.consultTimeStats(),
    queryFn: () => dashboardApi.getConsultTimeStats(),
  });
};

/**
 * 아웃바운드 통계 조회 쿼리
 */
export const useOutboundStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.outboundStats(),
    queryFn: () => dashboardApi.getOutboundStats(),
  });
};

/**
 * 상담 만족도 통계 조회 쿼리
 */
export const useSatisfactionStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.satisfactionStats(),
    queryFn: () => dashboardApi.getSatisfactionStats(),
  });
};
