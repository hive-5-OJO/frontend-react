import { useQuery } from '@tanstack/react-query';
import { analysisApi } from '../api/analysisApi';
import type { CohortAnalysisRequest, RFMAnalysisRequest, RFMKpiRequest, RegionalAnalysisRequest } from './types';

export const useAnalysisQueryKeys = {
  all: ['analysis'] as const,
  cohort: (params: CohortAnalysisRequest) => [...useAnalysisQueryKeys.all, 'cohort', params] as const,
  rfm: (params: RFMAnalysisRequest) => [...useAnalysisQueryKeys.all, 'rfm', params] as const,
  rfmKpi: (params: RFMKpiRequest) => [...useAnalysisQueryKeys.all, 'rfmKpi', params] as const,
  regional: (params: RegionalAnalysisRequest) => [...useAnalysisQueryKeys.all, 'regional', params] as const,
};

export const useCohortAnalysis = (params: CohortAnalysisRequest, enabled = false) => {
  return useQuery({
    queryKey: useAnalysisQueryKeys.cohort(params),
    queryFn: () => analysisApi.getCohortAnalysis(params),
    enabled, // 조회하기 버튼을 눌렀을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
  });
};

export const useRFMAnalysis = (params: RFMAnalysisRequest, enabled = false) => {
  return useQuery({
    queryKey: useAnalysisQueryKeys.rfm(params),
    queryFn: () => analysisApi.getRFMAnalysis(params),
    enabled, // 조회하기 버튼을 눌렀을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
  });
};

export const useRFMKpi = (params: RFMKpiRequest, enabled = false) => {
  return useQuery({
    queryKey: useAnalysisQueryKeys.rfmKpi(params),
    queryFn: () => analysisApi.getRFMKpi(params),
    enabled, // 조회하기 버튼을 눌렀을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
  });
};

export const useRegionalAnalysis = (enabled = true) => {
  return useQuery({
    queryKey: useAnalysisQueryKeys.regional({}),
    queryFn: () => analysisApi.getRegionalAnalysis(),
    enabled, // 기본적으로 자동 실행 (페이지 로드 시)
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
  });
};
