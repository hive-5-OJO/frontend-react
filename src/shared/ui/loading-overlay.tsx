import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Spinner } from './spinner';

export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    { className, isLoading, message, fullScreen = false, children, ...props },
    ref
  ) => {
    if (!isLoading) return <>{children}</>;

    return (
      <div
        ref={ref}
        className={cn('relative', fullScreen && 'h-screen w-screen', className)}
        {...props}
      >
        {children}
        <div
          className={cn(
            'absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm',
            fullScreen && 'fixed'
          )}
        >
          <Spinner size="lg" />
          {message && (
            <p className="text-sm font-medium text-gray-700">{message}</p>
          )}
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

export { LoadingOverlay };
