import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const Icon = React.forwardRef<HTMLImageElement, IconProps>(
  ({ className, size = 'md', alt = '', ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn(sizeClasses[size], className)}
        alt={alt}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };
