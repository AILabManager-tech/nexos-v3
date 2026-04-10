import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6',
        interactive &&
          'transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--color-border-active)] hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--color-text)]', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-[var(--color-text-muted)] mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[var(--color-border)]', className)}>
      {children}
    </div>
  );
}
