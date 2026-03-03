import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import logoImage from '@/assets/images/logo.png';

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
};

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ className, size = 'md', alt = 'logo', ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={logoImage}
        className={cn(sizeClasses[size], className)}
        alt={alt}
        {...props}
      />
    );
  }
);

Logo.displayName = 'Logo';

export { Logo };
