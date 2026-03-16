import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from '@/shared/ui';
import { useCustomerMemo, useCreateMemo, useDeleteMemo } from '@/entities/customer/model/useCustomerQueries';

interface Props {
  memberId: number;
  isOpen: boolean;
  onClose: () => void;
}

const MemoModal = ({ memberId, isOpen, onClose }: Props) => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: memo, isLoading } = useCustomerMemo(memberId, isOpen);
  const createMemo = useCreateMemo();
  const deleteMemo = useDeleteMemo();

  useEffect(() => {
    if (memo) {
      setContent(memo.content);
      setIsEditing(false);
    } else {
      setContent('');
      setIsEditing(true);
    }
  }, [memo]);

  const handleSave = () => {
    if (!content.trim()) return;
    createMemo.mutate(
      { memberId, content: content.trim() },
      { onSuccess: () => onClose() },
    );
  };

  const handleDelete = () => {
    if (!confirm('메모를 삭제하시겠습니까?')) return;
    deleteMemo.mutate(memberId, {
      onSuccess: () => onClose(),
    });
  };

  const handleClose = () => {
    if (memo) {
      setContent(memo.content);
      setIsEditing(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>고객 메모</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-sm text-gray-600">메모를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="메모를 입력하세요..."
                  className="min-h-[180px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  autoFocus
                />
              ) : (
                <div className="min-h-[120px] rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{memo?.content}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              {isEditing ? (
                <>
                  {memo && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setContent(memo.content);
                        setIsEditing(false);
                      }}
                    >
                      취소
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!content.trim() || createMemo.isPending}
                  >
                    {createMemo.isPending ? '저장 중...' : '저장'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    disabled={deleteMemo.isPending}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {deleteMemo.isPending ? '삭제 중...' : '삭제'}
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    수정
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemoModal;
