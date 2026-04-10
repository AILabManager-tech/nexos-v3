'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = routing.locales.find((l) => l !== locale);

  if (!otherLocale) return null;

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      aria-label={`Switch to ${otherLocale.toUpperCase()}`}
    >
      <Globe className="w-3.5 h-3.5" aria-hidden />
      <span className="uppercase">{otherLocale}</span>
    </button>
  );
}
