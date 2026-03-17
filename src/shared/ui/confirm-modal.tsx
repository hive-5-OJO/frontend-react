import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from '@/shared/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isPending?: boolean;
  variant?: 'default' | 'destructive';
  showCancel?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '확인',
  description = '',
  confirmLabel = '확인',
  isPending = false,
  variant = 'default',
  showCancel = true,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">{description}</p>
        <DialogFooter>
          {showCancel && (
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              취소
            </Button>
          )}
          <Button
            variant={variant}
            onClick={onConfirm ?? onClose}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
