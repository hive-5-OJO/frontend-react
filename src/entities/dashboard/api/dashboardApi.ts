import axiosInstancePy from '@/shared/lib/axios/pythonInstance';

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

export const dashboardApi = {
  getConsultCategories: async (): Promise<ConsultCategoryData> => {
    const response = await axiosInstancePy.get<ConsultCategoryResponse>('/api/advice/categories');
    return response.data.data;
  },
};
