import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import StatsStrip from '@/components/dashboard/StatsStrip';
import AgentStatusPanel from '@/components/dashboard/AgentStatusPanel';
import RecentExperiments from '@/components/dashboard/RecentExperiments';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard.seo' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: true },
  };
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
          {tc('siteName')}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-2">
          {t('greeting')}
        </h1>
        <p className="text-base text-[var(--color-text-muted)] max-w-2xl">
          {tc('siteDescription')}
        </p>
      </header>

      {/* Stats */}
      <StatsStrip />

      {/* Recent experiments */}
      <RecentExperiments />

      {/* Agents */}
      <AgentStatusPanel />
    </div>
  );
}
