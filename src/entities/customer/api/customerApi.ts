import axiosInstance from '@/shared/lib/axios/instance';
import type { Customer, CustomerFeature, ConsultTimelineItem, RFMScore, LTVData, Subscription } from '../model/types';

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
      lifecycleId: number;
      memberId: number;
      featureBaseDate: string;
      memberLifetimeDays: number;
      daysSinceLastActivity: number;
      contractEndDaysLeft: number;
      isDormantFlag: boolean;
      isNewCustomerFlag: boolean;
      isTerminatedFlag: boolean;
      signupDate: string;
    };
    monetary: {
      monetaryId: number;
      memberId: number;
      featureBaseDate: string;
      totalRevenue: number;
      lastPaymentAmount: number;
      avgMonthlyBill: number;
      lastPaymentDate: string;
      paymentCount6m: number;
      monthlyRevenue: number;
      paymentDelayCount: number;
      prevMonthlyRevenue: number;
      vipPrevMonth: boolean;
      avgOrderVal: number;
      purchaseCycle: number;
    };
    usage: {
      usageId: number;
      memberId: number;
      featureBaseDate: string;
      totalUsageAmount: number;
      avgDailyUsage: number;
      maxUsageAmount: number;
      usagePeakHour: number;
      premiumServiceCount: number;
      lastActivityDate: string;
      usageActiveDays30d: number;
    };
    consultation: {
      consultationId: number;
      memberId: number;
      featureBaseDate: string;
      totalConsultCount: number;
      last7dConsultCount: number;
      last30dConsultCount: number;
      avgMonthlyConsultCount: number;
      lastConsultDate: string;
      nightConsultCount: number;
      weekendConsultCount: number;
      topConsultCategory: string;
      totalComplaintCount: number;
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
      id: number;
      date: string;
      category: string;
      direction: 'IN' | 'OUT';
      content: string;
      promotionName: string | null;
      satisfactionScore: number;
    }>;
  };
}

export interface RFMScoreResponse {
  status: string;
  message: string | null;
  data: {
    memberId: number;
    rfmScore: {
      recency: string;
      frequency: number;
      monetary: number;
      score: number;
      updatedAt: string;
    };
  };
}

export interface LTVDataResponse {
  status: string;
  message: string | null;
  data: {
    member_id: number;
    avg_value: number;
    total_revenue: number;
    frequency: number;
    lifespan_days: number;
    LTV: number;
  };
}

export interface SubscriptionListResponse {
  status: string;
  message: string | null;
  data: {
    subscriptions: Array<{
      subscribeId: number;
      product: {
        planId: number;
        productName: string;
        productType: string;
        price: number;
      };
      quantity: number;
      totalPrice: number;
      startedAt: string;
      status: string;
    }>;
  };
}

export interface SortRequest {
  field: string;
  order: 'asc' | 'desc';
}
export const customerApi = {
  getList: async (params?: {
    page?: number;
    size?: number;
    filters?: Record<string, unknown>;
    sorts?: SortRequest[];
  }): Promise<CustomerListResponse['data']> => {
    const response = await axiosInstance.post<CustomerListResponse>('/api/customers/list', 
      params?.sorts || [], {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        ...params?.filters,
      },
    });
    return response.data.data;
  },

  search: async (params: {
    keyword: string;
    page?: number;
    size?: number;
  }): Promise<CustomerListResponse['data']> => {
    const response = await axiosInstance.get<CustomerListResponse>('/api/customers/search', {
      params: {
        keyword: params.keyword,
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await axiosInstance.get<CustomerDetailResponse>(`/api/customers/${id}`);
    const apiData = response.data.data;
    
    return {
      id: apiData.memberId,
      name: apiData.name,
      phone: apiData.phone,
      email: apiData.email,
      joinedAt: apiData.birthDate,
      gender: apiData.gender,
      birthDate: apiData.birthDate,
      region: apiData.region,
      status: apiData.status,
      consent: apiData.consent,
    };
  },

  getFeatures: async (id: number): Promise<CustomerFeature> => {
    const response = await axiosInstance.get<CustomerFeatureResponse>(`/batch/features/${id}`);
    const apiData = response.data.data;
    
    return {
      memberId: apiData.memberId,
      featureBaseDate: apiData.lifecycle.featureBaseDate,
      consultation: {
        totalConsultCount: apiData.consultation.totalConsultCount,
        last7dConsultCount: apiData.consultation.last7dConsultCount,
        last30dConsultCount: apiData.consultation.last30dConsultCount,
        avgMonthlyConsultCount: apiData.consultation.avgMonthlyConsultCount,
        lastConsultDate: apiData.consultation.lastConsultDate,
        nightConsultCount: apiData.consultation.nightConsultCount,
        weekendConsultCount: apiData.consultation.weekendConsultCount,
        topConsultCategory: apiData.consultation.topConsultCategory,
        totalComplaintCount: apiData.consultation.totalComplaintCount,
        lastConsultDaysAgo: apiData.consultation.lastConsultDaysAgo,
      },
      monetary: {
        totalRevenue: apiData.monetary.totalRevenue,
        lastPaymentAmount: apiData.monetary.lastPaymentAmount,
        avgMonthlyBill: apiData.monetary.avgMonthlyBill,
        lastPaymentDate: apiData.monetary.lastPaymentDate,
        paymentCount6m: apiData.monetary.paymentCount6m,
        monthlyRevenue: apiData.monetary.monthlyRevenue,
        paymentDelayCount: apiData.monetary.paymentDelayCount,
        prevMonthlyRevenue: apiData.monetary.prevMonthlyRevenue,
        isVipPrevMonth: apiData.monetary.vipPrevMonth ? 'true' : 'false',
        avgOrderVal: apiData.monetary.avgOrderVal,
        purchaseCycle: apiData.monetary.purchaseCycle,
      },
      lifecycle: {
        memberLifetimeDays: apiData.lifecycle.memberLifetimeDays,
        daysSinceLastActivity: apiData.lifecycle.daysSinceLastActivity,
        contractEndDaysLeft: apiData.lifecycle.contractEndDaysLeft,
        isDormantFlag: apiData.lifecycle.isDormantFlag,
        isNewCustomerFlag: apiData.lifecycle.isNewCustomerFlag,
        isTerminatedFlag: apiData.lifecycle.isTerminatedFlag,
        signupDate: apiData.lifecycle.signupDate,
      },
      usage: {
        totalUsageAmount: apiData.usage.totalUsageAmount,
        avgDailyUsage: apiData.usage.avgDailyUsage,
        maxUsageAmount: apiData.usage.maxUsageAmount,
        usagePeakHour: apiData.usage.usagePeakHour,
        premiumServiceCount: apiData.usage.premiumServiceCount,
        lastActivityDate: apiData.usage.lastActivityDate,
        usageActiveDays30d: apiData.usage.usageActiveDays30d,
      },
    };
  },

  getConsultTimeline: async (id: number): Promise<ConsultTimelineItem[]> => {
    const response = await axiosInstance.get<ConsultTimelineResponse>(`/api/advice/${id}`);
    const timeline = response.data.data.timeline;
    
    return timeline.map((item) => ({
      date: item.date,
      category: item.category,
      direction: item.direction,
      content: item.content,
      promotionName: item.promotionName || undefined,
      satisfactionScore: item.satisfactionScore || undefined,
    }));
  },

  getRFMScore: async (id: number): Promise<RFMScore> => {
    const response = await axiosInstance.get<RFMScoreResponse>(`/api/analysis/rfm/${id}`);
    const rfmScore = response.data.data.rfmScore;
    
    return {
      recency: rfmScore.recency,
      frequency: rfmScore.frequency,
      monetary: rfmScore.monetary,
      score: rfmScore.score,
      updatedAt: rfmScore.updatedAt,
    };
  },

  getLTVData: async (id: number): Promise<LTVData> => {
    const response = await axiosInstance.get<LTVDataResponse>(`/api/analysis/ltv/${id}`);
    const data = response.data.data;
    
    return {
      memberId: data.member_id,
      avgValue: data.avg_value,
      totalRevenue: data.total_revenue,
      frequency: data.frequency,
      lifespanDays: data.lifespan_days,
      ltv: data.LTV,
    };
  },

  getSubscriptions: async (id: number): Promise<Subscription[]> => {
    const response = await axiosInstance.get<SubscriptionListResponse>(`/api/customers/${id}/subscriptions`);
    return response.data.data.subscriptions;
  },
};
