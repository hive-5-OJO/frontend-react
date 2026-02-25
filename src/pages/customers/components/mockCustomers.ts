type C = {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinedAt: string;
  service: string;
  period: string;
  consultFrequency: 'high' | 'medium' | 'low';
  consultCategory: string;
  isVip: boolean;
  isNewCustomer?: boolean;
};

const firstNames = [
  '김',
  '이',
  '박',
  '최',
  '한',
  '윤',
  '송',
  '강',
  '정',
  '조',
  '오',
  '서',
  '장',
  '임',
  '백',
];
const lastNames = [
  '민수',
  '하늘',
  '서준',
  '영희',
  '지민',
  '지훈',
  '민혁',
  '지아',
  '서영',
  '수진',
];
const services = ['Basic', 'Pro', 'Enterprise'];
const consultCategories = [
  '기술 지원',
  '계약/청구',
  '기능 요청',
  '성능 최적화',
  '보안/권한',
  '데이터 관리',
  '통합/API',
  '교육/교습',
  '기타 문의',
];

const makeDate = (yearStart = 2019, yearEnd = 2024, idx = 0) => {
  const year = yearStart + (idx % (yearEnd - yearStart + 1));
  const month = ((idx * 37) % 12) + 1;
  const day = ((idx * 23) % 27) + 1;
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

// 최근 30일 이내 날짜 생성 (신규 가입자용)
const makeRecentDate = () => {
  const today = new Date('2026-02-10'); // 기준일
  const daysAgo = Math.floor(Math.random() * 30); // 0~29일 전
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mockCustomers: C[] = [];
for (let i = 1; i <= 100; i += 1) {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const name = `${fn}${ln}`;
  const phone = `010-${String(1000 + (i % 9000)).padStart(4, '0')}-${String(1000 + ((i * 3) % 9000)).padStart(4, '0')}`;
  const email = `${ln.toLowerCase()}.${fn.toLowerCase()}${i}@example.com`;
  const service = services[i % services.length];
  const consultFrequency =
    i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low';
  const consultCategory = consultCategories[i % consultCategories.length];
  const isVip = i % 5 === 0;
  
  // 처음 5명을 신규 가입자로 설정
  const isNewCustomer = i <= 5;
  const joinedAt = isNewCustomer ? makeRecentDate() : makeDate(2019, 2024, i);
  
  mockCustomers.push({
    id: i,
    name,
    phone,
    email,
    joinedAt,
    service,
    period: `${joinedAt} ~ 현재`,
    consultFrequency,
    consultCategory,
    isVip,
    isNewCustomer,
  });
}

export { mockCustomers };
export default mockCustomers;
