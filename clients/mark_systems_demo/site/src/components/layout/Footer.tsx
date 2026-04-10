import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import CookiePreferencesButton from '@/components/legal/CookiePreferencesButton';

export default function Footer() {
  const t = useTranslations('common.footer');
  const tc = useTranslations('common');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 mb-3"
              aria-label={tc('siteName')}
            >
              <div className="w-8 h-8 rounded-[var(--radius-default)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-[var(--color-text)]">
                {tc('siteName')}
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] max-w-xs">
              {tc('siteDescription')}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text)] mb-3">
              {t('platform')}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/experiments`}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {t('experiments')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/notes`}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {t('notes')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/showroom`}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {t('showroom')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text)] mb-3">
              {t('resources')}
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>{t('documentation')}</li>
              <li>{t('changelog')}</li>
              <li>{t('storybook')}</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text)] mb-3">
              {t('legal')}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/politique-confidentialite`}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/mentions-legales`}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {t('legalNotices')}
                </Link>
              </li>
              <li>
                <CookiePreferencesButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('copyright', { currentYear })}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with Next.js 16 • Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
