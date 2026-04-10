'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const CONSENT_KEY = 'cookie-consent';
const REOPEN_EVENT = 'cookie-consent:reopen';

/**
 * Programmatically reopen the consent banner (e.g. from Settings page).
 * Clears the stored choice and re-shows the banner.
 */
export function reopenCookieConsent() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent(REOPEN_EVENT));
}

export default function CookieConsent() {
  const t = useTranslations('common.consent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);

    const handleReopen = () => setVisible(true);
    window.addEventListener(REOPEN_EVENT, handleReopen);
    return () => window.removeEventListener(REOPEN_EVENT, handleReopen);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'all');
    setVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(CONSENT_KEY, 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('bannerTitle')}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)]"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold mb-1">{t('bannerTitle')}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{t('bannerText')}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleRefuse}
            className="px-4 py-2 text-sm rounded-[var(--radius-default)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors"
          >
            {t('refuse')}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm rounded-[var(--radius-default)] bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
