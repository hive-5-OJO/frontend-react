import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

interface Filters {
  customerType?: string | null;
  consultCategory?: string | null;
  consultFrequency?: string | null;
}

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const getFrequencyLabel = (val: string | null) => {
  const map: { [key: string]: string } = {
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
  };
  return map[val || ''] || '';
};

const getFrequencyColor = (val: string | null) => {
  const map: { [key: string]: string } = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-blue-100 text-blue-700 border-blue-300',
  };
  return map[val || ''] || '';
};

const getCustomerTypeLabel = (val: string | null) => {
  const map: { [key: string]: string } = {
    vip: 'VIP',
    potential_vip: '잠재 VIP',
    normal: '일반',
    churn_risk: '이탈 우려',
    churned: '이탈',
  };
  return map[val || ''] || '';
};

const getCustomerTypeColor = (val: string | null) => {
  const map: { [key: string]: string } = {
    vip: 'bg-purple-100 text-purple-700 border-purple-300',
    potential_vip: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    normal: 'bg-gray-100 text-gray-700 border-gray-300',
    churn_risk: 'bg-orange-100 text-orange-700 border-orange-300',
    churned: 'bg-red-100 text-red-700 border-red-300',
  };
  return map[val || ''] || '';
};

const CustomerFilter = ({ filters, onFiltersChange }: Props) => {
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

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const handleCustomerTypeChange = (val: string | null) => {
    onFiltersChange({ ...filters, customerType: val });
  };

  const handleCategoryChange = (val: string | null) => {
    onFiltersChange({ ...filters, consultCategory: val });
  };

  const handleFrequencyChange = (val: string | null) => {
    onFiltersChange({ ...filters, consultFrequency: val });
  };

  const hasActiveFilters =
    filters.customerType ||
    filters.consultCategory ||
    filters.consultFrequency;

  return (
    <div className="space-y-4">
      {/* 필터 선택 섹션 */}
      <div className="flex flex-wrap gap-3">
        {/* 고객 분류 필터 */}
        <div className="w-[140px]">
          <Select
            value={filters.customerType || 'all'}
            onValueChange={(val) => handleCustomerTypeChange(val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="고객 분류" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">고객 분류</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="potential_vip">잠재 VIP</SelectItem>
              <SelectItem value="normal">일반</SelectItem>
              <SelectItem value="churn_risk">이탈 우려</SelectItem>
              <SelectItem value="churned">이탈</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 상담 카테고리 필터 */}
        <div className="w-[160px]">
          <Select
            value={filters.consultCategory || 'all'}
            onValueChange={(val) => handleCategoryChange(val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="상담 카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">상담 카테고리</SelectItem>
              {consultCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 상담 빈도 필터 */}
        <div className="w-[140px]">
          <Select
            value={filters.consultFrequency || 'all'}
            onValueChange={(val) => handleFrequencyChange(val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="상담 빈도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">상담 빈도</SelectItem>
              <SelectItem value="high">HIGH</SelectItem>
              <SelectItem value="medium">MEDIUM</SelectItem>
              <SelectItem value="low">LOW</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 선택된 필터 태그 표시 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {filters.customerType && (
            <button
              onClick={() => handleCustomerTypeChange(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${getCustomerTypeColor(filters.customerType)}`}
            >
              <span>{getCustomerTypeLabel(filters.customerType)}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.consultCategory && (
            <button
              onClick={() => handleCategoryChange(null)}
              className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-100 px-3 py-1 text-sm text-green-700 transition hover:bg-green-200"
            >
              <span>{filters.consultCategory}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.consultFrequency && (
            <button
              onClick={() => handleFrequencyChange(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${getFrequencyColor(filters.consultFrequency)}`}
            >
              <span>상담 빈도: {getFrequencyLabel(filters.consultFrequency)}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
            >
              전체 초기화
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerFilter;
