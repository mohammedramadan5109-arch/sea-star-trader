import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-[var(--navy-solid)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-sm border focus:outline-none focus:ring-2 focus:ring-orange-500',
            // bg-white is intentionally always a light input box; text is
            // pinned to navy-solid (always dark) rather than var(--ink),
            // which now resolves to a light color under the dark theme and
            // would render invisible white-on-white text otherwise.
            'bg-white border-[var(--line)] text-[var(--navy-solid)]',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';