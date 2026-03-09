import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, error, required, helperText, children, className, htmlFor },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-1.5', className)}>
        {label && (
          <label
            htmlFor={htmlFor}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-error-600">*</span>}
          </label>
        )}
        {children}
        {error && <p className="text-xs text-error-600">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
