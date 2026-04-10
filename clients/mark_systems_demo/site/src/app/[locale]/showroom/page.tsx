import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Palette, FileCode, ShieldCheck } from 'lucide-react';
import { experiments } from '@/lib/data/experiments';
import ExperimentCard from '@/components/experiments/ExperimentCard';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'showroom.seo' });
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

export default function ShowroomPage() {
  const t = useTranslations('showroom');
  const featured = experiments.filter((e) => e.status === 'stable').slice(0, 6);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto pt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-4">
          {t('seo.h1')}
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-text)] mb-6 leading-tight">
          {t('marketing.headline')}
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-8 leading-relaxed">
          {t('marketing.subtitle')}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg">{t('card.requestFeature')}</Button>
          <Button size="lg" variant="outline">
            {t('card.viewDetails')}
          </Button>
        </div>
      </section>

      {/* Value props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Palette, key: 'themes' },
          { icon: FileCode, key: 'docs' },
          { icon: ShieldCheck, key: 'production' },
        ].map(({ icon: Icon, key }) => (
          <div
            key={key}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
          >
            <div className="w-12 h-12 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-[var(--color-primary)]" aria-hidden />
            </div>
            <p className="text-sm text-[var(--color-text)] font-medium leading-relaxed">
              {t(`marketing.valueProps.${key}`)}
            </p>
          </div>
        ))}
      </section>

      {/* Theme selector */}
      <section aria-labelledby="theme-selector-heading">
        <div className="mb-6">
          <h2
            id="theme-selector-heading"
            className="text-xl font-semibold text-[var(--color-text)] mb-2"
          >
            {t('index.themeSelector')}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {t('themeShowdown.description')}
          </p>
        </div>
        <ThemeSwitcher />
      </section>

      {/* Gallery */}
      <section aria-labelledby="gallery-heading">
        <h2
          id="gallery-heading"
          className="text-xl font-semibold text-[var(--color-text)] mb-6"
        >
          {t('index.gallery')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((experiment) => (
            <ExperimentCard key={experiment.slug} experiment={experiment} />
          ))}
        </div>
      </section>
    </div>
  );
}
