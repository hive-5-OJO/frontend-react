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

// 100,000명의 목 고객 데이터 생성
export const mockCustomers: MockCustomerItem[] = Array.from({ length: 100000 }, (_, i) => {
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
