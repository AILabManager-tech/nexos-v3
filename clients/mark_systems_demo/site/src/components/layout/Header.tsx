'use client';

import { useTranslations } from 'next-intl';
import { Search, Command } from 'lucide-react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import LocaleSwitcher from './LocaleSwitcher';
import { useCommandPalette } from './CommandPalette';

export default function Header() {
  const t = useTranslations('common');
  const { setOpen } = useCommandPalette();

  return (
    <header
      role="banner"
      className="sticky top-0 z-20 h-14 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md"
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Search (command palette trigger) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('a11y.openCommandPalette')}
          className="flex-1 max-w-md flex items-center gap-3 px-3 py-1.5 rounded-[var(--radius-default)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-muted)] hover:border-[var(--color-border-active)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <Search className="w-4 h-4 shrink-0" aria-hidden />
          <span className="flex-1 text-left truncate">{t('commandPalette.placeholder')}</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[10px] font-mono">
            <Command className="w-3 h-3" aria-hidden />K
          </kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher compact />
          <div className="h-6 w-px bg-[var(--color-border)]" aria-hidden />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
