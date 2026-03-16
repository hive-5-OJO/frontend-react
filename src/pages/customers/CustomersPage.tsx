import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomerTable } from '@/widgets/customer-table';
import { CustomerDetailSlide } from '@/widgets/customer-detail';
import { MemoModal } from '@/widgets/customer-detail';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { SelectionBasket } from '@/widgets/selection-basket';
import {
  Pagination,
  PageHeader,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FilterToggleButton,
} from '@/shared/ui';
import { useCustomerList, useCustomerSearch, useCustomerFilter } from '@/entities/customer/model/useCustomerQueries';
import CustomerFilter from './components/CustomerFilter';
import type { Customer, CustomerType } from '@/entities/customer/model/types';

interface Filters {
  segment?: string | null;
  frequency?: string | null;
  categoryId?: number | null;
}

interface SortField {
  field: string;
  order: 'asc' | 'desc';
}

// API 응답을 Customer 타입으로 변환
const mapApiResponseToCustomer = (apiData: {
  memberId: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  service: string | null;
  servicePeriod: string;
  consultCategory: string | null;
  consultFrequency: string;
  vip: string;
}): Customer => {
  // vip 값을 CustomerType으로 매핑
  const getCustomerType = (vip: string): CustomerType => {
    const vipLower = vip.toLowerCase();
    if (vipLower.includes('vip') && !vipLower.includes('잠재')) return 'vip';
    if (vipLower.includes('잠재')) return 'potential_vip';
    if (vipLower.includes('이탈 우려')) return 'churn_risk';
    if (vipLower.includes('이탈')) return 'churned';
    return 'normal';
  };

  // consultFrequency 매핑
  const getConsultFrequency = (freq: string) => {
    const freqUpper = freq.toUpperCase();
    if (freqUpper === 'HIGH') return 'high';
    if (freqUpper === 'MEDIUM') return 'medium';
    if (freqUpper === 'LOW') return 'low';
    return 'low';
  };

  return {
    id: apiData.memberId,
    name: apiData.name,
    phone: apiData.phone || '',
    email: apiData.email || '',
    joinedAt: apiData.servicePeriod?.split(' ~ ')[0] || '',
    service: apiData.service || undefined,
    period: apiData.servicePeriod || '',
    consultCategory: apiData.consultCategory || undefined,
    consultFrequency: getConsultFrequency(apiData.consultFrequency || ''),
    customerType: getCustomerType(apiData.vip || ''),
  };
};

const CustomersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerTypeParam = searchParams.get('customerType');
  
  // URL에서 페이지 정보 읽기
  const pageParam = searchParams.get('page');
  const pageSizeParam = searchParams.get('pageSize');
  
  const [page, setPage] = useState(() => {
    const p = pageParam ? parseInt(pageParam, 10) : 0;
    return isNaN(p) ? 0 : p;
  });
  const [pageSize, setPageSize] = useState(() => {
    const ps = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
    return isNaN(ps) ? 10 : ps;
  });
  const [filters, setFilters] = useState<Filters>(() => {
    // 초기 상태에서 URL 파라미터 반영
    return customerTypeParam ? { segment: customerTypeParam } : {};
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sorts, setSorts] = useState<SortField[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true); // 기본적으로 열려있음

  // 페이지 변경 시 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    setSearchParams(params, { replace: true });
  }, [page, pageSize, setSearchParams, searchParams]);

  // 검색어가 있으면 검색 API, 없으면 목록 API 호출
  const isSearching = searchTerm.trim().length > 0;

  // 활성 필터 파라미터 구성 (한 번에 하나만)
  const activeFilterParam = (() => {
    if (filters.segment) return { segment: filters.segment };
    if (filters.frequency) return { frequency: filters.frequency };
    if (filters.categoryId) return { categoryId: filters.categoryId };
    return null;
  })();

  const isFiltering = !!activeFilterParam;

  // 목록 API 호출 (필터 없을 때)
  const { data: listResponse, isLoading: isLoadingList, error: listError } = useCustomerList({
    page,
    size: pageSize,
    sorts,
  });

  // 필터 API 호출 (필터 있을 때)
  const { data: filterResponse, isLoading: isLoadingFilter, error: filterError } = useCustomerFilter({
    page,
    size: pageSize,
    ...activeFilterParam,
  }, isFiltering && !isSearching);

  // 검색 API 호출
  const { data: searchResponse, isLoading: isLoadingSearch, error: searchError } = useCustomerSearch({
    keyword: searchTerm.trim(),
    page,
    size: pageSize,
  }, isSearching);

  // 우선순위: 검색 > 필터 > 목록
  const isLoading = isSearching ? isLoadingSearch : isFiltering ? isLoadingFilter : isLoadingList;
  const error = isSearching ? searchError : isFiltering ? filterError : listError;

  // API 데이터를 Customer 타입으로 변환
  const customers = (() => {
    if (isFiltering && !isSearching) {
      return filterResponse?.content?.map(mapApiResponseToCustomer) || [];
    }
    const resp = isSearching ? searchResponse : listResponse;
    return resp?.content?.map(mapApiResponseToCustomer) || [];
  })();
  const pageInfo = isSearching ? searchResponse?.page : isFiltering ? filterResponse?.page : listResponse?.page;
  const totalElements = pageInfo?.totalElements || 0;
  const totalPages = pageInfo?.totalPages || 1;

  // URL 파라미터 변경 시 필터 업데이트 (초기 로드 제외)
  useEffect(() => {
    if (customerTypeParam && filters.segment !== customerTypeParam) {
      setFilters({ segment: customerTypeParam });
      setIsFilterOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerTypeParam]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(0); // 첫 페이지로
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(0);
  };

  const handleSort = (field: string) => {
    setSorts((prev) => {
      const existingIndex = prev.findIndex((s) => s.field === field);
      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        if (existing.order === 'asc') {
          const updated = [...prev];
          updated[existingIndex] = { ...existing, order: 'desc' };
          return updated;
        }
        return prev.filter((s) => s.field !== field);
      }
      return [...prev, { field, order: 'asc' }];
    });
    setPage(0);
  };

  const handleClearSort = () => { setSorts([]); setPage(0); };
  const handleClearAll = () => { setFilters({}); setSearchTerm(''); setSorts([]); setPage(0); };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCustomer(null), 300);
  };

  // 클라이언트 사이드 정렬만 수행 (검색은 서버에서 처리됨)
  const sortedData = (() => {
    if (sorts.length === 0) return customers;
    const getSortValue = (c: Customer, field: string): string | number => {
      switch (field) {
        case 'name': return c.name;
        case 'phone': return c.phone || '';
        case 'email': return c.email || '';
        case 'period': return c.period || c.joinedAt || '';
        case 'frequency': {
          const freqOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return freqOrder[c.consultFrequency as string] || 0;
        }
        case 'customerType': {
          const typeOrder: Record<string, number> = { 
            vip: 5, 
            potential_vip: 4, 
            normal: 3, 
            churn_risk: 2, 
            churned: 1 
          };
          return typeOrder[c.customerType || 'normal'] || 0;
        }
        default: return '';
      }
    };
    return [...customers].sort((a, b) => {
      for (const sort of sorts) {
        const aVal = getSortValue(a, sort.field);
        const bVal = getSortValue(b, sort.field);
        let cmp = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          cmp = aVal.localeCompare(bVal, 'ko-KR');
        } else {
          cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
        if (cmp !== 0) return sort.order === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  })();

  const displayPage = page + 1; // 사용자에게는 1부터 표시
  const start = page * pageSize;
  const pageData = sortedData;

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== null && v !== undefined) || searchTerm || sorts.length > 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        {/* 필터 섹션 */}
        <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6 pb-4">
            <PageHeader
              title="고객 목록"
              description="고객 정보를 한눈에 관리하고 상담 현황을 추적하세요"
              actions={
                <FilterToggleButton isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} />
              }
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h3 className="text-sm font-semibold text-gray-700">필터 & 검색</h3>
                {isFilterOpen && (
                  <>
                    <div className="flex items-center gap-1.5 rounded-md bg-primary-50 px-2 py-1 text-xs text-primary-600">
                      <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">테이블 헤더 클릭으로 정렬 가능</span>
                      <span className="sm:hidden">헤더 클릭 정렬</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-primary-50 px-2 py-1 text-xs text-primary-600">
                      <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span className="hidden sm:inline">클릭 순서대로 다중 정렬 적용</span>
                      <span className="sm:hidden">다중 정렬</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600 md:text-2xl">
                    {isLoading ? '...' : totalElements.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">명의 고객</p>
                </div>
                {hasActiveFilters && (
                  <button onClick={handleClearAll} className="text-xs font-medium text-gray-500 transition hover:text-error-600">
                    전체 초기화
                  </button>
                )}
              </div>
            </div>
          </div>

          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              {!isSearching && (
                <CustomerFilter filters={filters} onFiltersChange={handleFiltersChange} />
              )}
              <SearchInput
                placeholder="고객 이름, 이메일, 전화번호 검색"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {isSearching && searchTerm && (
                <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  <span className="font-medium">"{searchTerm}"</span> 검색 결과: {totalElements.toLocaleString()}명
                </div>
              )}

              {sorts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                  <div className="py-1 text-xs font-medium text-gray-500">정렬:</div>
                  {sorts.map((sort, idx) => (
                    <div key={sort.field} className="flex items-center gap-2">
                      <button
                        onClick={() => setSorts(sorts.filter((_, i) => i !== idx))}
                        className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700 transition hover:bg-primary-200"
                      >
                        <span>
                          {sort.field === 'name' && '이름'}
                          {sort.field === 'phone' && '휴대폰 번호'}
                          {sort.field === 'email' && '이메일'}
                          {sort.field === 'period' && '이용기간'}
                          {sort.field === 'frequency' && '상담빈도'}
                          {sort.field === 'customerType' && '고객 분류'}
                          <span className="ml-1 font-bold">{sort.order === 'asc' ? '↑' : '↓'}</span>
                        </span>
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {idx < sorts.length - 1 && <div className="text-xs text-gray-400">→</div>}
                    </div>
                  ))}
                  <button onClick={handleClearSort} className="ml-2 text-xs font-medium text-gray-500 transition hover:text-gray-700">
                    초기화
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 테이블 */}
        <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-gray-600">고객 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="max-w-md text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="h-16 w-16 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-semibold text-error-600">데이터를 불러오는데 실패했습니다</p>
                <p className="mb-4 text-sm text-gray-600">잠시 후 다시 시도해주세요</p>
                {error instanceof Error && (
                  <details className="mt-4 rounded-lg bg-gray-100 p-4 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                      오류 상세 정보
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-gray-600">
                      {error.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="table-scroll overflow-y-auto scroll-smooth" style={{ height: '589px', minWidth: '800px' }}>
                  <CustomerTable
                    data={pageData}
                    startIndex={start}
                    sorts={sorts}
                    onSort={handleSort}
                    onCustomerClick={handleCustomerClick}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{start + 1}</span>
                    <span className="mx-1 text-gray-400">-</span>
                    <span className="font-semibold">{Math.min(start + pageSize, totalElements).toLocaleString()}</span>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="font-semibold text-primary-600">{totalElements.toLocaleString()}</span>
                    <span className="ml-1 text-gray-500">명</span>
                  </div>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(val) => {
                      setPageSize(parseInt(val, 10));
                      setPage(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5개/페이지</SelectItem>
                      <SelectItem value="10">10개/페이지</SelectItem>
                      <SelectItem value="15">15개/페이지</SelectItem>
                      <SelectItem value="20">20개/페이지</SelectItem>
                      <SelectItem value="50">50개/페이지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Pagination
                    currentPage={displayPage}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p - 1)} // 0-based로 변환
                    maxVisible={5}
                    showFirstLast
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CustomerDetailSlide
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onMemoClick={() => setIsMemoOpen(true)}
      />

      {selectedCustomer && (
        <MemoModal
          memberId={selectedCustomer.id}
          isOpen={isMemoOpen}
          onClose={() => setIsMemoOpen(false)}
        />
      )}

      <SelectionBasket />
    </DashboardLayout>
  );
};

export default CustomersPage;
