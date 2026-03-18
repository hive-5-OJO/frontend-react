import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { CustomerDetailSlide } from '@/widgets/customer-detail';
import { MemoModal } from '@/widgets/customer-detail';
import { Button, Badge, PageHeader, Checkbox, DeleteConfirmModal, ConfirmModal } from '@/shared/ui';
import {
  useChannelList,
  useChannelMembers,
  useDeleteChannel,
  useRemoveChannelMember,
} from '@/entities/channel';
import { maskPhone, maskEmail } from '@/shared/utils';
import { ROUTES } from '@/shared/constants/routes';
import type { Customer, CustomerType } from '@/entities/customer/model/types';
import { CUSTOMER_TYPE_LABELS } from '@/entities/customer/model/types';
import { ArrowLeft, Trash2, Users, UserPlus } from 'lucide-react';
import { useSelectionBasket } from '@/entities/customer/model/selectionBasketStore';
import type { ChannelMember } from '@/entities/channel/model/types';

const mapChannelMemberToCustomer = (member: ChannelMember): Customer => {
  const getCustomerType = (vip?: string | null): CustomerType => {
    const vipLower = (vip || '').toLowerCase();
    if (vipLower.includes('vip') && !vipLower.includes('잠재')) return 'vip';
    if (vipLower.includes('잠재')) return 'potential_vip';
    if (vipLower.includes('이탈 우려')) return 'churn_risk';
    if (vipLower.includes('이탈')) return 'churned';
    return 'normal';
  };

  const getConsultFrequency = (freq?: string | null) => {
    const freqUpper = (freq || '').toUpperCase();
    if (freqUpper === 'HIGH') return 'high';
    if (freqUpper === 'MEDIUM') return 'medium';
    if (freqUpper === 'LOW') return 'low';
    return 'low';
  };

  return {
    id: member.memberId,
    name: member.name,
    phone: member.phone || '',
    email: member.email || '',
    joinedAt: member.servicePeriod?.split(' ~ ')[0] || '',
    service: member.service || undefined,
    period: member.servicePeriod || '',
    consultCategory: member.consultCategory || undefined,
    consultFrequency: getConsultFrequency(member.consultFrequency),
    customerType: getCustomerType(member.vip),
  };
};

const ChannelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const channelId = Number(id);

  const { data: channels, isLoading: isLoadingChannels } = useChannelList();
  const { data: members, isLoading: isLoadingMembers } = useChannelMembers(channelId, !!channelId);
  const deleteChannel = useDeleteChannel();
  const removeMember = useRemoveChannelMember();
  const channel = channels?.find((c) => c.id === channelId);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
  const [isDeleteMembersOpen, setIsDeleteMembersOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onClose?: () => void;
  }>({ isOpen: false, title: '', description: '' });

  const { addMultiple, setActiveChannel, clearBasket, setIsPanelOpen } = useSelectionBasket();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const isLoading = isLoadingChannels || isLoadingMembers;

  if (!isLoadingChannels && !channel && !confirmModal.isOpen) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="mb-4 text-lg font-semibold text-gray-600">채널을 찾을 수 없습니다</p>
          <Button onClick={() => navigate(ROUTES.CHANNELS)}>채널 목록으로</Button>
        </div>
      </DashboardLayout>
    );
  }

  const channelMembers = (members || []).map(mapChannelMemberToCustomer);

  const allSelected = channelMembers.length > 0 && channelMembers.every((c) => selectedIds.has(c.id));
  const someSelected = channelMembers.some((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(channelMembers.map((c) => c.id)));
    }
  };

  const toggleSelect = (customerId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(customerId)) next.delete(customerId);
      else next.add(customerId);
      return next;
    });
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCustomer(null), 300);
  };

  const handleDeleteChannel = () => {
    const channelName = channel?.name || '';
    deleteChannel.mutate(channelId, {
      onSuccess: () => {
        setIsDeleteChannelOpen(false);
        setConfirmModal({
          isOpen: true,
          title: '삭제 완료',
          description: `"${channelName}" 채널이 삭제되었습니다.`,
          onClose: () => navigate(ROUTES.CHANNELS),
        });
      },
    });
  };

  const handleDeleteMembers = async () => {
    const ids = Array.from(selectedIds);
    try {
      for (const memberId of ids) {
        await removeMember.mutateAsync({ channelId, memberId });
      }
      const deletedCount = ids.length;
      setSelectedIds(new Set());
      setIsDeleteMembersOpen(false);
      setConfirmModal({
        isOpen: true,
        title: '삭제 완료',
        description: `${deletedCount}명의 고객이 채널에서 삭제되었습니다.`,
      });
    } catch {
      setIsDeleteMembersOpen(false);
    }
  };

  const renderConsultBadge = (val?: Customer['consultFrequency']) => {
    let variant: 'high' | 'medium' | 'low' = 'low';
    if (typeof val === 'string') {
      const v = val.toLowerCase();
      if (v === 'high' || v === 'medium' || v === 'low') variant = v;
    }
    return <Badge variant={variant}>{variant.toUpperCase()}</Badge>;
  };

  const handleAddMembers = () => {
    clearBasket();
    addMultiple(channelMembers);
    setActiveChannel(channelId);
    setIsPanelOpen(true);
    navigate(ROUTES.CUSTOMERS);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <button
              onClick={() => navigate(ROUTES.CHANNELS)}
              className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              채널 목록
            </button>
          </div>
          <PageHeader
            title={channel?.name || ''}
            description={channel?.description || '설명 없음'}
            actions={
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {(channel?.memberCount ?? 0).toLocaleString()}명
                </Badge>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddMembers}
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  고객 추가
                </Button>
                {selectedIds.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDeleteMembersOpen(true)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    선택 고객 삭제 ({selectedIds.size}명)
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteChannelOpen(true)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  채널 삭제
                </Button>
              </div>
            }
          />
        </div>

        <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-gray-600">고객 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : channelMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Users className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">채널에 해당하는 고객이 없습니다</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="table-scroll overflow-y-auto scroll-smooth" style={{ minWidth: '800px' }}>
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col className="w-16" />
                    <col className="w-20" />
                    <col /><col /><col /><col /><col /><col />
                  </colgroup>
                  <thead className="sticky top-0 z-10 border-b border-gray-200 bg-primary-50">
                    <tr>
                      <th className="px-4 py-4 text-center">
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected && !allSelected}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">구분</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">이름</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">휴대폰 번호</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">이메일</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">상담빈도</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">이용기간</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700">고객 분류</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelMembers.map((customer, idx) => (
                      <tr
                        key={customer.id}
                        className="cursor-pointer border-b border-gray-100 transition hover:bg-primary-50/30"
                        onClick={() => handleCustomerClick(customer)}
                      >
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.has(customer.id)}
                            onCheckedChange={() => toggleSelect(customer.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                          <div className="truncate">{customer.name}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                          <div className="truncate">{maskPhone(customer.phone ?? '')}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                          <div className="truncate">{maskEmail(customer.email ?? '')}</div>
                        </td>
                        <td className="px-4 py-3 text-center">{renderConsultBadge(customer.consultFrequency)}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                          <div className="truncate">{customer.period ?? customer.joinedAt ?? '-'}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={(customer.customerType || 'normal') as 'vip' | 'potential_vip' | 'normal' | 'churn_risk' | 'churned'}>
                            {CUSTOMER_TYPE_LABELS[(customer.customerType || 'normal') as keyof typeof CUSTOMER_TYPE_LABELS]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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

      <DeleteConfirmModal
        isOpen={isDeleteChannelOpen}
        onClose={() => setIsDeleteChannelOpen(false)}
        onConfirm={handleDeleteChannel}
        title="채널 삭제"
        description={`"${channel?.name}" 채널을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        isPending={deleteChannel.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteMembersOpen}
        onClose={() => setIsDeleteMembersOpen(false)}
        onConfirm={handleDeleteMembers}
        title="고객 삭제"
        description={`선택한 ${selectedIds.size}명의 고객을 이 채널에서 삭제하시겠습니까?`}
        confirmLabel={`${selectedIds.size}명 삭제`}
        isPending={removeMember.isPending}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => {
          const callback = confirmModal.onClose;
          setConfirmModal({ isOpen: false, title: '', description: '' });
          callback?.();
        }}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel="확인"
        showCancel={false}
      />
    </DashboardLayout>
  );
};

export default ChannelDetailPage;