import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const baseStyles = 'px-5 py-2.5 text-sm font-semibold rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[var(--orange)] text-[var(--paper)] hover:opacity-90 focus:ring-orange-500',
    secondary: 'bg-[var(--slate)] text-white hover:bg-[var(--navy)] focus:ring-slate-500',
    outline: 'border border-[var(--line)] bg-[var(--paper)] text-[var(--navy)] hover:bg-[var(--off-white)] focus:ring-orange-500',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}