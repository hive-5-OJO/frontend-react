import { useState, useEffect } from 'react';
import CustomerTable from './components/CustomerTable';
import mockCustomers from './components/mockCustomers';
import CustomerFilter from './components/CustomerFilter';
import CustomerSearch from './components/CustomerSearch';
import Pagination from './components/Pagination';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CustomerDetailSlide from './components/CustomerDetail/CustomerDetailSlide';

interface Filters {
  isVip?: boolean | null;
  service?: string | null;
  consultCategory?: string | null;
  consultFrequency?: string | null;
}

interface SortField {
  field: string;
  order: 'asc' | 'desc';
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinedAt: string;
  service?: string;
  period?: string;
  consultFrequency?: 'high' | 'medium' | 'low' | number | string;
  consultCategory?: string;
  isVip?: boolean;
}

const CustomersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSizeAuto, setPageSizeAuto] = useState<number>(12);
  const [pageSizeManual, setPageSizeManual] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sorts, setSorts] = useState<SortField[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const pageSize = pageSizeManual ?? pageSizeAuto;

  // 필터 변경 시 페이지 1로 리셋하는 최적화 콜백
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSort = (field: string) => {
    setSorts((prev) => {
      const existingIndex = prev.findIndex((s) => s.field === field);

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];

        if (existing.order === 'asc') {
          // asc → desc로 변경
          const updated = [...prev];
          updated[existingIndex] = { ...existing, order: 'desc' };
          return updated;
        }

        // desc → 제거
        return prev.filter((s) => s.field !== field);
      }

      // 새로운 정렬 추가 (다중 정렬)
      return [...prev, { field, order: 'asc' }];
    });

    setPage(1);
  };

  const handleClearSort = () => {
    setSorts([]);
    setPage(1);
  };

  const handleClearAll = () => {
    setFilters({});
    setSearchTerm('');
    setSorts([]);
    setPage(1);
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCustomer(null), 300); // 애니메이션 후 상태 초기화
  };

  // 필터링 로직
  const filteredData = mockCustomers.filter((customer) => {
    // VIP 필터
    if (filters.isVip !== null && filters.isVip !== undefined) {
      if (customer.isVip !== filters.isVip) return false;
    }
    // 서비스 필터
    if (filters.service) {
      if (customer.service !== filters.service) return false;
    }
    // 상담 카테고리 필터
    if (filters.consultCategory) {
      if (customer.consultCategory !== filters.consultCategory) return false;
    }
    // 상담 빈도 필터
    if (filters.consultFrequency) {
      if (customer.consultFrequency !== filters.consultFrequency) return false;
    }
    // 검색어 필터
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (
        !customer.name.toLowerCase().includes(term) &&
        !customer.phone.includes(term) &&
        !customer.email.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  // 다중 정렬 로직
  const sortedData = (() => {
    if (sorts.length === 0) return filteredData;

    const getSortValue = (
      customer: (typeof mockCustomers)[0],
      field: string,
    ): string | number => {
      switch (field) {
        case 'name':
          return customer.name;
        case 'service':
          return customer.service || '';
        case 'period':
          return customer.period || customer.joinedAt || '';
        case 'frequency': {
          const freqOrder: { [key: string]: number } = {
            high: 3,
            medium: 2,
            low: 1,
          };
          return freqOrder[customer.consultFrequency as string] || 0;
        }
        case 'category':
          return customer.consultCategory || '';
        case 'isVip':
          return customer.isVip ? 1 : 0;
        default:
          return '';
      }
    };

    const sorted = [...filteredData].sort((a, b) => {
      for (const sort of sorts) {
        const aVal = getSortValue(a, sort.field);
        const bVal = getSortValue(b, sort.field);

        let compareResult = 0;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          compareResult = aVal.localeCompare(bVal, 'ko-KR');
        } else {
          compareResult = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }

        if (compareResult !== 0) {
          return sort.order === 'asc' ? compareResult : -compareResult;
        }
      }

      return 0;
    });

    return sorted;
  })();

  const filteredTotal = sortedData.length;
  const filteredTotalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  // 현재 페이지 안전 계산 (필터링 및 정렬된 데이터 기준)
  const filteredCurrentPage = Math.max(1, Math.min(page, filteredTotalPages));

  // 현재 페이지에 맞는 데이터 슬라이스
  const start = (filteredCurrentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = sortedData.slice(start, end);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        {/* 필터 및 검색 섹션 */}
        <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* 헤더 - 항상 표시 */}
          <div className="p-6 pb-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">고객 목록</h1>
                <p className="mt-2 text-base text-gray-500">
                  고객 정보를 한눈에 관리하고 상담 현황을 추적하세요
                </p>
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <svg
                  className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {isFilterOpen ? '필터 접기' : '필터 펼치기'}
              </button>
            </div>

            {/* 필터 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  필터 & 검색
                </h3>
                {isFilterOpen && (
                  <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>클릭 순서대로 다중 정렬 적용</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">
                    {filteredTotal}
                  </p>
                  <p className="text-xs text-gray-500">명의 고객</p>
                </div>
                {(Object.keys(filters).some((k) => filters[k as keyof Filters]) ||
                  searchTerm ||
                  sorts.length > 0) && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-medium text-gray-500 transition hover:text-red-600"
                  >
                    전체 초기화
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 필터 내용 - 접을 수 있음 */}
          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              <CustomerFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
              <CustomerSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />

              {/* 정렬 상태 표시 */}
              {sorts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                  <div className="py-1 text-xs font-medium text-gray-500">
                    정렬:
                  </div>
                  {sorts.map((sort, idx) => (
                    <div key={sort.field} className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSorts(sorts.filter((_, i) => i !== idx));
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-200"
                      >
                        <span>
                          {sort.field === 'name' && '이름'}
                          {sort.field === 'service' && '서비스'}
                          {sort.field === 'period' && '이용기간'}
                          {sort.field === 'frequency' && '상담빈도'}
                          {sort.field === 'category' && '상담 카테고리'}
                          {sort.field === 'isVip' && 'VIP 여부'}
                          <span className="ml-1 font-bold">
                            {sort.order === 'asc' ? '↑' : '↓'}
                          </span>
                        </span>
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      {idx < sorts.length - 1 && (
                        <div className="text-xs text-gray-400">→</div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleClearSort}
                    className="ml-2 text-xs font-medium text-gray-500 transition hover:text-gray-700"
                  >
                    초기화
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 테이블 컨테이너 (12명 고정 높이) */}
        <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div 
            className="table-scroll overflow-y-auto scroll-smooth"
            style={{ height: '589px' }}
          >
            <CustomerTable
              data={pageData}
              startIndex={start}
              sorts={sorts}
              onSort={handleSort}
              onCustomerClick={handleCustomerClick}
            />
          </div>

          {/* 페이지네이션 (고정) */}
          <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-100 bg-white px-6 py-4 rounded-b-xl">
            <div className="flex items-center gap-4">
              {/* 표시 정보 */}
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{start + 1}</span>
                <span className="mx-1 text-gray-400">-</span>
                <span className="font-semibold">
                  {Math.min(end, filteredTotal)}
                </span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="font-semibold text-indigo-600">
                  {filteredTotal}
                </span>
                <span className="ml-1 text-gray-500">명</span>
              </div>

              {/* 페이지 사이즈 선택 */}
              <div className="relative">
                <select
                  value={pageSizeManual ?? ''}
                  onChange={(e) => {
                    setPageSizeManual(
                      e.target.value ? parseInt(e.target.value, 10) : null,
                    );
                    setPage(1);
                  }}
                  className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">자동</option>
                  <option value="5">5개/페이지</option>
                  <option value="10">10개/페이지</option>
                  <option value="15">15개/페이지</option>
                  <option value="20">20개/페이지</option>
                  <option value="50">50개/페이지</option>
                </select>
                <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Pagination
                currentPage={filteredCurrentPage}
                totalPages={filteredTotalPages}
                onChange={(p) =>
                  setPage(Math.max(1, Math.min(p, filteredTotalPages)))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 고객 상세 슬라이드 */}
      <CustomerDetailSlide
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </DashboardLayout>
  );
};

export default CustomersPage;
