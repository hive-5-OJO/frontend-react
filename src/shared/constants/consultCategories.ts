/**
 * 상담 카테고리 데이터
 * parent_id가 null이면 대분류, 있으면 소분류
 */

export interface ConsultCategory {
  id: number;
  name: string;
  parentId: number | null;
}

export const CONSULT_CATEGORIES: ConsultCategory[] = [
  // 대분류
  { id: 1, name: '결제/청구', parentId: null },
  { id: 2, name: '품질/장애', parentId: null },
  { id: 3, name: '요금제/상품', parentId: null },
  { id: 4, name: '혜택/프로모션', parentId: null },
  { id: 5, name: '가입/해지/변경', parentId: null },
  { id: 6, name: '기타', parentId: null },
  
  // 소분류 - 결제/청구 (parent_id: 1)
  { id: 7, name: '납부/연체/미납', parentId: 1 },
  { id: 8, name: '요금/청구서 문의', parentId: 1 },
  { id: 9, name: '환불/정정 요청', parentId: 1 },
  
  // 소분류 - 품질/장애 (parent_id: 2)
  { id: 16, name: '통화/문자 장애', parentId: 2 },
  { id: 17, name: '데이터/속도', parentId: 2 },
  { id: 18, name: '로밍', parentId: 2 },
  
  // 소분류 - 요금제/상품 (parent_id: 3)
  { id: 10, name: '요금제 변경', parentId: 3 },
  { id: 11, name: '부가서비스', parentId: 3 },
  { id: 12, name: '단말/기기 문의', parentId: 3 },
  
  // 소분류 - 혜택/프로모션 (parent_id: 4)
  { id: 13, name: '할인/쿠폰/프로모션', parentId: 4 },
  { id: 14, name: '멤버십/포인트', parentId: 4 },
  { id: 15, name: '제휴카드', parentId: 4 },
  
  // 소분류 - 가입/해지/변경 (parent_id: 5)
  { id: 19, name: '해지', parentId: 5 },
  { id: 20, name: '가입', parentId: 5 },
  { id: 21, name: '명의/번호 변경', parentId: 5 },
];

/**
 * 상담 카테고리 대분류별 색상 스타일
 */
export const CONSULT_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '결제/청구': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  '품질/장애': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  '요금제/상품': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  '혜택/프로모션': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  '가입/해지/변경': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  '기타': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

const DEFAULT_CATEGORY_COLOR = { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };

/**
 * 카테고리명으로 대분류 색상 가져오기
 * 소분류명이 들어와도 대분류를 찾아서 색상 반환
 */
export const getCategoryColor = (categoryName: string) => {
  // 대분류에서 직접 매칭
  if (CONSULT_CATEGORY_COLORS[categoryName]) {
    return CONSULT_CATEGORY_COLORS[categoryName];
  }

  // 소분류인 경우 대분류 찾기
  const category = CONSULT_CATEGORIES.find(cat => cat.name === categoryName);
  if (category?.parentId) {
    const parent = getCategoryById(category.parentId);
    if (parent) {
      return CONSULT_CATEGORY_COLORS[parent.name] || DEFAULT_CATEGORY_COLOR;
    }
  }

  return DEFAULT_CATEGORY_COLOR;
};

/**
 * 대분류 카테고리만 가져오기
 */
export const getParentCategories = (): ConsultCategory[] => {
  return CONSULT_CATEGORIES.filter(cat => cat.parentId === null);
};

/**
 * 특정 대분류의 소분류 가져오기
 */
export const getChildCategories = (parentId: number): ConsultCategory[] => {
  return CONSULT_CATEGORIES.filter(cat => cat.parentId === parentId);
};

/**
 * ID로 카테고리 찾기
 */
export const getCategoryById = (id: number): ConsultCategory | undefined => {
  return CONSULT_CATEGORIES.find(cat => cat.id === id);
};

/**
 * 카테고리 전체 경로 가져오기 (대분류 > 소분류)
 */
export const getCategoryPath = (categoryId: number): string => {
  const category = getCategoryById(categoryId);
  if (!category) return '';
  
  if (category.parentId === null) {
    return category.name;
  }
  
  const parent = getCategoryById(category.parentId);
  return parent ? `${parent.name} > ${category.name}` : category.name;
};
