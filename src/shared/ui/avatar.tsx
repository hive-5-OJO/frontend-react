import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = 'md', src, alt = '', fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false);

    if (error || !src) {
      return (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-primary-100 text-primary-600',
            sizeClasses[size],
            className
          )}
        >
          {fallback ? (
            <span className="text-sm font-medium">{fallback}</span>
          ) : (
            <svg
              className="h-1/2 w-1/2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
        alt={alt}
        onError={() => setError(true)}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
