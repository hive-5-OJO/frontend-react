import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { queryKeys } from '@/shared/constants';

/**
 * 고객 목록 조회 쿼리
 */
export const useCustomerList = (params?: {
  page?: number;
  size?: number;
  sorts?: any[];
}) => {
  return useQuery({
    queryKey: queryKeys.customer.list(params || {}),
    queryFn: () => customerApi.getList(params),
  });
};

/**
 * 고객 필터 조회 쿼리
 */
export const useCustomerFilter = (params: {
  page?: number;
  size?: number;
  segment?: string;
  frequency?: string;
  categoryId?: number;
}, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.filter(params),
    queryFn: () => customerApi.filter(params),
    enabled,
  });
};

/**
 * 고객 검색 쿼리
 */
export const useCustomerSearch = (params: {
  keyword: string;
  page?: number;
  size?: number;
}, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.search(params),
    queryFn: () => customerApi.search(params),
    enabled: enabled && params.keyword.length > 0,
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

/**
 * 고객 특성 정보 조회 쿼리
 */
export const useCustomerFeatures = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.features(id),
    queryFn: () => customerApi.getFeatures(id),
    enabled,
  });
};

/**
 * 고객 상담 타임라인 조회 쿼리
 */
export const useCustomerTimeline = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.timeline(id),
    queryFn: () => customerApi.getConsultTimeline(id),
    enabled,
  });
};

/**
 * 고객 RFM 점수 조회 쿼리
 */
export const useCustomerRFM = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.rfm(id),
    queryFn: () => customerApi.getRFMScore(id),
    enabled,
  });
};

/**
 * 고객 LTV 데이터 조회 쿼리
 */
export const useCustomerLTV = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.ltv(id),
    queryFn: () => customerApi.getLTVData(id),
    enabled,
  });
};

/**
 * 고객 구독 서비스 조회 쿼리
 */
export const useCustomerSubscriptions = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.customer.subscriptions(id),
    queryFn: () => customerApi.getSubscriptions(id),
    enabled,
  });
};
