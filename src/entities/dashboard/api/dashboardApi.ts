import axiosInstance from '@/shared/lib/axios/instance';
import { getMockDashboardSummary, getMockConsultCategories, getMockConsultTimeStats, getMockOutboundStats, getMockSatisfactionStats } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 대시보드 요약 타입
export interface DashboardCardData {
  count: number;
  percentChange: number;
}

export interface DashboardDailyStat {
  date: string;
  newCustomers: number;
  churnedCustomers: number;
  activeCustomers: number;
}

export interface DashboardSegments {
  vip: number;
  potentialVip: number;
  general: number;
  atRisk: number;
  churned: number;
}

export interface DashboardSummaryData {
  cards: {
    currentCustomers: DashboardCardData;
    newActiveCustomers: DashboardCardData;
    newCustomers: DashboardCardData;
    atRiskCustomers: DashboardCardData;
  };
  dailyStats: DashboardDailyStat[];
  segments: DashboardSegments;
}

export interface DashboardSummaryResponse {
  status: string;
  data: DashboardSummaryData;
  message: string;
}

export interface ConsultCategoryData {
  totalCount: number;
  items: Array<{
    categoryId: number;
    categoryName: string;
    count: number;
    ratio: number;
  }>;
}

export interface ConsultCategoryResponse {
  status: string;
  message: string | null;
  data: ConsultCategoryData;
}

export interface ConsultTimeData {
  hour: number;
  inbound: number;
  outbound: number;
  total: number;
}

export interface ConsultTimeResponse {
  status: string;
  message: string | null;
  data: ConsultTimeData[];
}

export interface OutboundData {
  totalAttempt: number;
  promotionStats: Array<{
    promotionName: string;
    attempt: number;
  }>;
}

export interface OutboundResponse {
  status: string;
  message: string | null;
  data: OutboundData;
}

export interface SatisfactionData {
  averageScore: number;
  totalCount: number;
  scoreDistribution: Array<{
    score: number;
    count: number;
  }>;
}

export interface SatisfactionResponse {
  status: string;
  message: string | null;
  data: SatisfactionData;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummaryData> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockDashboardSummary();
    }
    const response = await axiosInstance.get<DashboardSummaryResponse>('/api/analysis/dashboard');
    return response.data.data;
  },

  getConsultCategories: async (): Promise<ConsultCategoryData> => {
    if (USE_MOCK) {
      await delay(250);
      return getMockConsultCategories();
    }
    const response = await axiosInstance.get<ConsultCategoryResponse>('/api/advice/categories');
    return response.data.data;
  },

  getConsultTimeStats: async (): Promise<ConsultTimeData[]> => {
    if (USE_MOCK) {
      await delay(250);
      return getMockConsultTimeStats();
    }
    const response = await axiosInstance.get<ConsultTimeResponse>('/api/advice/time');
    return response.data.data;
  },

  getOutboundStats: async (): Promise<OutboundData> => {
    if (USE_MOCK) {
      await delay(200);
      return getMockOutboundStats();
    }
    const response = await axiosInstance.get<OutboundResponse>('/api/advice/outbound');
    return response.data.data;
  },

  getSatisfactionStats: async (): Promise<SatisfactionData> => {
    if (USE_MOCK) {
      await delay(200);
      return getMockSatisfactionStats();
    }
    const response = await axiosInstance.get<SatisfactionResponse>('/api/advice/satisfaction');
    return response.data.data;
  },
};
