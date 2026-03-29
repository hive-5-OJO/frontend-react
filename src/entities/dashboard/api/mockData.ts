import type { DashboardSummaryData, ConsultCategoryData, ConsultTimeData, OutboundData, SatisfactionData } from './dashboardApi';

export const getMockDashboardSummary = (): DashboardSummaryData => ({
  cards: {
    currentCustomers: { count: 96978, percentChange: 0.3 },
    newActiveCustomers: { count: 1614, percentChange: -70.2 },
    newCustomers: { count: 1660, percentChange: -70.1 },
    atRiskCustomers: { count: 100, percentChange: 9.7 },
  },
  dailyStats: [
    { date: '2026-03-23', newCustomers: 245, churnedCustomers: 12, activeCustomers: 48 },
    { date: '2026-03-24', newCustomers: 312, churnedCustomers: 8, activeCustomers: 96 },
    { date: '2026-03-25', newCustomers: 198, churnedCustomers: 15, activeCustomers: 92 },
    { date: '2026-03-26', newCustomers: 276, churnedCustomers: 10, activeCustomers: 95 },
    { date: '2026-03-27', newCustomers: 340, churnedCustomers: 5, activeCustomers: 57 },
    { date: '2026-03-28', newCustomers: 158, churnedCustomers: 18, activeCustomers: 96 },
    { date: '2026-03-29', newCustomers: 131, churnedCustomers: 7, activeCustomers: 99 },
  ],
  segments: {
    vip: 4850,
    potentialVip: 14540,
    general: 58190,
    atRisk: 14550,
    churned: 4848,
  },
});

export const getMockConsultCategories = (): ConsultCategoryData => ({
  totalCount: 8420,
  items: [
    { categoryId: 1, categoryName: '요금/청구서 문의', count: 2526, ratio: 30.0 },
    { categoryId: 2, categoryName: '납부/연체/미납', count: 1684, ratio: 20.0 },
    { categoryId: 3, categoryName: '요금제 변경', count: 1263, ratio: 15.0 },
    { categoryId: 4, categoryName: '부가서비스', count: 1010, ratio: 12.0 },
    { categoryId: 5, categoryName: '할인/쿠폰/프로모션', count: 842, ratio: 10.0 },
    { categoryId: 6, categoryName: '기술 지원', count: 589, ratio: 7.0 },
    { categoryId: 7, categoryName: '해지 문의', count: 506, ratio: 6.0 },
  ],
});

export const getMockConsultTimeStats = (): ConsultTimeData[] => {
  return Array.from({ length: 24 }, (_, hour) => {
    const base = hour >= 9 && hour <= 18 ? 80 : hour >= 6 && hour <= 21 ? 30 : 5;
    const peak = hour >= 10 && hour <= 14 ? 40 : 0;
    const inbound = base + peak + Math.floor(Math.random() * 20);
    const outbound = Math.floor(inbound * 0.3);
    return { hour, inbound, outbound, total: inbound + outbound };
  });
};

export const getMockOutboundStats = (): OutboundData => ({
  totalAttempt: 1245,
  promotionStats: [
    { promotionName: '신년 맞이 요금제 업그레이드', attempt: 420 },
    { promotionName: 'VIP 전용 30% 할인', attempt: 315 },
    { promotionName: '장기 고객 감사 이벤트', attempt: 280 },
    { promotionName: '5G 전환 프로모션', attempt: 230 },
  ],
});

export const getMockSatisfactionStats = (): SatisfactionData => ({
  averageScore: 3.8,
  totalCount: 6540,
  scoreDistribution: [
    { score: 1, count: 327 },
    { score: 2, count: 654 },
    { score: 3, count: 1635 },
    { score: 4, count: 2616 },
    { score: 5, count: 1308 },
  ],
});
