export interface CustomerConsent {
  personalAccepted: string;
  marketingAccepted: string;
  isConverted: string;
  acceptedAt: string;
  expiresAt: string | null;
}

export interface SubscriptionProduct {
  planId: number;
  productName: string;
  productType: string;
  price: number;
}

export interface Subscription {
  subscribeId: number;
  product: SubscriptionProduct;
  quantity: number;
  totalPrice: number;
  startedAt: string;
  status: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinedAt: string;
  gender?: string;
  birthDate?: string;
  region?: string;
  status?: string;
  consent?: CustomerConsent;
  subscriptions?: Subscription[];
  service?: string;
  period?: string;
  consultFrequency?: ConsultFrequency | number | string;
  consultCategory?: string;
  isVip?: boolean;
  isNewCustomer?: boolean;
  customerType?: CustomerType;
}

export type ConsultFrequency = 'high' | 'medium' | 'low';

export type CustomerType = 'vip' | 'potential_vip' | 'normal' | 'churn_risk' | 'churned';

export type TabType = 'info' | 'feature' | 'rfm' | 'ltv' | 'consult';

export const CONSULT_FREQUENCY_LABELS: Record<ConsultFrequency, string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  vip: 'VIP',
  potential_vip: '잠재 VIP',
  normal: '일반',
  churn_risk: '이탈 우려',
  churned: '이탈',
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
  avgValue: number;
  totalRevenue: number;
  frequency: number;
  lifespanDays: number;
  ltv: number;
}

export interface ConsultTimelineItem {
  date: string;
  category: string;
  direction: 'IN' | 'OUT';
  content: string;
  promotionName?: string;
  satisfactionScore?: number;
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
