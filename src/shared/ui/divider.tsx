import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'gradient';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    { className, text, orientation = 'horizontal', variant = 'solid', ...props },
    ref
  ) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn('h-full w-px bg-gray-200', className)}
          {...props}
        />
      );
    }

    if (text) {
      return (
        <div
          ref={ref}
          className={cn('flex items-center', className)}
          {...props}
        >
          <div
            className={cn(
              'h-px flex-1',
              variant === 'gradient'
                ? 'bg-gradient-to-r from-transparent via-gray-300/60 to-gray-300'
                : 'bg-gray-200'
            )}
          />
          <span className="px-3 text-xs text-gray-400">{text}</span>
          <div
            className={cn(
              'h-px flex-1',
              variant === 'gradient'
                ? 'bg-gradient-to-r from-gray-300 via-gray-300/60 to-transparent'
                : 'bg-gray-200'
            )}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          variant === 'gradient' ? '' : 'h-px bg-gray-200',
          className
        )}
        {...props}
      >
        {variant === 'gradient' && (
          <>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/60 to-gray-300" />
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 via-gray-300/60 to-transparent" />
          </>
        )}
      </div>
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
