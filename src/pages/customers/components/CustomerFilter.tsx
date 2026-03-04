import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

interface Filters {
  isVip?: boolean | null;
  service?: string | null;
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

const CustomerFilter = ({ filters, onFiltersChange }: Props) => {
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

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const handleVipChange = (val: boolean | null) => {
    onFiltersChange({ ...filters, isVip: val });
  };

  const handleServiceChange = (val: string | null) => {
    onFiltersChange({ ...filters, service: val });
  };

  const handleCategoryChange = (val: string | null) => {
    onFiltersChange({ ...filters, consultCategory: val });
  };

  const handleFrequencyChange = (val: string | null) => {
    onFiltersChange({ ...filters, consultFrequency: val });
  };

  const vipValue =
    filters.isVip === null || filters.isVip === undefined
      ? 'all'
      : filters.isVip
        ? 'yes'
        : 'no';

  const hasActiveFilters =
    filters.isVip !== null ||
    filters.isVip !== undefined ||
    filters.service ||
    filters.consultCategory ||
    filters.consultFrequency;

  return (
    <div className="space-y-4">
      {/* 필터 선택 섹션 */}
      <div className="flex flex-wrap gap-3">
        {/* VIP 필터 */}
        <div className="w-[140px]">
          <Select
            value={vipValue}
            onValueChange={(val) => {
              if (val === 'all') handleVipChange(null);
              else handleVipChange(val === 'yes');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="VIP 여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">VIP 여부</SelectItem>
              <SelectItem value="yes">VIP만</SelectItem>
              <SelectItem value="no">일반 고객</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 서비스 필터 */}
        <div className="w-[140px]">
          <Select
            value={filters.service || 'all'}
            onValueChange={(val) => handleServiceChange(val === 'all' ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="서비스" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">서비스</SelectItem>
              {services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
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
          {filters.isVip === true && (
            <button
              onClick={() => handleVipChange(null)}
              className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-100 px-3 py-1 text-sm text-purple-700 transition hover:bg-purple-200"
            >
              <span>VIP</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.isVip === false && (
            <button
              onClick={() => handleVipChange(null)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
            >
              <span>일반 고객</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.service && (
            <button
              onClick={() => handleServiceChange(null)}
              className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-200"
            >
              <span>{filters.service}</span>
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
