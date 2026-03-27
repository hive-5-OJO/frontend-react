/**
 * 고객 목록 목 데이터
 * 백엔드 API 응답과 동일한 구조
 */

export interface MockCustomerItem {
  memberId: number;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  servicePeriod: string;
  consultCategory: string | null;
  consultFrequency: string;
  vip: string;
}

const NAMES = [
  '김민수', '이서연', '박지훈', '최유진', '정하늘', '강도윤', '조수빈', '윤재현',
  '임소희', '한승우', '오지민', '신예린', '권태영', '송민지', '류현우', '장서윤',
  '배준혁', '홍다은', '문성호', '양지수', '서동현', '전미래', '황인서', '안채원',
  '노경민', '유하린', '구본석', '남지연', '하윤호', '차은서',
];

const SERVICES = [
  '5G 프리미엄', '5G 스탠다드', 'LTE 베이직', 'LTE 시니어', '5G 무제한',
  '데이터 플러스', 'LTE 에센셜', '5G 라이트', null,
];

const CATEGORIES = [
  '요금/청구서 문의', '납부/연체/미납', '요금제 변경', '부가서비스',
  '할인/쿠폰/프로모션', '기술 지원', '해지 문의', null,
];

const FREQUENCIES: string[] = ['HIGH', 'MEDIUM', 'LOW'];
const VIP_TYPES = ['VIP', '잠재 VIP', '일반', '이탈 우려', '이탈'];


// 랜덤 날짜 생성 (2023-01 ~ 2026-02)
const randomDate = (seed: number) => {
  const year = 2023 + (seed % 3);
  const month = (seed % 12) + 1;
  const day = (seed % 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const randomPhone = (seed: number) => {
  const mid = String(1000 + (seed * 37) % 9000).padStart(4, '0');
  const last = String(1000 + (seed * 53) % 9000).padStart(4, '0');
  return `010-${mid}-${last}`;
};

const randomEmail = (_name: string, seed: number) => {
  const domains = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'hanmail.net'];
  const romanized = `user${seed}`;
  return `${romanized}@${domains[seed % domains.length]}`;
};

// 100명의 목 고객 데이터 생성
export const mockCustomers: MockCustomerItem[] = Array.from({ length: 100 }, (_, i) => {
  const id = 10001 + i;
  const name = NAMES[i % NAMES.length];
  const startDate = randomDate(i);
  const endDate = randomDate(i + 50);

  return {
    memberId: id,
    name,
    phone: randomPhone(id),
    email: randomEmail(name, id),
    service: SERVICES[i % SERVICES.length],
    servicePeriod: `${startDate} ~ ${endDate}`,
    consultCategory: CATEGORIES[i % CATEGORIES.length],
    consultFrequency: FREQUENCIES[i % FREQUENCIES.length],
    vip: VIP_TYPES[i % VIP_TYPES.length],
  };
});

/**
 * 페이지네이션 적용된 목 응답 생성
 */
export const getMockCustomerList = (page: number, size: number) => {
  const start = page * size;
  const end = start + size;
  const content = mockCustomers.slice(start, end);

  return {
    content,
    page: {
      page,
      size,
      totalElements: mockCustomers.length,
      totalPages: Math.ceil(mockCustomers.length / size),
      hasNext: end < mockCustomers.length,
      hasPrevious: page > 0,
    },
  };
};

/**
 * 검색 목 응답 생성
 */
export const getMockCustomerSearch = (keyword: string, page: number, size: number) => {
  const kw = keyword.toLowerCase();
  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(kw) ||
      (c.phone && c.phone.includes(kw)) ||
      (c.email && c.email.toLowerCase().includes(kw)),
  );
  const start = page * size;
  const content = filtered.slice(start, start + size);

  return {
    content,
    page: {
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      hasNext: start + size < filtered.length,
      hasPrevious: page > 0,
    },
  };
};

/**
 * 필터 목 응답 생성
 */
export const getMockCustomerFilter = (
  params: { segment?: string; frequency?: string; categoryId?: number },
  page: number,
  size: number,
) => {
  let filtered = [...mockCustomers];

  if (params.segment) {
    const segmentMap: Record<string, string> = {
      VIP: 'VIP',
      LOYAL: '잠재 VIP',
      COMMON: '일반',
      RISK: '이탈 우려',
      LOST: '이탈',
    };
    const target = segmentMap[params.segment];
    if (target) filtered = filtered.filter((c) => c.vip === target);
  }

  if (params.frequency) {
    filtered = filtered.filter((c) => c.consultFrequency === params.frequency);
  }

  const start = page * size;
  const content = filtered.slice(start, start + size);

  return {
    content,
    page: {
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      hasNext: start + size < filtered.length,
      hasPrevious: page > 0,
    },
  };
};

import type { Customer, CustomerFeature, ConsultTimelineItem, RFMScore, LTVData, Subscription, RecommendItem } from '../model/types';

const REGIONS = ['서울', '경기', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];
const SEGMENT_TYPES = ['VIP', 'LOYAL', 'COMMON', 'RISK', 'LOST'];
const CONSULT_CATEGORIES_DETAIL = [
  '요금/청구서 문의', '납부/연체/미납', '요금제 변경', '부가서비스',
  '할인/쿠폰/프로모션', '기술 지원', '해지 문의',
];

/**
 * 고객 상세 정보 목 데이터
 * 목록 데이터와 동일한 고객 정보를 반환
 */
export const getMockCustomerDetail = (id: number): Customer => {
  const listItem = mockCustomers.find((c) => c.memberId === id);
  const seed = id % 100;
  const name = listItem?.name ?? NAMES[seed % NAMES.length];
  const phone = listItem?.phone ?? randomPhone(id);
  const email = listItem?.email ?? randomEmail(name, id);

  return {
    id,
    name,
    phone,
    email,
    joinedAt: randomDate(seed),
    gender: seed % 2 === 0 ? 'M' : 'F',
    birthDate: `${1980 + (seed % 25)}-${String((seed % 12) + 1).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`,
    region: REGIONS[seed % REGIONS.length],
    status: seed % 10 === 0 ? 'DORMANT' : seed % 15 === 0 ? 'TERMINATED' : 'ACTIVE',
    consent: {
      personalAccepted: 'Y',
      marketingAccepted: seed % 3 === 0 ? 'N' : 'Y',
      isConverted: seed % 2 === 0 ? 'Y' : 'N',
      acceptedAt: '2025-08-15T10:30:00',
      expiresAt: null,
    },
  };
};

/**
 * 고객 특성 정보 목 데이터
 */
export const getMockCustomerFeatures = (id: number): CustomerFeature => {
  const seed = id % 100;
  return {
    memberId: id,
    featureBaseDate: '2026-02-10',
    consultation: {
      totalConsultCount: 30 + (seed * 7) % 200,
      last7dConsultCount: seed % 8,
      last30dConsultCount: 2 + (seed * 3) % 15,
      avgMonthlyConsultCount: parseFloat((1 + (seed % 10) * 0.5).toFixed(1)),
      lastConsultDate: '2026-02-08',
      nightConsultCount: seed % 6,
      weekendConsultCount: seed % 10,
      topConsultCategory: CONSULT_CATEGORIES_DETAIL[seed % CONSULT_CATEGORIES_DETAIL.length],
      totalComplaintCount: seed % 5,
      lastConsultDaysAgo: 1 + (seed % 14),
    },
    monetary: {
      totalRevenue: 500000 + (seed * 73000) % 5000000,
      lastPaymentAmount: 30000 + (seed * 11000) % 200000,
      avgMonthlyBill: parseFloat((50000 + (seed * 5000) % 150000).toFixed(1)),
      lastPaymentDate: '2026-02-05',
      paymentCount6m: 3 + (seed % 6),
      monthlyRevenue: 60000 + (seed * 8000) % 200000,
      paymentDelayCount: seed % 3,
      prevMonthlyRevenue: 55000 + (seed * 7000) % 180000,
      isVipPrevMonth: seed % 5 === 0 ? 'true' : 'false',
      avgOrderVal: parseFloat((40000 + (seed * 6000) % 120000).toFixed(1)),
      purchaseCycle: 15 + (seed % 45),
    },
    lifecycle: {
      memberLifetimeDays: 180 + (seed * 17) % 1500,
      daysSinceLastActivity: 1 + (seed % 30),
      contractEndDaysLeft: 30 + (seed * 11) % 300,
      isDormantFlag: seed % 10 === 0,
      isNewCustomerFlag: seed % 20 === 0,
      isTerminatedFlag: seed % 15 === 0,
      signupDate: randomDate(seed + 10),
    },
    usage: {
      totalUsageAmount: 50000 + (seed * 3000) % 200000,
      avgDailyUsage: parseFloat((1000 + (seed * 500) % 8000).toFixed(1)),
      maxUsageAmount: 5000 + (seed * 1000) % 15000,
      usagePeakHour: 8 + (seed % 14),
      premiumServiceCount: seed % 4,
      lastActivityDate: '2026-02-09',
      usageActiveDays30d: 15 + (seed % 16),
    },
  };
};

/**
 * 상담 타임라인 목 데이터
 */
export const getMockConsultTimeline = (id: number): ConsultTimelineItem[] => {
  const seed = id % 100;
  const count = 3 + (seed % 5);
  return Array.from({ length: count }, (_, i) => {
    const day = 10 - i * 2;
    return {
      date: `2026-02-${String(Math.max(1, day)).padStart(2, '0')}`,
      category: CONSULT_CATEGORIES_DETAIL[(seed + i) % CONSULT_CATEGORIES_DETAIL.length],
      direction: (i % 3 === 0 ? 'OUT' : 'IN') as 'IN' | 'OUT',
      content: [
        '요금 관련 문의 접수',
        '결제 오류 확인 요청',
        '요금제 변경 상담',
        'VIP 프로모션 안내',
        '부가서비스 해지 요청',
        '기술 지원 문의',
        '해지 방어 상담',
      ][(seed + i) % 7],
      promotionName: i % 3 === 0 ? '신년 맞이 할인 프로모션' : undefined,
      satisfactionScore: 2 + ((seed + i) % 4),
    };
  });
};

/**
 * RFM 점수 목 데이터
 */
export const getMockRFMScore = (id: number): RFMScore => {
  const seed = id % 100;
  const rScore = 1 + (seed % 5);
  const fScore = 1 + ((seed * 3) % 5);
  const mScore = 1 + ((seed * 7) % 5);
  return {
    recency: `2026-01-${String(5 + (seed % 25)).padStart(2, '0')}T14:30:00`,
    frequency: 1 + (seed * 2) % 20,
    monetary: 30000 + (seed * 5000) % 500000,
    score: rScore + fScore + mScore,
    updatedAt: '2026-02-10T04:00:00',
    rScore,
    fScore,
    mScore,
    segmentType: SEGMENT_TYPES[seed % SEGMENT_TYPES.length],
  };
};

/**
 * LTV 데이터 목 데이터
 */
export const getMockLTVData = (id: number): LTVData => {
  const seed = id % 100;
  return {
    memberId: id,
    avgValue: 40000 + (seed * 8000) % 150000,
    totalRevenue: 500000 + (seed * 50000) % 4000000,
    frequency: 3 + (seed % 15),
    lifespanDays: 180 + (seed * 20) % 1200,
    ltv: 14388 + (seed * 36000) % 3600000,
  };
};

/**
 * 구독 서비스 목 데이터
 */
export const getMockSubscriptions = (id: number): Subscription[] => {
  const seed = id % 100;
  const count = 1 + (seed % 3);
  const products = [
    { planId: 1, productName: '5G 프리미엄 요금제', productType: 'MONTHLY', price: 89000 },
    { planId: 2, productName: '클라우드 스토리지 100GB', productType: 'MONTHLY', price: 9900 },
    { planId: 3, productName: '음악 스트리밍 무제한', productType: 'YEARLY', price: 79000 },
    { planId: 4, productName: '영상 스트리밍 프리미엄', productType: 'MONTHLY', price: 14900 },
    { planId: 5, productName: '보험 안심 패키지', productType: 'YEARLY', price: 120000 },
  ];
  const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'PAUSED', 'CANCELLED'];

  return Array.from({ length: count }, (_, i) => {
    const product = products[(seed + i) % products.length];
    return {
      subscribeId: id * 10 + i,
      product,
      quantity: 1,
      totalPrice: product.price,
      startedAt: `2025-${String((seed % 12) + 1).padStart(2, '0')}-01T00:00:00`,
      status: statuses[(seed + i) % statuses.length],
    };
  });
};

/**
 * 메모 목 데이터 (인메모리 저장소)
 */
const memoStore: Record<number, { id: number; adminId: number; memberId: number; content: string } | null> = {};

export const getMockMemo = (memberId: number) => {
  if (memoStore[memberId] !== undefined) return memoStore[memberId];
  // 일부 고객에게 기본 메모 제공
  const seed = memberId % 100;
  if (seed % 4 === 0) {
    const memo = {
      id: memberId * 100,
      adminId: 1,
      memberId,
      content: [
        'VIP 고객 - 특별 관리 필요. 매월 프로모션 안내 진행 중.',
        '최근 불만 상담 이력 있음. 해지 방어 필요.',
        '장기 고객. 로열티 프로그램 대상자.',
        '신규 가입 고객. 온보딩 프로그램 진행 중.',
      ][seed % 4],
    };
    memoStore[memberId] = memo;
    return memo;
  }
  return null;
};

export const createMockMemo = (memberId: number, content: string): number => {
  const id = Date.now();
  memoStore[memberId] = { id, adminId: 1, memberId, content };
  return id;
};

export const deleteMockMemo = (memberId: number): void => {
  memoStore[memberId] = null;
};

/**
 * AI 추천 서비스 목 데이터
 */
export const getMockRecommendation = (id: number): RecommendItem[] => {
  const seed = id % 100;
  const allRecommendations: RecommendItem[] = [
    {
      memberId: id, rank: 1,
      recommendedProduct: '5G 무제한 요금제 B',
      price: 89000, score: '92',
      reason: '최근 3개월 데이터 사용량이 20% 증가하였으며, LTV 상위 10% 고객',
      createdAt: '2026-03-14',
    },
    {
      memberId: id, rank: 2,
      recommendedProduct: '로밍 안심 옵션',
      price: 11000, score: '78',
      reason: '과거 1년 내 3회 이상의 해외 상담 이력 존재',
      createdAt: '2026-03-14',
    },
    {
      memberId: id, rank: 3,
      recommendedProduct: '클라우드 스토리지 프리미엄',
      price: 14900, score: '65',
      reason: '데이터 사용 패턴 분석 결과 대용량 파일 전송 빈도가 높음',
      createdAt: '2026-03-14',
    },
  ];
  // seed에 따라 1~3개 반환
  const count = 1 + (seed % 3);
  return allRecommendations.slice(0, count);
};
