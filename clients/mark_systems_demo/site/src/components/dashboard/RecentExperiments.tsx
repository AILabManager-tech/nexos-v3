import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { experiments } from '@/lib/data/experiments';
import { Badge } from '@/components/ui/Badge';

const STATUS_VARIANT = {
  stable: 'success',
  beta: 'warning',
  draft: 'outline',
  deprecated: 'error',
} as const;

export default function RecentExperiments() {
  const t = useTranslations('dashboard.recent');
  const locale = useLocale();
  const recent = experiments.slice(0, 4);

  return (
    <section aria-labelledby="recent-heading">
      <h2
        id="recent-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4"
      >
        {t('title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recent.map((exp, index) => {
          const featured = index === 0;
          return (
            <Link
              key={exp.slug}
              href={`/${locale}/experiments/${exp.category}/${exp.slug}`}
              className={`group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-border-active)] hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                featured ? 'md:col-span-2 md:row-span-1' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={STATUS_VARIANT[exp.status]}>{exp.status}</Badge>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {exp.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {exp.title}
                  </h3>
                </div>
                <ArrowUpRight
                  className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  aria-hidden
                />
              </div>
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
                {exp.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <span>{exp.bundleSizeKb} KB</span>
                <span aria-hidden>•</span>
                <span>{exp.themeSupport.length} themes</span>
                <span aria-hidden>•</span>
                <span>{exp.updatedAt}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
