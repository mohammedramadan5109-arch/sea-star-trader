import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--slate)] text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-600 text-white',
  };

  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-xs font-semibold rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}