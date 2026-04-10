import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-[0.98]',
  secondary:
    'bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-surface)] border border-[var(--color-border)]',
  ghost:
    'text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]',
  outline:
    'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-border-active)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-[var(--radius-sm)]',
  md: 'px-4 py-2 text-sm rounded-[var(--radius-default)]',
  lg: 'px-6 py-3 text-base rounded-[var(--radius-default)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
