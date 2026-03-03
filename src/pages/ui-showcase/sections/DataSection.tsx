import { useState } from 'react';
import { Pagination } from '@/shared/ui/pagination';
import { SearchInput } from '@/shared/ui/search-input';
import { Badge } from '@/shared/ui/badge';
import { StatusBadge } from '@/shared/ui/status-badge';
import { Avatar } from '@/shared/ui/avatar';
import ShowcaseBlock from './ShowcaseBlock';

const MOCK_CUSTOMERS = [
  { id: 1, name: '김민수', email: 'minsu@example.com', service: 'Pro', frequency: 'high' as const, isVip: true },
  { id: 2, name: '이하늘', email: 'haneul@example.com', service: 'Basic', frequency: 'low' as const, isVip: false },
  { id: 3, name: '박서준', email: 'seojun@example.com', service: 'Enterprise', frequency: 'medium' as const, isVip: true },
  { id: 4, name: '최영희', email: 'younghee@example.com', service: 'Basic', frequency: 'low' as const, isVip: false },
  { id: 5, name: '한지민', email: 'jimin@example.com', service: 'Pro', frequency: 'high' as const, isVip: false },
];

const DataSection = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.includes(search) ||
      c.email.includes(search) ||
      c.service.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Data Display</h2>

      <ShowcaseBlock
        title="Pagination"
        description="currentPage / totalPages / onPageChange — showFirstLast, maxVisible 옵션"
        code={`<Pagination\n  currentPage={page}\n  totalPages={20}\n  onPageChange={setPage}\n  showFirstLast\n  maxVisible={5}\n/>`}
        vertical
      >
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">현재 페이지: <span className="font-bold text-primary-600">{page}</span></p>
            <Pagination currentPage={page} totalPages={20} onPageChange={setPage} showFirstLast maxVisible={5} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">maxVisible=3, showFirstLast=false</p>
            <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} showFirstLast={false} maxVisible={3} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">1페이지 (이전 버튼 비활성화)</p>
            <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">마지막 페이지 (다음 버튼 비활성화)</p>
            <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="SearchInput + 실시간 필터링"
        description="입력 시 테이블 데이터 실시간 필터링"
        code={`<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} />`}
        vertical
      >
        <div className="w-full space-y-4">
          <SearchInput
            placeholder="이름, 이메일, 서비스 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">고객</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">서비스</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">상담빈도</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">VIP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">검색 결과 없음</td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm" fallback={c.name[0]} />
                          <div>
                            <p className="font-medium text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="primary">{c.service}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge variant={c.frequency}>{c.frequency.toUpperCase()}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.isVip ? <Badge variant="vip">VIP</Badge> : <span className="text-gray-300">-</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">{filtered.length}명 표시 중 (전체 {MOCK_CUSTOMERS.length}명)</p>
        </div>
      </ShowcaseBlock>
    </div>
  );
};

export default DataSection;
