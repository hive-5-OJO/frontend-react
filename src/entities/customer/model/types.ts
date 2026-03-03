export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinedAt: string;
  service?: string;
  period?: string;
  consultFrequency?: ConsultFrequency | number | string;
  consultCategory?: string;
  isVip?: boolean;
  isNewCustomer?: boolean;
}

export type ConsultFrequency = 'high' | 'medium' | 'low';

export type TabType = 'info' | 'ltv' | 'rfm';

export const CONSULT_FREQUENCY_LABELS: Record<ConsultFrequency, string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

export interface RFMScore {
  recency: string;
  frequency: number;
  monetary: number;
  score: number;
  updatedAt: string;
}

export interface LTVData {
  memberId: number;
  ltvAmount: number;
  ltvGrade: string;
  expectedChurnDate: string;
  avgOrderValue: number;
}

export interface CustomerFeature {
  memberId: number;
  featureBaseDate: string;
  consultation: {
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
  monetary: {
    totalRevenue: number;
    lastPaymentAmount: number;
    avgMonthlyBill: number;
    lastPaymentDate: string;
    paymentCount6m: number;
    monthlyRevenue: number;
    paymentDelayCount: number;
    prevMonthlyRevenue: number;
    isVipPrevMonth: string;
    avgOrderVal: number;
    purchaseCycle: number;
  };
  lifecycle: {
    memberLifetimeDays: number;
    daysSinceLastActivity: number;
    contractEndDaysLeft: number;
    isDormantFlag: boolean;
    isNewCustomerFlag: boolean;
    isTerminatedFlag: boolean;
    signupDate: string;
  };
  usage: {
    totalUsageAmount: number;
    avgDailyUsage: number;
    maxUsageAmount: number;
    usagePeakHour: number;
    premiumServiceCount: number;
    lastActivityDate: string;
    usageActiveDays30d: number;
  };
}
