import { useState } from 'react';
import { CustomerTable } from '@/widgets/customer-table';
import { CustomerDetailSlide } from '@/widgets/customer-detail';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import {
  Pagination,
  Button,
  PageHeader,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import CustomerFilter from './components/CustomerFilter';
import mockCustomers from './components/mockCustomers';
import type { Customer } from '@/entities/customer/model/types';

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

const CustomersPage = () => {
  const [page, setPage] = useState(1);
  const pageSizeAuto = 12;
  const [pageSizeManual, setPageSizeManual] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sorts, setSorts] = useState<SortField[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const pageSize = pageSizeManual ?? pageSizeAuto;

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
          const updated = [...prev];
          updated[existingIndex] = { ...existing, order: 'desc' };
          return updated;
        }
        return prev.filter((s) => s.field !== field);
      }
      return [...prev, { field, order: 'asc' }];
    });
    setPage(1);
  };

  const handleClearSort = () => { setSorts([]); setPage(1); };
  const handleClearAll = () => { setFilters({}); setSearchTerm(''); setSorts([]); setPage(1); };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCustomer(null), 300);
  };

  const filteredData = mockCustomers.filter((customer) => {
    if (filters.isVip !== null && filters.isVip !== undefined) {
      if (customer.isVip !== filters.isVip) return false;
    }
    if (filters.service && customer.service !== filters.service) return false;
    if (filters.consultCategory && customer.consultCategory !== filters.consultCategory) return false;
    if (filters.consultFrequency && customer.consultFrequency !== filters.consultFrequency) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (
        !customer.name.toLowerCase().includes(term) &&
        !customer.phone.includes(term) &&
        !customer.email.toLowerCase().includes(term)
      ) return false;
    }
    return true;
  });

  const sortedData = (() => {
    if (sorts.length === 0) return filteredData;
    const getSortValue = (c: (typeof mockCustomers)[0], field: string): string | number => {
      switch (field) {
        case 'name': return c.name;
        case 'service': return c.service || '';
        case 'period': return c.period || c.joinedAt || '';
        case 'frequency': {
          const freqOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return freqOrder[c.consultFrequency as string] || 0;
        }
        case 'category': return c.consultCategory || '';
        case 'isVip': return c.isVip ? 1 : 0;
        default: return '';
      }
    };
    return [...filteredData].sort((a, b) => {
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

  const filteredTotal = sortedData.length;
  const filteredTotalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const filteredCurrentPage = Math.max(1, Math.min(page, filteredTotalPages));
  const start = (filteredCurrentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = sortedData.slice(start, end);

  const hasActiveFilters =
    Object.keys(filters).some((k) => filters[k as keyof Filters]) || searchTerm || sorts.length > 0;

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  leftIcon={
                    <svg
                      className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  }
                >
                  {isFilterOpen ? '필터 접기' : '필터 펼치기'}
                </Button>
              }
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h3 className="text-sm font-semibold text-gray-700">필터 & 검색</h3>
                {isFilterOpen && (
                  <div className="flex items-center gap-1.5 rounded-md bg-primary-50 px-2 py-1 text-xs text-primary-600">
                    <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">클릭 순서대로 다중 정렬 적용</span>
                    <span className="sm:hidden">다중 정렬</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600 md:text-2xl">{filteredTotal}</p>
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
              <CustomerFilter filters={filters} onFiltersChange={handleFiltersChange} />
              <SearchInput
                placeholder="고객 이름 검색"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onClear={() => handleSearchChange('')}
              />

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
                          {sort.field === 'service' && '서비스'}
                          {sort.field === 'period' && '이용기간'}
                          {sort.field === 'frequency' && '상담빈도'}
                          {sort.field === 'category' && '상담 카테고리'}
                          {sort.field === 'isVip' && 'VIP 여부'}
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
                <span className="font-semibold">{Math.min(end, filteredTotal)}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="font-semibold text-primary-600">{filteredTotal}</span>
                <span className="ml-1 text-gray-500">명</span>
              </div>
              <Select
                value={pageSizeManual?.toString() ?? 'auto'}
                onValueChange={(val) => {
                  setPageSizeManual(val === 'auto' ? null : parseInt(val, 10));
                  setPage(1);
                }}
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">자동</SelectItem>
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
                currentPage={filteredCurrentPage}
                totalPages={filteredTotalPages}
                onPageChange={(p) => setPage(Math.max(1, Math.min(p, filteredTotalPages)))}
                maxVisible={5}
                showFirstLast
              />
            </div>
          </div>
        </div>
      </div>

      <CustomerDetailSlide
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </DashboardLayout>
  );
};

export default CustomersPage;
