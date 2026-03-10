import axiosInstance from '@/shared/lib/axios/instance';
import type { Customer } from '../model/types';

export interface CustomerListResponse {
  status: string;
  data: {
    content: Array<{
      memberId: number;
      name: string;
      service: string | null;
      servicePeriod: string;
      consultCategory: string | null;
      consultFrequency: string;
      vip: string;
    }>;
    page: {
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  message: string;
}

export const customerApi = {
  getList: async (params?: {
    page?: number;
    size?: number;
    filters?: Record<string, unknown>;
  }): Promise<CustomerListResponse['data']> => {
    const response = await axiosInstance.get<CustomerListResponse>('/api/customers/list', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        ...params?.filters,
      },
    });
    return response.data.data; // data.data로 접근
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(`/api/customers/${id}`);
    return response.data;
  },
};
