import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowUpRight, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Experiment } from '@/types';

const STATUS_VARIANT = {
  stable: 'success',
  beta: 'warning',
  draft: 'outline',
  deprecated: 'error',
} as const;

const TIER_LABEL = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
} as const;

export default function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/experiments/${experiment.category}/${experiment.slug}`}
      className="group relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-border-active)] hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
    >
      {/* Preview placeholder with theme-aware gradient */}
      <div
        className="h-32 rounded-[var(--radius-default)] mb-4 flex items-center justify-center border border-[var(--color-border)] overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--color-surface-alt) 0%, var(--color-surface) 100%)',
        }}
      >
        <Package
          className="w-10 h-10 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors"
          aria-hidden
        />
      </div>

      {/* Meta badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge variant={STATUS_VARIANT[experiment.status]}>{experiment.status}</Badge>
        {experiment.pricingTier && (
          <Badge variant="info">{TIER_LABEL[experiment.pricingTier]}</Badge>
        )}
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-2 flex items-center gap-2">
          {experiment.title}
          <ArrowUpRight
            className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
            aria-hidden
          />
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
          {experiment.description}
        </p>
      </div>

      {/* Footer meta */}
      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border)]">
        <span>{experiment.bundleSizeKb} KB</span>
        <span aria-hidden>•</span>
        <span>{experiment.themeSupport.length} themes</span>
        <span aria-hidden>•</span>
        <span className="truncate">{experiment.category}</span>
      </div>
    </Link>
  );
}
