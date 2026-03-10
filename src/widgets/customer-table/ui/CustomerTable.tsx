import { Badge } from '@/shared/ui';
import type { Customer } from '@/entities/customer/model/types';
import { maskPhone, maskEmail } from '@/shared/utils';

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

const SortIndicator = ({ field, sorts }: { field: string; sorts?: SortField[] }) => {
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

const CustomerTable = ({ data, startIndex = 0, sorts = [], onSort, onCustomerClick }: Props) => {
  const renderConsultBadge = (val?: Customer['consultFrequency']) => {
    let variant: 'high' | 'medium' | 'low' = 'low';
    if (typeof val === 'string') {
      const v = val.toLowerCase();
      if (v === 'high' || v === 'medium' || v === 'low') variant = v;
    } else if (typeof val === 'number') {
      variant = val >= 10 ? 'high' : val >= 5 ? 'medium' : 'low';
    }
    return <Badge variant={variant}>{variant.toUpperCase()}</Badge>;
  };

  const renderCustomerTypeBadge = (customer: Customer) => {
    const customerType = customer.customerType || 'normal';
    
    const labelMap: Record<string, string> = {
      vip: 'VIP',
      potential_vip: '잠재 VIP',
      normal: '일반',
      churn_risk: '이탈 우려',
      churned: '이탈',
    };

    return (
      <Badge variant={customerType as 'vip' | 'potential_vip' | 'normal' | 'churn_risk' | 'churned'}>
        {labelMap[customerType]}
      </Badge>
    );
  };

  const headerClass =
    'cursor-pointer px-4 py-4 text-center text-xs font-semibold text-gray-700 hover:bg-primary-100 select-none';

  return (
    <div className="relative h-full w-full">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col className="w-20" />
          <col /><col /><col /><col /><col /><col />
        </colgroup>
        <thead className="sticky top-0 z-10 border-b border-gray-200 bg-primary-50">
          <tr>
            <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">구분</th>
            {[
              { field: 'name', label: '이름' },
              { field: 'phone', label: '휴대폰 번호' },
              { field: 'email', label: '이메일' },
              { field: 'period', label: '이용기간' },
              { field: 'frequency', label: '상담빈도' },
              { field: 'customerType', label: '고객 분류' },
            ].map(({ field, label }) => (
              <th
                key={field}
                className={headerClass}
                onClick={() => onSort?.(field)}
              >
                <div className="flex items-center justify-center">
                  {label}
                  <SortIndicator field={field} sorts={sorts} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-700">검색 결과가 없습니다</p>
                    <p className="mt-1 text-sm text-gray-500">필터 조건을 변경하거나 검색어를 다시 확인해주세요</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((customer, idx) => (
              <tr
                key={customer.id}
                className="cursor-pointer border-b border-gray-100 transition hover:bg-primary-50/30"
                onClick={() => onCustomerClick?.(customer)}
              >
                <td className="px-4 py-3 text-center text-sm text-gray-500">{startIndex + idx + 1}</td>
                <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  <div className="truncate">{customer.name}</div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  <div className="truncate">{maskPhone(customer.phone ?? '')}</div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  <div className="truncate">{maskEmail(customer.email ?? '')}</div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">
                  <div className="truncate">{customer.period ?? customer.joinedAt ?? '-'}</div>
                </td>
                <td className="px-4 py-3 text-center">{renderConsultBadge(customer.consultFrequency)}</td>
                <td className="px-4 py-3 text-center">{renderCustomerTypeBadge(customer)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
