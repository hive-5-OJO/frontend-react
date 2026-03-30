import axiosInstancePy from '@/shared/lib/axios/pythonInstance';
import axiosInstance from '@/shared/lib/axios/instance';
import { getMockCohortAnalysis, getMockRFMAnalysis, getMockRFMKpi, getMockRegionalAnalysis } from './mockData';

import type { 
  CohortAnalysisRequest, 
  CohortAnalysisResponse, 
  RFMAnalysisRequest, 
  RFMAnalysisResponse, 
  RFMKpiRequest, 
  RFMKpiResponse,
  RegionalAnalysisResponse,
} from '../model/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const analysisApi = {
  getCohortAnalysis: async (params: CohortAnalysisRequest): Promise<CohortAnalysisResponse> => {
    if (USE_MOCK) {
      await delay(400);
      return getMockCohortAnalysis(params);
    }
    const response = await axiosInstancePy.get('/api/analysis/cohort', {
      params: { segment: params.segment },
    });
    return response.data;
  },

  getRFMAnalysis: async (params: RFMAnalysisRequest): Promise<RFMAnalysisResponse> => {
    if (USE_MOCK) {
      await delay(400);
      return getMockRFMAnalysis(params.baseMonth);
    }
    const response = await axiosInstance.get('/api/analysis/rfm/segments', {
      params: { baseMonth: params.baseMonth },
    });
    return response.data;
  },

  getRFMKpi: async (params: RFMKpiRequest): Promise<RFMKpiResponse> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockRFMKpi(params.baseMonth);
    }
    const response = await axiosInstance.get('/api/analysis/rfmkpi', {
      params: { baseMonth: params.baseMonth },
    });
    return response.data;
  },

  getRegionalAnalysis: async (): Promise<RegionalAnalysisResponse> => {
    if (USE_MOCK) {
      await delay(500);
      return getMockRegionalAnalysis();
    }
    const response = await axiosInstancePy.get('/api/analysis/region');
    return response.data;
  },
};
