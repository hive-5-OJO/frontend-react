import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { getParentCategories, getChildCategories, getCategoryPath } from '@/shared/constants';
import { useState, useEffect } from 'react';

interface Filters {
  segment?: string | null;
  frequency?: string | null;
  service?: string | null;
  categoryId?: number | null;
}

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const getFrequencyLabel = (val: string | null) => {
  const map: Record<string, string> = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
  return map[val || ''] || '';
};

const getFrequencyColor = (val: string | null) => {
  const map: Record<string, string> = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-blue-100 text-blue-700 border-blue-300',
  };
  return map[val || ''] || '';
};

const getSegmentLabel = (val: string | null) => {
  const map: Record<string, string> = {
    vip: 'VIP',
    potential_vip: '잠재 VIP',
    normal: '일반',
    churn_risk: '이탈 우려',
    churned: '이탈',
  };
  return map[val || ''] || '';
};

const getSegmentColor = (val: string | null) => {
  const map: Record<string, string> = {
    vip: 'bg-purple-100 text-purple-700 border-purple-300',
    potential_vip: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    normal: 'bg-gray-100 text-gray-700 border-gray-300',
    churn_risk: 'bg-orange-100 text-orange-700 border-orange-300',
    churned: 'bg-red-100 text-red-700 border-red-300',
  };
  return map[val || ''] || '';
};

const CustomerFilter = ({ filters, onFiltersChange }: Props) => {
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null);
  const parentCategories = getParentCategories();

  // 필터의 categoryId가 외부에서 초기화될 때 대분류도 동기화
  useEffect(() => {
    if (filters.categoryId) {
      const allChildCategories = parentCategories.flatMap(parent =>
        getChildCategories(parent.id)
      );
      const selectedChild = allChildCategories.find(child => child.id === filters.categoryId);
      if (selectedChild?.parentId && selectedChild.parentId !== selectedParentCategory) {
        setSelectedParentCategory(selectedChild.parentId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.categoryId]);

  const handleClearFilters = () => {
    onFiltersChange({});
    setSelectedParentCategory(null);
  };

  // 필터는 한 번에 하나만 — 선택 시 다른 필터 초기화
  const handleSegmentChange = (val: string | null) => {
    setSelectedParentCategory(null);
    onFiltersChange(val ? { segment: val } : {});
  };

  const handleFrequencyChange = (val: string | null) => {
    setSelectedParentCategory(null);
    onFiltersChange(val ? { frequency: val } : {});
  };

  const handleServiceChange = (val: string | null) => {
    setSelectedParentCategory(null);
    onFiltersChange(val ? { service: val } : {});
  };

  const handleParentCategoryChange = (val: string) => {
    if (val === 'all') {
      setSelectedParentCategory(null);
      onFiltersChange({});
    } else {
      const parentId = parseInt(val, 10);
      setSelectedParentCategory(parentId);
      // 대분류 선택 시 대분류 ID를 categoryId로 전송
      onFiltersChange({ categoryId: parentId });
    }
  };

  const handleChildCategoryChange = (val: string) => {
    if (val === 'all') {
      // 소분류 해제 시 대분류 ID로 복원
      onFiltersChange(selectedParentCategory ? { categoryId: selectedParentCategory } : {});
    } else {
      onFiltersChange({ categoryId: parseInt(val, 10) });
    }
  };

  const hasActiveFilters = filters.segment || filters.frequency || filters.service || filters.categoryId;

  const childCategories = selectedParentCategory
    ? getChildCategories(selectedParentCategory)
    : [];

  return (
    <div className="space-y-4">
      {/* 필터 선택 섹션 */}
      <div className="flex flex-wrap gap-3">
        {/* 고객 분류 필터 */}
        <div className="w-[140px]">
          <Select
            value={filters.segment || 'all'}
            onValueChange={(val) => handleSegmentChange(val === 'all' ? null : val)}
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

        {/* 상담 카테고리 대분류 필터 */}
        <div className="w-[160px]">
          <Select
            value={filters.categoryId && selectedParentCategory ? selectedParentCategory.toString() : 'all'}
            onValueChange={handleParentCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="상담 카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">상담 카테고리</SelectItem>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 상담 카테고리 소분류 필터 */}
        {selectedParentCategory && childCategories.length > 0 && (
          <div className="w-[160px]">
            <Select
              value={
                filters.categoryId && !parentCategories.some(p => p.id === filters.categoryId)
                  ? filters.categoryId.toString()
                  : 'all'
              }
              onValueChange={handleChildCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="세부 카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 (대분류)</SelectItem>
                {childCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 상담 빈도 필터 */}
        <div className="w-[140px]">
          <Select
            value={filters.frequency || 'all'}
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
          {filters.segment && (
            <button
              onClick={() => handleSegmentChange(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${getSegmentColor(filters.segment)}`}
            >
              <span>{getSegmentLabel(filters.segment)}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.categoryId && (
            <button
              onClick={() => {
                setSelectedParentCategory(null);
                onFiltersChange({});
              }}
              className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-100 px-3 py-1 text-sm text-green-700 transition hover:bg-green-200"
            >
              <span>{getCategoryPath(filters.categoryId)}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.frequency && (
            <button
              onClick={() => handleFrequencyChange(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${getFrequencyColor(filters.frequency)}`}
            >
              <span>상담 빈도: {getFrequencyLabel(filters.frequency)}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {filters.service && (
            <button
              onClick={() => handleServiceChange(null)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-sm text-cyan-700 transition hover:bg-cyan-200"
            >
              <span>서비스: {filters.service}</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={handleClearFilters}
            className="ml-2 text-sm font-medium text-gray-500 transition hover:text-gray-700"
          >
            전체 초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerFilter;
