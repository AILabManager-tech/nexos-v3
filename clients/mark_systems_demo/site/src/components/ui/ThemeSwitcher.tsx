'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ThemeName } from '@/types';

const THEMES: { id: ThemeName; labelKey: string; swatches: string[] }[] = [
  {
    id: 'minimalist',
    labelKey: 'minimalist',
    swatches: ['#0A0A0F', '#6366F1', '#F1F5F9'],
  },
  {
    id: 'bento',
    labelKey: 'bento',
    swatches: ['#0C0A07', '#F59E0B', '#FBBF24'],
  },
  {
    id: 'glassmorphism',
    labelKey: 'glassmorphism',
    swatches: ['#0A0A0F', '#6366F1', '#A5B4FC'],
  },
  {
    id: 'cyberpunk',
    labelKey: 'cyberpunk',
    swatches: ['#05050A', '#00F5FF', '#BF5AF2'],
  },
];

export default function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('common.theme');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn(
          'flex gap-2',
          compact ? 'h-10' : 'h-20'
        )}
      />
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2" role="radiogroup" aria-label={t('label')}>
        <Palette className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden />
        {THEMES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={theme === item.id}
            aria-label={t(item.labelKey)}
            title={t(item.labelKey)}
            onClick={() => setTheme(item.id)}
            className={cn(
              'w-6 h-6 rounded-full border-2 transition-all',
              theme === item.id
                ? 'border-[var(--color-primary)] scale-110'
                : 'border-[var(--color-border)] opacity-60 hover:opacity-100'
            )}
            style={{
              background: `linear-gradient(135deg, ${item.swatches[0]} 0%, ${item.swatches[1]} 50%, ${item.swatches[2]} 100%)`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('label')}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {THEMES.map((item) => {
        const active = theme === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(item.id)}
            className={cn(
              'relative group p-4 rounded-[var(--radius-lg)] border text-left transition-all',
              active
                ? 'border-[var(--color-primary)] bg-[var(--color-surface-alt)] shadow-lg'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-active)]'
            )}
          >
            <div
              className="h-16 rounded-[var(--radius-default)] mb-3"
              style={{
                background: `linear-gradient(135deg, ${item.swatches[0]} 0%, ${item.swatches[1]} 60%, ${item.swatches[2]} 100%)`,
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text)]">
                {t(item.labelKey)}
              </span>
              {active && (
                <span
                  aria-hidden
                  className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
