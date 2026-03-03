import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface TrendIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  isPositive: boolean;
  comparison?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const TrendIndicator = React.forwardRef<HTMLDivElement, TrendIndicatorProps>(
  (
    {
      value,
      isPositive,
      comparison,
      icon,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2',
          isPositive ? 'text-success-600' : 'text-warning-600',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon}
        <span className="font-bold">{value}%</span>
        {comparison && (
          <span className="font-medium text-gray-500">{comparison}</span>
        )}
      </div>
    );
  }
);

TrendIndicator.displayName = 'TrendIndicator';

export { TrendIndicator };
