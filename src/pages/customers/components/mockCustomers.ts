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
  mockCustomers.push({
    id: i,
    name,
    phone,
    email,
    joinedAt: makeDate(2019, 2024, i),
    service,
    period: `${makeDate(2019, 2024, i)} ~ 현재`,
    consultFrequency,
    consultCategory,
    isVip,
  });
}

export { mockCustomers };
export default mockCustomers;
