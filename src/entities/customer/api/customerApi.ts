import axiosInstance from '@/shared/lib/axios/instance';
import type { Customer, CustomerFeature, ConsultTimelineItem, RFMScore, LTVData, Subscription, Recommendation } from '../model/types';
import axiosInstancePy from '@/shared/lib/axios/pythonInstance';
import { getMockCustomerList, getMockCustomerSearch, getMockCustomerFilter, getMockCustomerDetail, getMockCustomerFeatures, getMockConsultTimeline, getMockRFMScore, getMockLTVData, getMockSubscriptions, getMockMemo, createMockMemo, deleteMockMemo, getMockRecommendation } from './mockData';

/**
 * 목 데이터 사용 여부
 * .env 파일에서 VITE_USE_MOCK=true 로 설정하면 목 데이터 사용
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/** 목 데이터 사용 시 로딩 시뮬레이션 */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface CustomerListResponse {
  status: string;
  data: {
    content: Array<{
      memberId: number;
      name: string;
      phone: string | null;
      email: string | null;
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

export interface CustomerDetailResponse {
  status: string;
  message: string;
  data: {
    memberId: number;
    name: string;
    phone: string;
    email: string;
    gender: string;
    birthDate: string;
    region: string;
    status: string;
    consent: {
      personalAccepted: string;
      marketingAccepted: string;
      isConverted: string;
      acceptedAt: string;
      expiresAt: string | null;
    };
  };
}

export interface CustomerFeatureResponse {
  status: string;
  message: string;
  data: {
    memberId: number;
    lifecycle: {
      lifecycleId: number; memberId: number; featureBaseDate: string;
      memberLifetimeDays: number; daysSinceLastActivity: number; contractEndDaysLeft: number;
      isDormantFlag: boolean; isNewCustomerFlag: boolean; isTerminatedFlag: boolean; signupDate: string;
    };
    monetary: {
      monetaryId: number; memberId: number; featureBaseDate: string;
      totalRevenue: number; lastPaymentAmount: number; avgMonthlyBill: number;
      lastPaymentDate: string; paymentCount6m: number; monthlyRevenue: number;
      paymentDelayCount: number; prevMonthlyRevenue: number; vipPrevMonth: boolean;
      avgOrderVal: number; purchaseCycle: number;
    };
    usage: {
      usageId: number; memberId: number; featureBaseDate: string;
      totalUsageAmount: number; avgDailyUsage: number; maxUsageAmount: number;
      usagePeakHour: number; premiumServiceCount: number; lastActivityDate: string;
      usageActiveDays30d: number;
    };
    consultation: {
      consultationId: number; memberId: number; featureBaseDate: string;
      totalConsultCount: number; last7dConsultCount: number; last30dConsultCount: number;
      avgMonthlyConsultCount: number; lastConsultDate: string; nightConsultCount: number;
      weekendConsultCount: number; topConsultCategory: string; totalComplaintCount: number;
      lastConsultDaysAgo: number;
    };
  };
}

export interface ConsultTimelineResponse {
  status: string;
  message: string | null;
  data: {
    memberId: number;
    timeline: Array<{
      id: number; date: string; category: string; direction: 'IN' | 'OUT';
      content: string; promotionName: string | null; satisfactionScore: number;
    }>;
  };
}

export interface RFMScoreResponse {
  status: string;
  message: string | null;
  data: {
    memberId: number;
    rfmDetail: {
      recency: string; frequency: number; monetary: number; rfmScore: number;
      updatedAt: string; rScore: number; fScore: number; mScore: number; segmentType: string;
    };
  };
}

export interface LTVDataResponse {
  status: string;
  message: string | null;
  data: {
    member_id: number; avg_value: number; total_revenue: number;
    frequency: number; lifespan_days: number; LTV: number;
  };
}

export interface SubscriptionListResponse {
  status: string;
  message: string | null;
  data: {
    subscriptions: Array<{
      subscribeId: number;
      product: { planId: number; productName: string; productType: string; price: number; };
      quantity: number; totalPrice: number; startedAt: string; status: string;
    }>;
  };
}

export interface RecommendationResponse {
  status: string;
  message: string | null;
  data: Array<{
    member_id: number; rank: number; recommended_product: string;
    price: number; score: string; reason: string; created_at: string;
  }>;
}

export interface SortRequest {
  field: string;
  order: 'asc' | 'desc';
}

export const customerApi = {
  getList: async (params?: {
    page?: number;
    size?: number;
    sorts?: SortRequest[];
  }): Promise<CustomerListResponse['data']> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockCustomerList(params?.page ?? 0, params?.size ?? 10);
    }
    const response = await axiosInstance.post<CustomerListResponse>('/api/customers/list',
      params?.sorts || [], {
      params: { page: params?.page ?? 0, size: params?.size ?? 10 },
    });
    return response.data.data;
  },

  filter: async (params: {
    page?: number;
    size?: number;
    segment?: string;
    frequency?: string;
    categoryId?: number;
  }): Promise<CustomerListResponse['data']> => {
    if (USE_MOCK) {
      await delay(300);
      const { page, size, ...filterParams } = params;
      return getMockCustomerFilter(filterParams, page ?? 0, size ?? 10);
    }
    const { page, size, ...body } = params;
    const response = await axiosInstance.post<CustomerListResponse>(
      `/api/customers/filter?page=${page ?? 0}&size=${size ?? 10}`, body,
    );
    return response.data.data;
  },

  search: async (params: {
    keyword: string;
    page?: number;
    size?: number;
  }): Promise<CustomerListResponse['data']> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockCustomerSearch(params.keyword, params.page ?? 0, params.size ?? 10);
    }
    const response = await axiosInstance.get<CustomerListResponse>('/api/customers/search', {
      params: { keyword: params.keyword, page: params.page ?? 0, size: params.size ?? 10 },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<Customer> => {
    if (USE_MOCK) {
      await delay(200);
      return getMockCustomerDetail(id);
    }
    const response = await axiosInstance.get<CustomerDetailResponse>(`/api/customers/${id}`);
    const d = response.data.data;
    return {
      id: d.memberId, name: d.name, phone: d.phone, email: d.email,
      joinedAt: d.birthDate, gender: d.gender, birthDate: d.birthDate,
      region: d.region, status: d.status, consent: d.consent,
    };
  },

  getFeatures: async (id: number): Promise<CustomerFeature> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockCustomerFeatures(id);
    }
    const response = await axiosInstance.get<CustomerFeatureResponse>(`/api/batch/feature/${id}`);
    const d = response.data.data;
    return {
      memberId: d.memberId,
      featureBaseDate: d.lifecycle.featureBaseDate,
      consultation: {
        totalConsultCount: d.consultation.totalConsultCount,
        last7dConsultCount: d.consultation.last7dConsultCount,
        last30dConsultCount: d.consultation.last30dConsultCount,
        avgMonthlyConsultCount: d.consultation.avgMonthlyConsultCount,
        lastConsultDate: d.consultation.lastConsultDate,
        nightConsultCount: d.consultation.nightConsultCount,
        weekendConsultCount: d.consultation.weekendConsultCount,
        topConsultCategory: d.consultation.topConsultCategory,
        totalComplaintCount: d.consultation.totalComplaintCount,
        lastConsultDaysAgo: d.consultation.lastConsultDaysAgo,
      },
      monetary: {
        totalRevenue: d.monetary.totalRevenue,
        lastPaymentAmount: d.monetary.lastPaymentAmount,
        avgMonthlyBill: d.monetary.avgMonthlyBill,
        lastPaymentDate: d.monetary.lastPaymentDate,
        paymentCount6m: d.monetary.paymentCount6m,
        monthlyRevenue: d.monetary.monthlyRevenue,
        paymentDelayCount: d.monetary.paymentDelayCount,
        prevMonthlyRevenue: d.monetary.prevMonthlyRevenue,
        isVipPrevMonth: d.monetary.vipPrevMonth ? 'true' : 'false',
        avgOrderVal: d.monetary.avgOrderVal,
        purchaseCycle: d.monetary.purchaseCycle,
      },
      lifecycle: {
        memberLifetimeDays: d.lifecycle.memberLifetimeDays,
        daysSinceLastActivity: d.lifecycle.daysSinceLastActivity,
        contractEndDaysLeft: d.lifecycle.contractEndDaysLeft,
        isDormantFlag: d.lifecycle.isDormantFlag,
        isNewCustomerFlag: d.lifecycle.isNewCustomerFlag,
        isTerminatedFlag: d.lifecycle.isTerminatedFlag,
        signupDate: d.lifecycle.signupDate,
      },
      usage: {
        totalUsageAmount: d.usage.totalUsageAmount,
        avgDailyUsage: d.usage.avgDailyUsage,
        maxUsageAmount: d.usage.maxUsageAmount,
        usagePeakHour: d.usage.usagePeakHour,
        premiumServiceCount: d.usage.premiumServiceCount,
        lastActivityDate: d.usage.lastActivityDate,
        usageActiveDays30d: d.usage.usageActiveDays30d,
      },
    };
  },

  getConsultTimeline: async (id: number): Promise<ConsultTimelineItem[]> => {
    if (USE_MOCK) {
      await delay(250);
      return getMockConsultTimeline(id);
    }
    const response = await axiosInstance.get<ConsultTimelineResponse>(`/api/advice/${id}`);
    return response.data.data.timeline.map((item) => ({
      date: item.date, category: item.category, direction: item.direction,
      content: item.content,
      promotionName: item.promotionName || undefined,
      satisfactionScore: item.satisfactionScore || undefined,
    }));
  },

  getRFMScore: async (id: number): Promise<RFMScore> => {
    if (USE_MOCK) {
      await delay(300);
      return getMockRFMScore(id);
    }
    const response = await axiosInstance.get<RFMScoreResponse>(`/api/analysis/rfm/${id}`);
    const r = response.data.data.rfmDetail;
    return {
      recency: r.recency, frequency: r.frequency, monetary: r.monetary,
      score: r.rfmScore, updatedAt: r.updatedAt,
      rScore: r.rScore, fScore: r.fScore, mScore: r.mScore, segmentType: r.segmentType,
    };
  },

  getLTVData: async (id: number): Promise<LTVData> => {
    if (USE_MOCK) {
      await delay(350);
      return getMockLTVData(id);
    }
    const response = await axiosInstancePy.get<LTVDataResponse>(`/api/analysis/ltv/${id}`);
    const d = response.data.data;
    return {
      memberId: d.member_id, avgValue: d.avg_value, totalRevenue: d.total_revenue,
      frequency: d.frequency, lifespanDays: d.lifespan_days, ltv: d.LTV,
    };
  },

  getSubscriptions: async (id: number): Promise<Subscription[]> => {
    if (USE_MOCK) {
      await delay(200);
      return getMockSubscriptions(id);
    }
    const response = await axiosInstance.get<SubscriptionListResponse>(`/api/customers/${id}/subscriptions`);
    return response.data.data.subscriptions;
  },

  getMemo: async (memberId: number): Promise<{ id: number; adminId: number; memberId: number; content: string } | null> => {
    if (USE_MOCK) {
      await delay(150);
      return getMockMemo(memberId);
    }
    const response = await axiosInstance.get<{
      status: string;
      data: { id: number; adminId: number; memberId: number; content: string } | null;
    }>(`/api/member-memos/${memberId}`);
    return response.data.data;
  },

  createMemo: async (memberId: number, content: string): Promise<number> => {
    if (USE_MOCK) {
      await delay(200);
      return createMockMemo(memberId, content);
    }
    const response = await axiosInstance.post<{
      status: string; data: number; message: string;
    }>(`/api/member-memos/${memberId}`, { content });
    return response.data.data;
  },

  deleteMemo: async (memberId: number): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      deleteMockMemo(memberId);
      return;
    }
    await axiosInstance.delete(`/api/member-memos/${memberId}`);
  },

  getRecommendation: async (id: number): Promise<Recommendation> => {
    if (USE_MOCK) {
      await delay(400);
      return getMockRecommendation(id);
    }
    const response = await axiosInstancePy.get<RecommendationResponse>(`/api/analysis/recommend/${id}`);
    return response.data.data.map((item) => ({
      memberId: item.member_id, rank: item.rank,
      recommendedProduct: item.recommended_product, price: item.price,
      score: item.score, reason: item.reason, createdAt: item.created_at,
    }));
  },
};
