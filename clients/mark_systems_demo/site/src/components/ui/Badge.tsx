import type { HTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface BadgeBaseProps {
  variant?: BadgeVariant;
  className?: string;
  children?: ReactNode;
}

interface BadgeStaticProps extends BadgeBaseProps, Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'> {
  href?: undefined;
}

interface BadgeLinkProps extends BadgeBaseProps {
  href: string;
  ariaLabel?: string;
}

type BadgeProps = BadgeStaticProps | BadgeLinkProps;

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-alt)] text-[var(--color-text)] border-[var(--color-border)]',
  success: 'bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)] border-[color-mix(in_srgb,var(--color-success)_30%,transparent)]',
  warning: 'bg-[color-mix(in_srgb,var(--color-warning)_15%,transparent)] text-[var(--color-warning)] border-[color-mix(in_srgb,var(--color-warning)_30%,transparent)]',
  error: 'bg-[color-mix(in_srgb,var(--color-error)_15%,transparent)] text-[var(--color-error)] border-[color-mix(in_srgb,var(--color-error)_30%,transparent)]',
  info: 'bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)] border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)]',
  outline: 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)]',
};

const BASE_CLASSES =
  'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-[var(--radius-sm)] border';

const INTERACTIVE_CLASSES =
  'cursor-pointer hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] transition-all';

export function Badge(props: BadgeProps) {
  const { variant = 'default', className, children } = props;

  if ('href' in props && props.href) {
    return (
      <Link
        href={props.href}
        aria-label={props.ariaLabel}
        className={cn(BASE_CLASSES, INTERACTIVE_CLASSES, variantClasses[variant], className)}
      >
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props;
  return (
    <span
      className={cn(BASE_CLASSES, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </span>
  );
}
