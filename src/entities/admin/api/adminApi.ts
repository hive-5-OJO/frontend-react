import axiosInstance from '@/shared/lib/axios/instance';
import type { AdminListResponse } from '../model/types';

interface AdminApiResponse {
  status: string;
  data: AdminListResponse;
  message: string;
}

export const adminApi = {
  getAdminList: async (params: { page?: number; size?: number } = {}): Promise<AdminListResponse> => {
    const { page = 0, size = 20 } = params;
    const response = await axiosInstance.get<AdminApiResponse>('/api/admins', {
      params: { page, size },
    });
    return response.data.data;
  },

  updateAdminRole: async (adminId: number, role: string): Promise<void> => {
    await axiosInstance.patch(`/api/admins/${adminId}/role`, { role });
  },

  updateAdminStatus: async (adminId: number, status: string): Promise<void> => {
    await axiosInstance.patch(`/api/admins/${adminId}/status`, { status });
  },
};
