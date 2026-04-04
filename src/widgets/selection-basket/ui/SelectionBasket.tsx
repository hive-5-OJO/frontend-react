import { useState, useRef, useCallback } from 'react';
import { useSelectionBasket } from '@/entities/customer/model/selectionBasketStore';
import { useChannelList, useAddChannelMembers } from '@/entities/channel';
import { channelApi } from '@/entities/channel/api/channelApi';
import { useCustomerList } from '@/entities/customer/model/useCustomerQueries';
import { Button, Badge } from '@/shared/ui';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { BulkEmailModal } from '@/widgets/bulk-email-modal';
import { CreateChannelModal } from '@/widgets/create-channel-modal';
import { UsersRound, X, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import type { Customer, CustomerType } from '@/entities/customer/model/types';

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
  const getCustomerType = (vip: string): CustomerType => {
    const vipLower = vip.toLowerCase();
    if (vipLower.includes('vip') && !vipLower.includes('잠재')) return 'vip';
    if (vipLower.includes('잠재')) return 'potential_vip';
    if (vipLower.includes('이탈 우려')) return 'churn_risk';
    if (vipLower.includes('이탈')) return 'churned';
    return 'normal';
  };

  const getConsultFrequency = (freq: string) => {
    const freqUpper = freq.toUpperCase();
    if (freqUpper === 'HIGH') return 'high';
    if (freqUpper === 'MEDIUM') return 'medium';
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

export const SelectionBasket = () => {
  const {
    selectedCustomers,
    removeCustomer,
    clearBasket,
    getCount,
    activeChannelId,
    setActiveChannel,
    isPanelOpen,
    setIsPanelOpen,
    addMultiple,
  } = useSelectionBasket();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isLoadingChannel, setIsLoadingChannel] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({ isOpen: false, title: '', description: '' });

  // 드래그 관련 상태
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // 패널의 현재 위치 계산
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentX,
      origY: currentY,
    };

    const handleDragMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPanelPos({
        x: dragRef.current.origX + dx,
        y: dragRef.current.origY + dy,
      });
    };

    const handleDragEnd = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }, []);

  const { data: channels } = useChannelList();
  const addMembers = useAddChannelMembers();
  const navigate = useNavigate();

  // 전체 고객 목록 (채널 클릭 시 멤버 매칭용)
  const { data: listResponse } = useCustomerList({ page: 0, size: 1000 });
  const allCustomers = listResponse?.content?.map(mapApiResponseToCustomer) || [];

  const count = getCount();

  if (count === 0 && !isPanelOpen && !confirmModal.isOpen) {
    return null;
  }

  const handleChannelClick = async (channelId: number) => {
    // 채널 클릭 시: 해당 채널의 멤버를 불러와서 바구니에 세팅 (페이지 이동 없음)
    setIsLoadingChannel(true);
    try {
      const members = await channelApi.getMembers(channelId);
      const memberIdSet = new Set(members.map((m) => m.memberId));
      const channelMembers = allCustomers.filter((c) => memberIdSet.has(c.id));
      // 바구니 교체
      clearBasket();
      addMultiple(channelMembers);
      setActiveChannel(channelId);
      setIsPanelOpen(true);
    } finally {
      setIsLoadingChannel(false);
    }
  };

  const handleAddToActiveChannel = async () => {
    if (!activeChannelId) return;

    // 현재 채널의 기존 멤버 조회
    try {
      const existingMembers = await channelApi.getMembers(activeChannelId);
      const existingIds = new Set(existingMembers.map((m) => m.memberId));
      const newMemberIds = selectedCustomers
        .map((c) => c.id)
        .filter((id) => !existingIds.has(id));

      if (newMemberIds.length === 0) {
        setConfirmModal({
          isOpen: true,
          title: '알림',
          description: '추가할 새로운 고객이 없습니다. 이미 모두 채널에 포함되어 있습니다.',
        });
        return;
      }

      addMembers.mutate(
        { channelId: activeChannelId, memberIds: newMemberIds },
        {
          onSuccess: () => {
            setConfirmModal({
              isOpen: true,
              title: '고객 추가 완료',
              description: `${newMemberIds.length}명의 고객이 채널에 추가되었습니다.`,
            });
          },
        },
      );
    } catch {
      setConfirmModal({
        isOpen: true,
        title: '오류',
        description: '고객 추가 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 바구니 버튼 */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl"
      >
        <UsersRound />
        {count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs font-bold"
          >
            {count}
          </Badge>
        )}
      </button>

      {/* 바구니 패널 */}
      {isPanelOpen && (
        <div
          ref={panelRef}
          className="flex rounded-lg border border-gray-200 bg-white shadow-2xl"
          style={
            panelPos
              ? { position: 'fixed', left: panelPos.x, top: panelPos.y, zIndex: 50 }
              : { position: 'absolute', bottom: '4rem', right: 0 }
          }
        >
          {/* 왼쪽: 채널 목록 */}
          {channels && channels.length > 0 && (
            <div className="w-52 border-r border-gray-200">
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="text-sm font-semibold text-gray-700">채널 목록</p>
              </div>
              <div className="max-h-[28rem] overflow-y-auto p-2">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => handleChannelClick(ch.id)}
                    disabled={isLoadingChannel}
                    className={`flex w-full items-center mb-1 gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-primary-50 ${
                      activeChannelId === ch.id
                        ? 'bg-primary-50 ring-1 ring-primary-300'
                        : ''
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5 flex-shrink-0 text-primary-500" />
                    <div className="flex-1 truncate">
                      <span className="font-medium text-gray-800">{ch.name}</span>
                      <p className="text-xs text-gray-400">
                        {ch.memberCount.toLocaleString()}명
                      </p>
                    </div>
                    {activeChannelId === ch.id && (
                      <Badge variant="default" className="text-[10px]">현재</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 오른쪽: 고객 목록 + 액션 */}
          <div className="w-[28rem]">
            {/* 헤더 (드래그 핸들) */}
            <div
              className="flex cursor-grab items-center justify-between border-b border-gray-200 p-4 select-none active:cursor-grabbing"
              onMouseDown={handleDragStart}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">선택 고객들</h3>
                <Badge variant="secondary">{count}명</Badge>
              </div>
              <button
                onClick={() => {
                  setIsPanelOpen(false);
                  setPanelPos(null);
                }}
                className="text-gray-400 transition hover:text-gray-600"
              >
                <X />
              </button>
            </div>

            {/* 고객 목록 */}
            <div className="max-h-72 overflow-y-auto">
              {selectedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between border-b border-gray-100 p-3 transition hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">
                      {customer.email || customer.phone || `ID: ${customer.id}`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCustomer(customer.id)}
                    className="ml-2 text-gray-400 transition hover:text-error-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* 액션 버튼 */}
            <div className="space-y-2 border-t border-gray-200 p-4">
              {activeChannelId && count > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={handleAddToActiveChannel}
                  disabled={addMembers.isPending}
                >
                  {addMembers.isPending ? '추가 중...' : '채널에 고객 추가'}
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  단체 메일 작성
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setActiveChannel(null);
                    setIsChannelModalOpen(true);
                  }}
                >
                  채널 만들기
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-gray-400 hover:text-error-600"
                onClick={clearBasket}
              >
                선택된 고객 해제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 단체 메일 모달 */}
      <BulkEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        customers={selectedCustomers}
      />

      {/* 채널 만들기 모달 */}
      <CreateChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        customers={selectedCustomers}
      />

      {/* 결과 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => {
          const wasSuccess = confirmModal.title === '고객 추가 완료';
          const channelId = activeChannelId;
          setConfirmModal({ ...confirmModal, isOpen: false });
          if (wasSuccess) {
            clearBasket();
            setIsPanelOpen(false);
            setPanelPos(null);
            if (channelId) {
              navigate(`${ROUTES.CHANNELS}/${channelId}`);
            }
          }
        }}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel="확인"
        showCancel={false}
      />
    </div>
  );
};
