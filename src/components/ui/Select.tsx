import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-sm border focus:outline-none focus:ring-2 focus:ring-orange-500',
            error ? 'border-red-500' : 'border-[var(--line)]',
            // Pinned to always-white/always-dark, matching Input.tsx, so
            // this field looks the same as every other field in the form
            // regardless of what --paper/--ink mean under the site's theme.
            'bg-white text-[var(--navy-solid)]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';