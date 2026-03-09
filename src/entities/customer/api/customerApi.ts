import axiosInstance from '@/shared/lib/axios/instance';
import type { Customer } from '../model/types';
import type { PaginatedResponse, PaginationParams } from '@/shared/types';

export const customerApi = {
  getList: async (
    params: PaginationParams & { filters?: Record<string, unknown> },
  ): Promise<PaginatedResponse<Customer>> => {
    const response = await axiosInstance.get<PaginatedResponse<Customer>>('/api/customers', {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(`/api/customers/${id}`);
    return response.data;
  },
};
