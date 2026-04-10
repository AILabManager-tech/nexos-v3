'use client';

import { useTranslations } from 'next-intl';
import { reopenCookieConsent } from './CookieConsent';

export default function CookiePreferencesButton() {
  const t = useTranslations('common.consent');
  return (
    <button
      type="button"
      onClick={reopenCookieConsent}
      className="px-4 py-2 text-sm rounded-[var(--radius-default)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors"
    >
      {t('customize')}
    </button>
  );
}
