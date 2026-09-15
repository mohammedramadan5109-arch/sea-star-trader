// src/components/ui/Button.tsx

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg'; // ✅ ADDED: size prop
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', // ✅ ADDED: default size
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'text-sm font-semibold rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[var(--orange)] text-[var(--paper)] hover:opacity-90 focus:ring-orange-500',
    secondary: 'bg-[var(--slate)] text-white hover:bg-[var(--navy)] focus:ring-slate-500',
    outline: 'border border-[var(--line)] bg-[var(--paper)] text-[var(--navy)] hover:bg-[var(--off-white)] focus:ring-orange-500',
  };

  // ✅ ADDED: size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}