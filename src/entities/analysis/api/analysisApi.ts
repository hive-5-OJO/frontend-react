import axiosInstancePy from '@/shared/lib/axios/pythonInstance';
import axiosInstance from '@/shared/lib/axios/instance';

import type { 
  CohortAnalysisRequest, 
  CohortAnalysisResponse, 
  RFMAnalysisRequest, 
  RFMAnalysisResponse, 
  RFMKpiRequest, 
  RFMKpiResponse,
  RegionalAnalysisResponse,
} from '../model/types';

export const analysisApi = {
  // 코호트 분석 데이터 조회
  getCohortAnalysis: async (params: CohortAnalysisRequest): Promise<CohortAnalysisResponse> => {
    const response = await axiosInstancePy.get('/api/analysis/cohort', {
      params: {
        segment: params.segment,
      },
    });
    return response.data;
  },

  // RFM 분석 데이터 조회
  getRFMAnalysis: async (params: RFMAnalysisRequest): Promise<RFMAnalysisResponse> => {
    const response = await axiosInstance.get('/api/analysis/rfm/segments', {
      params: {
        baseMonth: params.baseMonth,
      },
    });
    return response.data;
  },

  // RFM KPI 데이터 조회
  getRFMKpi: async (params: RFMKpiRequest): Promise<RFMKpiResponse> => {
    const response = await axiosInstance.get('/api/analysis/rfmkpi', {
      params: {
        baseMonth: params.baseMonth,
      },
    });
    return response.data;
  },

  // 지역 분석 데이터 조회
  getRegionalAnalysis: async (): Promise<RegionalAnalysisResponse> => {
    const response = await axiosInstancePy.get('/api/analysis/region');
    return response.data;
  },
};
