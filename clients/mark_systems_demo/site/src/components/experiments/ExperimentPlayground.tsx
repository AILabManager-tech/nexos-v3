'use client';

import { useState, useCallback, useEffect } from 'react';
import { Copy, Check, Monitor, Tablet, Smartphone, ExternalLink, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

type Viewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

interface ExperimentPlaygroundProps {
  title: string;
  bundleSizeKb: number;
  themeSupport: string[];
  codeSnippet: string;
  storybookUrl?: string;
}

export default function ExperimentPlayground({
  title,
  bundleSizeKb,
  themeSupport,
  codeSnippet,
  storybookUrl,
}: ExperimentPlaygroundProps) {
  const t = useTranslations('experiments.detail');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
    } catch (err) {
      console.error('[playground] Failed to copy:', err);
    }
  }, [codeSnippet]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4" aria-hidden />
              Copie !
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden />
              {t('actions.copyCode')}
            </>
          )}
        </Button>
        {storybookUrl ? (
          <a
            href={storybookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[var(--radius-default)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-border-active)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            {t('actions.openStorybook')}
          </a>
        ) : (
          <Button variant="outline" disabled title="Storybook URL not configured">
            <ExternalLink className="w-4 h-4" aria-hidden />
            {t('actions.openStorybook')}
          </Button>
        )}
      </div>

      {/* Preview with viewport toggle */}
      <section
        aria-labelledby="preview-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between gap-3 flex-wrap">
          <h2
            id="preview-heading"
            className="text-sm font-semibold text-[var(--color-text)]"
          >
            {t('tabs.preview')}
          </h2>
          <div
            role="radiogroup"
            aria-label="Viewport size"
            className="flex items-center gap-1 bg-[var(--color-bg)] rounded-[var(--radius-sm)] p-0.5 border border-[var(--color-border)]"
          >
            {(
              [
                { id: 'mobile' as const, icon: Smartphone, label: t('viewport.mobile') },
                { id: 'tablet' as const, icon: Tablet, label: t('viewport.tablet') },
                { id: 'desktop' as const, icon: Monitor, label: t('viewport.desktop') },
              ]
            ).map(({ id, icon: Icon, label }) => {
              const active = viewport === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={label}
                  onClick={() => setViewport(id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                    active
                      ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview canvas — resizes based on selected viewport */}
        <div className="p-6 bg-[var(--color-bg)] flex justify-center">
          <div
            className="relative h-80 w-full transition-all duration-300 ease-out"
            style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}
          >
            <div
              className="absolute inset-0 rounded-[var(--radius-default)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-surface-alt) 0%, var(--color-surface) 100%)',
              }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent animate-[shimmer_3s_ease-in-out_infinite]"
                  style={{
                    animation: 'shimmer 3s ease-in-out infinite',
                  }}
                />
              </div>
              <div className="relative text-center">
                <Package
                  className="w-14 h-14 text-[var(--color-primary)] mx-auto mb-3 opacity-80"
                  aria-hidden
                />
                <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {viewport === 'mobile'
                    ? '375px'
                    : viewport === 'tablet'
                      ? '768px'
                      : 'Full width'}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-3 max-w-xs mx-auto">
                  Live preview when the experiment is implemented.
                  For now, this is a responsive placeholder.
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(0); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </section>

      {/* Code panel */}
      <section
        aria-labelledby="code-heading"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 id="code-heading" className="text-sm font-semibold text-[var(--color-text)]">
            {t('tabs.code')}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">TypeScript</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              aria-label={t('actions.copyCode')}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" aria-hidden />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden />
              )}
            </button>
          </div>
        </div>
        <pre className="p-5 text-xs font-mono text-[var(--color-text-muted)] overflow-x-auto bg-[var(--color-bg)]">
          <code>{codeSnippet}</code>
        </pre>
      </section>
    </div>
  );
}
