import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Badge,
} from '@/shared/ui';
import type { Customer } from '@/entities/customer/model/types';
import { useCreateChannel, useAddChannelMembers } from '@/entities/channel';
import { useSelectionBasket } from '@/entities/customer/model/selectionBasketStore';
import { ROUTES } from '@/shared/constants/routes';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

export const CreateChannelModal = ({ isOpen, onClose, customers = [] }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createChannel = useCreateChannel();
  const addMembers = useAddChannelMembers();
  const clearBasket = useSelectionBasket((s) => s.clearBasket);
  const navigate = useNavigate();

  const safeCustomers = customers || [];
  const isPending = createChannel.isPending || addMembers.isPending;

  const handleCreate = async () => {
    if (!name.trim() || safeCustomers.length === 0) return;

    try {
      const createdChannel = await createChannel.mutateAsync({
        name: name.trim(),
        description: description.trim(),
      });

      console.log('createdChannel = ', createdChannel);

      if (!createdChannel?.id) {
        throw new Error('채널 생성 응답에 id가 없습니다.');
      }

      await addMembers.mutateAsync({
        channelId: createdChannel.id,
        memberIds: safeCustomers.map((c) => c.id),
      });

      clearBasket();
      handleClose();
      navigate(ROUTES.CHANNELS);
    } catch (error) {
      console.error('채널 생성 플로우 실패', error);
      alert('채널 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>고객 채널 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">대상 고객</h3>
              <Badge variant="default">{safeCustomers.length.toLocaleString()}명</Badge>
            </div>
            <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-white p-3">
              {safeCustomers.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {safeCustomers.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs text-primary-700"
                    >
                      {c.name}
                      <button
                        type="button"
                        className="ml-1 text-primary-400 hover:text-primary-600"
                        onClick={() => useSelectionBasket.getState().removeCustomer(c.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">선택된 고객이 없습니다</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-name">채널 이름</Label>
            <Input
              id="channel-name"
              placeholder="예: VIP 고객 그룹, 이탈 우려 고객"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-desc">설명</Label>
            <textarea
              id="channel-desc"
              className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="이 채널에 대한 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || safeCustomers.length === 0 || isPending}
          >
            {isPending ? '생성 중...' : '채널 만들기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};