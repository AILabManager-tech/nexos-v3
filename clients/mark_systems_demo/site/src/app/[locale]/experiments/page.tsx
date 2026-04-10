import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { X } from 'lucide-react';
import Link from 'next/link';
import { experiments } from '@/lib/data/experiments';
import ExperimentCard from '@/components/experiments/ExperimentCard';
import { Badge } from '@/components/ui/Badge';
import type { Experiment } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experiments.seo' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
  };
}

type SearchParams = {
  status?: string;
  tier?: string;
  category?: string;
  tag?: string;
  theme?: string;
};

function filterExperiments(all: Experiment[], params: SearchParams): Experiment[] {
  return all.filter((exp) => {
    if (params.status && exp.status !== params.status) return false;
    if (params.tier && exp.pricingTier !== params.tier) return false;
    if (params.category && exp.category !== params.category) return false;
    if (params.tag && !exp.tags.includes(params.tag)) return false;
    if (
      params.theme &&
      !exp.themeSupport.includes(
        params.theme as Experiment['themeSupport'][number]
      )
    )
      return false;
    return true;
  });
}

export default async function ExperimentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const filters = await searchParams;
  const t = await getTranslations({ locale, namespace: 'experiments' });
  const tc = await getTranslations({ locale, namespace: 'experiments.categories' });

  const filtered = filterExperiments(experiments, filters);
  const hasFilters = !!(
    filters.status ||
    filters.tier ||
    filters.category ||
    filters.tag ||
    filters.theme
  );

  const activeFilters: Array<{ label: string; value: string }> = [];
  if (filters.status) activeFilters.push({ label: 'status', value: filters.status });
  if (filters.tier) activeFilters.push({ label: 'tier', value: filters.tier });
  if (filters.category) {
    activeFilters.push({
      label: 'category',
      value: tc.has(filters.category) ? tc(filters.category) : filters.category,
    });
  }
  if (filters.tag) activeFilters.push({ label: 'tag', value: filters.tag });
  if (filters.theme) activeFilters.push({ label: 'theme', value: filters.theme });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-3">
          {t('seo.h1')}
        </h1>
        <p className="text-base text-[var(--color-text-muted)] max-w-2xl">
          {t('seo.description')}
        </p>
      </header>

      {hasFilters && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Filtres actifs :
          </span>
          {activeFilters.map((f) => (
            <Badge key={`${f.label}-${f.value}`} variant="info">
              {f.label}: {f.value}
            </Badge>
          ))}
          <Link
            href={`/${locale}/experiments`}
            className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <X className="w-3 h-3" aria-hidden />
            Effacer
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--color-text-muted)]">
          {filtered.length} /{' '}
          {experiments.length}{' '}
          {t('index.resultCount', { count: filtered.length }).split('|').pop()?.trim()}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-16 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Aucun resultat pour ces filtres.
          </p>
          <Link
            href={`/${locale}/experiments`}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Voir toutes les experiences
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((experiment) => (
            <ExperimentCard key={experiment.slug} experiment={experiment} />
          ))}
        </div>
      )}
    </div>
  );
}
