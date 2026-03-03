// 최근 7일 날짜 라벨 생성
const getLast7DaysLabels = () => {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return labels;
};

// 고객 트렌드 데이터 (최근 7일)
export const customerTrendData = {
  labels: getLast7DaysLabels(),
  datasets: {
    current: [50, 180, 200, 190, 170, 210, 250],
    churned: [30, 120, 150, 140, 100, 80, 90],
    netGrowth: [20, 60, 50, 50, 70, 130, 160],
  },
};

// 고객 구성 데이터
export const customerCompositionData = {
  vip: { count: 2311, change: 5, changePercent: 9 },
  potentialVip: { count: 3200, change: 120, changePercent: 4 },
  normal: { count: 7426, change: -166, changePercent: -30 },
  churnRisk: { count: 1240, change: -30, changePercent: -30 },
  churned: { count: 673, change: 15, changePercent: 8 },
};

// 월별 요약
export const monthlySummary = {
  month: '2026년 3월',
  newCustomers: 178,
  churnedCustomers: 92,
  netGrowth: 86,
};

// 상담 카테고리 통계
export const consultCategoryData = {
  totalCount: 12500,
  baseDate: '2026-02-10',
  categories: [
    { categoryId: 1, categoryName: '요금 문의', count: 5000, ratio: 40.0 },
    { categoryId: 2, categoryName: '결합 할인', count: 3750, ratio: 30.0 },
    { categoryId: 3, categoryName: '로밍/부가서비스', count: 2500, ratio: 20.0 },
    { categoryId: 4, categoryName: '단말기 장애', count: 1250, ratio: 10.0 },
  ],
};

// 상담 시간대별 통계
export const consultTimeData = [
  { hour: 9, inbound: 120, outbound: 50, total: 170 },
  { hour: 10, inbound: 350, outbound: 80, total: 430 },
  { hour: 11, inbound: 280, outbound: 90, total: 370 },
  { hour: 12, inbound: 150, outbound: 40, total: 190 },
  { hour: 13, inbound: 200, outbound: 60, total: 260 },
  { hour: 14, inbound: 210, outbound: 400, total: 610 },
  { hour: 15, inbound: 300, outbound: 120, total: 420 },
  { hour: 16, inbound: 250, outbound: 100, total: 350 },
  { hour: 17, inbound: 180, outbound: 70, total: 250 },
];

// 아웃바운드 통계
export const outboundData = {
  totalAttempt: 5000,
  successCount: 1200,
  successRate: 24.0,
  promotionStats: [
    { promotionName: '겨울 로밍 특가', attempt: 2000, success: 800 },
    { promotionName: '결합 할인 안내', attempt: 1500, success: 250 },
    { promotionName: '멤버십 업그레이드', attempt: 1000, success: 100 },
    { promotionName: '해지 방어', attempt: 500, success: 50 },
  ],
};

// 상담 만족도 통계
export const satisfactionData = {
  averageScore: 8.4,
  totalEvaluations: 1200,
  scoreDistribution: [
    { score: 5, count: 600, label: '매우 만족' },
    { score: 4, count: 400, label: '만족' },
    { score: 3, count: 150, label: '보통' },
    { score: 2, count: 40, label: '불만족' },
    { score: 1, count: 10, label: '매우 불만족' },
  ],
};
