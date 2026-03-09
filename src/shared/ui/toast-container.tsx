import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface ToastContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ className, position = 'top-right', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-none fixed z-50 flex w-[400px] flex-col gap-2',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ToastContainer.displayName = 'ToastContainer';

export { ToastContainer };
