import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const toastVariants = cva(
  'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200',
        success: 'bg-success-50 border-success-200 text-success-900',
        error: 'bg-error-50 border-error-200 text-error-900',
        warning: 'bg-warning-50 border-warning-200 text-warning-900',
        info: 'bg-info-50 border-info-200 text-info-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, variant, title, description, onClose, icon, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="min-w-0 flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && (
            <div className="mt-1 text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/10"
            aria-label="닫기"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast, toastVariants };
