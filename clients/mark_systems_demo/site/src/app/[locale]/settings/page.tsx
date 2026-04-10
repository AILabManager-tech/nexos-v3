import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Palette, Languages, ShieldCheck } from 'lucide-react';
import CookiePreferencesButton from '@/components/legal/CookiePreferencesButton';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'settings.seo' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tc = useTranslations('common.consent');

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)]">
          {t('pageTitle')}
        </h1>
      </header>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {t('sections.appearance.title')}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t('sections.appearance.themeLabel')}
              </p>
            </div>
          </div>
          <ThemeSwitcher />
        </section>

        {/* Language */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                {t('sections.language.title')}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Utilise le selecteur de langue dans l&apos;en-tete (coin superieur droit).
              </p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {tc('bannerTitle')}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">
                {tc('bannerText')}
              </p>
              <CookiePreferencesButton />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
