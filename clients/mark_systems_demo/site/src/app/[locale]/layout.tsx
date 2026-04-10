import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from 'next-themes';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/themes/tokens.css';
import '@/app/globals.css';
import CookieConsent from '@/components/legal/CookieConsent';
import AppShell from '@/components/layout/AppShell';
import WebVitalsReporter from '@/components/layout/WebVitalsReporter';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'common.a11y' });

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <ThemeProvider attribute="data-theme" defaultTheme="minimalist" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded"
            >
              {t('skipToContent')}
            </a>
            <AppShell>
              <main id="main-content">{children}</main>
            </AppShell>
            <CookieConsent />
            <WebVitalsReporter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
