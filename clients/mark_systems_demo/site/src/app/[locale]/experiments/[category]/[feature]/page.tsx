import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Experiment } from '@/types';
import {
  ChevronRight,
  Package,
  Calendar,
  User,
  Palette,
  ArrowLeft,
} from 'lucide-react';
import { getExperiment } from '@/lib/data/experiments';
import { Badge } from '@/components/ui/Badge';
import ExperimentPlayground from '@/components/experiments/ExperimentPlayground';

interface PageParams {
  locale: string;
  category: string;
  feature: string;
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { feature } = await params;
  const experiment = getExperiment(feature);
  if (!experiment) return {};
  return {
    title: `${experiment.title} | Mark Systems`,
    description: experiment.description,
    openGraph: {
      title: `${experiment.title} — Interactive Playground`,
      description: experiment.description,
      type: 'article',
    },
  };
}

function buildCodeSnippet(experiment: Experiment): string {
  const componentName = experiment.title.replace(/\s+/g, '');
  return `// ${experiment.title}
// ${experiment.bundleSizeKb} KB gzipped
// Themes: ${experiment.themeSupport.join(', ')}

import { ${componentName} } from '@/experiments/${experiment.category}/${experiment.slug}';

export default function Example() {
  return <${componentName} />;
}`;
}

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, category, feature } = await params;
  const experiment = getExperiment(feature);

  if (!experiment || experiment.category !== category) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'experiments.detail' });
  const tc = await getTranslations({ locale, namespace: 'experiments.categories' });
  const codeSnippet = buildCodeSnippet(experiment);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] flex-wrap">
          <li>
            <Link
              href={`/${locale}/experiments`}
              className="hover:text-[var(--color-text)] transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
              {locale === 'fr' ? 'Experiences' : 'Experiments'}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li>
            <Link
              href={`/${locale}/experiments?category=${experiment.category}`}
              className="hover:text-[var(--color-text)] transition-colors"
            >
              {tc(experiment.category)}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
          <li>
            <span className="text-[var(--color-text)] font-medium">{experiment.title}</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge
            variant={STATUS_VARIANT[experiment.status]}
            href={`/${locale}/experiments?status=${experiment.status}`}
            ariaLabel={`Filter by status ${experiment.status}`}
          >
            {experiment.status}
          </Badge>
          {experiment.pricingTier && (
            <Badge
              variant="info"
              href={`/${locale}/experiments?tier=${experiment.pricingTier}`}
              ariaLabel={`Filter by tier ${experiment.pricingTier}`}
            >
              {TIER_LABEL[experiment.pricingTier]}
            </Badge>
          )}
          <Badge
            variant="outline"
            href={`/${locale}/experiments?category=${experiment.category}`}
            ariaLabel={`Filter by category ${experiment.category}`}
          >
            {tc(experiment.category)}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-3">
          {experiment.title}
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-3xl leading-relaxed">
          {experiment.description}
        </p>
      </header>

      {/* Main grid: playground + meta sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-10">
        <div className="space-y-6">
          <ExperimentPlayground
            title={experiment.title}
            bundleSizeKb={experiment.bundleSizeKb}
            themeSupport={experiment.themeSupport}
            codeSnippet={codeSnippet}
          />

          {/* Auto-docs */}
          <section
            aria-labelledby="docs-heading"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
          >
            <h2
              id="docs-heading"
              className="text-sm font-semibold text-[var(--color-text)] mb-4"
            >
              {t('autoDocs.title')}
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                  {t('autoDocs.overview')}
                </h3>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {experiment.description}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                  {t('autoDocs.dependencies')}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Bundle size: {experiment.bundleSizeKb} KB gzipped
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experiment.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      href={`/${locale}/experiments?tag=${encodeURIComponent(tag)}`}
                      ariaLabel={`Filter by tag ${tag}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Meta sidebar */}
        <aside
          aria-label="Experiment metadata"
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 h-fit lg:sticky lg:top-20"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4">
            {t('autoDocs.title')}
          </h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1">
                <User className="w-3.5 h-3.5" aria-hidden />
                {t('metadata.author')}
              </dt>
              <dd className="text-[var(--color-text)]">{experiment.author}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden />
                {t('metadata.created')}
              </dt>
              <dd className="text-[var(--color-text)]">{experiment.createdAt}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden />
                {t('metadata.updated')}
              </dt>
              <dd className="text-[var(--color-text)]">{experiment.updatedAt}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1">
                <Package className="w-3.5 h-3.5" aria-hidden />
                {t('metadata.bundleSize')}
              </dt>
              <dd className="text-[var(--color-text)]">{experiment.bundleSizeKb} KB</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1">
                <Palette className="w-3.5 h-3.5" aria-hidden />
                {t('metadata.themeSupport')}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {experiment.themeSupport.map((theme) => (
                  <Badge
                    key={theme}
                    variant="default"
                    href={`/${locale}/experiments?theme=${theme}`}
                    ariaLabel={`Filter by theme ${theme}`}
                  >
                    {theme}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
