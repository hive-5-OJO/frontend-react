import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Badge,
  Checkbox,
  SearchInput,
} from '@/shared/ui';
import { useCustomerList } from '@/entities/customer/model/useCustomerQueries';
import { useAddChannelMembers } from '@/entities/channel';
import { maskPhone, maskEmail } from '@/shared/utils';
import type { Customer, CustomerType } from '@/entities/customer/model/types';
import { CUSTOMER_TYPE_LABELS } from '@/entities/customer/model/types';

interface Props {
  channelId: number;
  existingMemberIds: number[];
  isOpen: boolean;
  onClose: () => void;
}

const mapApiResponse = (apiData: {
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
  const getCustomerType = (vip: string): CustomerType => {
    const vipLower = vip.toLowerCase();
    if (vipLower.includes('vip') && !vipLower.includes('잠재')) return 'vip';
    if (vipLower.includes('잠재')) return 'potential_vip';
    if (vipLower.includes('이탈 우려')) return 'churn_risk';
    if (vipLower.includes('이탈')) return 'churned';
    return 'normal';
  };
  return {
    id: apiData.memberId,
    name: apiData.name,
    phone: apiData.phone || '',
    email: apiData.email || '',
    joinedAt: apiData.servicePeriod?.split(' ~ ')[0] || '',
    customerType: getCustomerType(apiData.vip || ''),
  };
};

export const AddMemberModal = ({ channelId, existingMemberIds, isOpen, onClose }: Props) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const addMembers = useAddChannelMembers();

  const { data: listResponse, isLoading } = useCustomerList({ page: 0, size: 1000 });

  const existingSet = useMemo(() => new Set(existingMemberIds), [existingMemberIds]);

  const availableCustomers = useMemo(() => {
    const all = listResponse?.content?.map(mapApiResponse) || [];
    return all.filter((c) => !existingSet.has(c.id));
  }, [listResponse, existingSet]);

  const filtered = useMemo(() => {
    if (!search.trim()) return availableCustomers;
    const term = search.trim().toLowerCase();
    return availableCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term)),
    );
  }, [availableCustomers, search]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  const someSelected = filtered.some((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    if (selectedIds.size === 0) return;
    addMembers.mutate(
      { channelId, memberIds: Array.from(selectedIds) },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
          setSearch('');
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>고객 추가</DialogTitle>
        </DialogHeader>

        <div className="mb-3">
          <SearchInput
            placeholder="이름, 전화번호, 이메일로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-xs text-gray-500">
            추가 가능: {availableCustomers.length.toLocaleString()}명
            {search && ` · 검색 결과: ${filtered.length.toLocaleString()}명`}
          </span>
          {selectedIds.size > 0 && (
            <Badge variant="default">{selectedIds.size.toLocaleString()}명 선택</Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200" style={{ maxHeight: '400px' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-sm text-gray-500">고객 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-500">
                {search ? '검색 결과가 없습니다' : '추가 가능한 고객이 없습니다'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="w-12 px-3 py-3 text-center">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">이름</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">전화번호</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">이메일</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">분류</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer border-b border-gray-100 transition hover:bg-primary-50/30"
                    onClick={() => toggleSelect(customer.id)}
                  >
                    <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(customer.id)}
                        onCheckedChange={() => toggleSelect(customer.id)}
                      />
                    </td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-3 py-2.5 text-gray-600">{maskPhone(customer.phone ?? '')}</td>
                    <td className="px-3 py-2.5 text-gray-600">{maskEmail(customer.email ?? '')}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={(customer.customerType || 'normal') as 'vip' | 'potential_vip' | 'normal' | 'churn_risk' | 'churned'}>
                        {CUSTOMER_TYPE_LABELS[(customer.customerType || 'normal') as keyof typeof CUSTOMER_TYPE_LABELS]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={addMembers.isPending}>
            취소
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedIds.size === 0 || addMembers.isPending}
          >
            {addMembers.isPending
              ? '추가 중...'
              : `${selectedIds.size.toLocaleString()}명 추가`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
