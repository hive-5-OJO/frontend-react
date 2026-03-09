import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Card } from './card';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    comparison?: string;
  };
  icon?: React.ReactNode;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ label, value, unit, trend, icon, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn('flex flex-col justify-center gap-1 p-6', className)}
        {...props}
      >
        <p className="text-md font-semibold text-gray-500">{label}</p>
        <p className="my-1 text-2xl font-bold">
          {value} {unit && <span>{unit}</span>}
        </p>
        {trend && (
          <div
            className={cn(
              'mt-1 flex items-center text-xs',
              trend.isPositive ? 'text-green-500' : 'text-warning-500'
            )}
          >
            {icon}
            <p className="flex gap-3 text-base font-bold">
              {trend.value}%{' '}
              {trend.comparison && (
                <span className="font-medium text-gray-400">
                  {trend.comparison}
                </span>
              )}
            </p>
          </div>
        )}
      </Card>
    );
  }
);

MetricCard.displayName = 'MetricCard';

export { MetricCard };
