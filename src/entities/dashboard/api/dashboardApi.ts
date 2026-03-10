import axiosInstance from '@/shared/lib/axios/instance';

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
  getConsultCategories: async (): Promise<ConsultCategoryData> => {
    const response = await axiosInstance.get<ConsultCategoryResponse>('/api/advice/categories');
    return response.data.data;
  },

  getConsultTimeStats: async (): Promise<ConsultTimeData[]> => {
    const response = await axiosInstance.get<ConsultTimeResponse>('/api/advice/time');
    return response.data.data;
  },

  getOutboundStats: async (): Promise<OutboundData> => {
    const response = await axiosInstance.get<OutboundResponse>('/api/advice/outbound');
    return response.data.data;
  },

  getSatisfactionStats: async (): Promise<SatisfactionData> => {
    const response = await axiosInstance.get<SatisfactionResponse>('/api/advice/satisfaction');
    return response.data.data;
  },
};
