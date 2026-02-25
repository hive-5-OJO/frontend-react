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

interface SortField {
  field: string;
  order: 'asc' | 'desc';
}

interface Props {
  data: Customer[];
  startIndex?: number;
  sorts?: SortField[];
  onSort?: (field: string) => void;
  onCustomerClick?: (customer: Customer) => void;
}

const consultStyle = {
  high: 'bg-error-100 text-error-600',
  medium: 'bg-warning-100 text-warning-600',
  low: 'bg-info-100 text-info-600',
};

const vipStyle = 'bg-vip-100 text-vip-600';

const SortIndicator = ({
  field,
  sorts,
}: {
  field: string;
  sorts?: SortField[];
}) => {
  const sort = sorts?.find((s) => s.field === field);
  if (!sort) return null;

  const index = sorts!.findIndex((s) => s.field === field);

  return (
    <span className="ml-1 inline-flex items-center gap-1">
      <span className="text-sm font-bold text-primary-600">
        {sort.order === 'asc' ? '↑' : '↓'}
      </span>
      {sorts!.length > 1 && (
        <span className="rounded bg-primary-600 px-1 py-0.5 text-[10px] font-bold text-white">
          {index + 1}
        </span>
      )}
    </span>
  );
};

const CustomerTable = ({
  data,
  startIndex = 0,
  sorts = [],
  onSort,
  onCustomerClick,
}: Props) => {
  const rows = data;
  const baseIndex = startIndex ?? 0;

  const renderConsultBadge = (val?: Customer['consultFrequency']) => {
    let key: 'high' | 'medium' | 'low' = 'low';

    if (typeof val === 'string') {
      const v = val.toLowerCase();
      if (v === 'high' || v === 'medium' || v === 'low') key = v;
    } else if (typeof val === 'number') {
      key = val >= 10 ? 'high' : val >= 5 ? 'medium' : 'low';
    }

    return (
      <span className={`rounded-full px-2 py-1 text-xs ${consultStyle[key]}`}>
        {key.toUpperCase()}
      </span>
    );
  };

  const headerClass =
    'cursor-pointer px-4 py-4 text-center text-xs font-semibold text-gray-700 hover:bg-primary-100 select-none';

  return (
    <div className="relative h-full w-full">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col className="w-20" />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-primary-50">
          <tr>
            <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">
              구분
            </th>
            <th
              className={headerClass}
              onClick={() => onSort?.('name')}
              title={
                sorts?.find((s) => s.field === 'name')
                  ? '클릭: 정렬 순서 변경 (오름차순 → 내림차순 → 제거)'
                  : '클릭: 정렬 추가'
              }
            >
              <div className="flex items-center justify-center">
                이름
                <SortIndicator field="name" sorts={sorts} />
              </div>
            </th>
            <th
              className={headerClass}
              onClick={() => onSort?.('service')}
              title={
                sorts?.find((s) => s.field === 'service')
                  ? '클릭: 정렬 순서 변경 (오름차순 → 내림차순 → 제거)'
                  : '클릭: 정렬 추가'
              }
            >
              <div className="flex items-center justify-center">
                서비스
                <SortIndicator field="service" sorts={sorts} />
              </div>
            </th>
            <th
              className={headerClass}
              onClick={() => onSort?.('period')}
              title={
                sorts?.find((s) => s.field === 'period')
                  ? '클릭: 정렬 순서 변경 (오름차순 → 내림차순 → 제거)'
                  : '클릭: 정렬 추가'
              }
            >
              <div className="flex items-center justify-center">
                이용기간
                <SortIndicator field="period" sorts={sorts} />
              </div>
            </th>
            <th
              className={headerClass}
              onClick={() => onSort?.('frequency')}
              title={
                sorts?.find((s) => s.field === 'frequency')
                  ? '클릭: 정렬 순서 변경 (오름차순 → 내림차순 → 제거)'
                  : '클릭: 정렬 추가'
              }
            >
              <div className="flex items-center justify-center">
                상담빈도
                <SortIndicator field="frequency" sorts={sorts} />
              </div>
            </th>
            <th
              className={headerClass}
              onClick={() => onSort?.('category')}
              title={
                sorts?.find((s) => s.field === 'category')
                  ? '클릭: 정렬 순서 변경 (오름차순 → 내림차순 → 제거)'
                  : '클릭: 정렬 추가'
              }
            >
              <div className="flex items-center justify-center">
                상담 카테고리
                <SortIndicator field="category" sorts={sorts} />
              </div>
            </th>
            <th
              className={headerClass}
              onClick={() => onSort?.('isVip')}
              title={
                sorts?.find((s) => s.field === 'isVip')
                  ? '클릭: 정렬 순서 변경 (오름차순 → 내림차순 → 제거)'
                  : '클릭: 정렬 추가'
              }
            >
              <div className="flex items-center justify-center">
                VIP 여부
                <SortIndicator field="isVip" sorts={sorts} />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <svg
                    className="h-16 w-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      검색 결과가 없습니다
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      필터 조건을 변경하거나 검색어를 다시 확인해주세요
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((customer, idx) => (
              <tr
                key={customer.id}
                className="cursor-pointer border-b border-gray-100 transition hover:bg-primary-50/30"
                onClick={() => onCustomerClick?.(customer)}
              >
                <td className="px-4 py-3 text-center text-sm text-gray-500">
                  {baseIndex + idx + 1}
                </td>
                <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {customer.service ?? '-'}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {customer.period ?? customer.joinedAt ?? '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  {renderConsultBadge(customer.consultFrequency)}
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  {customer.consultCategory ?? '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  {customer.isVip ? (
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${vipStyle}`}
                    >
                      VIP
                    </span>
                  ) : (
                    <span className="text-sm text-gray-300">-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
