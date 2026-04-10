'use client';

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import {
  Search,
  X,
  LayoutDashboard,
  FlaskConical,
  NotebookPen,
  Presentation,
  Settings,
  Bot,
  Palette,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { experiments } from '@/lib/data/experiments';
import { cn } from '@/lib/utils/cn';

// ============================================================
// Context — lets any component trigger the palette
// ============================================================

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  }
  return ctx;
}

// ============================================================
// Command item types
// ============================================================

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  section: string;
  action: () => void;
  keywords?: string[];
}

// ============================================================
// Provider + listener
// ============================================================

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, toggle]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandPalette />
    </CommandPaletteContext.Provider>
  );
}

// ============================================================
// Palette UI
// ============================================================

function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');
  const { setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build command list
  const allCommands = useMemo<CommandItem[]>(() => {
    const navCommands: CommandItem[] = [
      {
        id: 'nav-dashboard',
        title: t('nav.dashboard'),
        icon: LayoutDashboard,
        section: t('commandPalette.sections.pages'),
        action: () => router.push('/', { locale }),
        keywords: ['dashboard', 'home', 'accueil', 'tableau'],
      },
      {
        id: 'nav-experiments',
        title: t('nav.experiments'),
        icon: FlaskConical,
        section: t('commandPalette.sections.pages'),
        action: () => router.push('/experiments', { locale }),
        keywords: ['experiments', 'experiences', 'lab'],
      },
      {
        id: 'nav-agents',
        title: t('nav.agents'),
        icon: Bot,
        section: t('commandPalette.sections.pages'),
        action: () => router.push('/agents', { locale }),
        keywords: ['agents', 'orchestration', 'lab director', 'ai'],
      },
      {
        id: 'nav-notes',
        title: t('nav.notes'),
        icon: NotebookPen,
        section: t('commandPalette.sections.pages'),
        action: () => router.push('/notes', { locale }),
        keywords: ['notes', 'notebook', 'journal'],
      },
      {
        id: 'nav-showroom',
        title: t('nav.showroom'),
        icon: Presentation,
        section: t('commandPalette.sections.pages'),
        action: () => router.push('/showroom', { locale }),
        keywords: ['showroom', 'gallery', 'galerie'],
      },
      {
        id: 'nav-settings',
        title: t('nav.settings'),
        icon: Settings,
        section: t('commandPalette.sections.pages'),
        action: () => router.push('/settings', { locale }),
        keywords: ['settings', 'parametres', 'preferences'],
      },
    ];

    const experimentCommands: CommandItem[] = experiments.map((exp) => ({
      id: `exp-${exp.slug}`,
      title: exp.title,
      subtitle: exp.description,
      icon: FlaskConical,
      section: t('commandPalette.sections.experiments'),
      action: () =>
        router.push(`/experiments/${exp.category}/${exp.slug}`, { locale }),
      keywords: [...exp.tags, exp.category, exp.status],
    }));

    const themeCommands: CommandItem[] = [
      { id: 'theme-minimalist', title: t('theme.minimalist'), icon: Palette, keywords: ['theme', 'minimalist', 'default'] },
      { id: 'theme-bento', title: t('theme.bento'), icon: Palette, keywords: ['theme', 'bento'] },
      { id: 'theme-glassmorphism', title: t('theme.glassmorphism'), icon: Palette, keywords: ['theme', 'glass'] },
      { id: 'theme-cyberpunk', title: t('theme.cyberpunk'), icon: Palette, keywords: ['theme', 'cyberpunk', 'neon'] },
    ].map((c) => ({
      ...c,
      section: t('commandPalette.sections.themes'),
      action: () => {
        const themeId = c.id.replace('theme-', '');
        // Use next-themes so state stays in sync with ThemeSwitcher.
        setTheme(themeId);
      },
    }));

    const actions: CommandItem[] = [
      {
        id: 'action-privacy',
        title: t('footer.privacyPolicy'),
        icon: FileText,
        section: t('commandPalette.sections.actions'),
        action: () => router.push('/politique-confidentialite', { locale }),
        keywords: ['privacy', 'confidentialite', 'loi 25'],
      },
      {
        id: 'action-legal',
        title: t('footer.legalNotices'),
        icon: FileText,
        section: t('commandPalette.sections.actions'),
        action: () => router.push('/mentions-legales', { locale }),
        keywords: ['legal', 'mentions'],
      },
    ];

    return [...navCommands, ...experimentCommands, ...themeCommands, ...actions];
  }, [t, router, locale, setTheme]);

  // Filter by query
  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter((cmd) => {
      const haystack = [
        cmd.title,
        cmd.subtitle ?? '',
        cmd.section,
        ...(cmd.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, allCommands]);

  // Group by section (stable order)
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const cmd of filtered) {
      const list = map.get(cmd.section) ?? [];
      list.push(cmd);
      map.set(cmd.section, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Reset selected index when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Keyboard navigation within the palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        if (cmd) {
          cmd.action();
          setOpen(false);
        }
      }
    },
    [filtered, selectedIndex, setOpen]
  );

  if (!open) return null;

  // Flat index for keyboard nav → map back to grouped display
  let globalIndex = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('a11y.openCommandPalette')}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('commandPalette.placeholder')}
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={filtered.length > 0}
            aria-controls="command-palette-listbox"
            aria-activedescendant={
              filtered[selectedIndex] ? `cmd-${filtered[selectedIndex].id}` : undefined
            }
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] transition-colors"
            aria-label={t('actions.close')}
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        </div>

        {/* Results */}
        <div
          id="command-palette-listbox"
          role="listbox"
          aria-label={t('commandPalette.placeholder')}
          className="max-h-[60vh] overflow-y-auto p-2"
        >
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                {t('commandPalette.noResults')}
              </p>
            </div>
          ) : (
            grouped.map(([section, items]) => (
              <div key={section} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {section}
                </div>
                {items.map((cmd) => {
                  globalIndex += 1;
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = cmd.icon;
                  const thisIndex = globalIndex;
                  return (
                    <button
                      key={cmd.id}
                      id={`cmd-${cmd.id}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        cmd.action();
                        setOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(thisIndex)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-default)] text-left text-sm transition-colors',
                        isSelected
                          ? 'bg-[var(--color-surface-alt)] text-[var(--color-text)]'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]'
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[var(--color-text)]">{cmd.title}</div>
                        {cmd.subtitle && (
                          <div className="text-xs text-[var(--color-text-muted)] truncate">
                            {cmd.subtitle}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
          <span>
            <kbd className="px-1 py-0.5 rounded border border-[var(--color-border)] font-mono">
              ↑
            </kbd>{' '}
            <kbd className="px-1 py-0.5 rounded border border-[var(--color-border)] font-mono">
              ↓
            </kbd>{' '}
            navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded border border-[var(--color-border)] font-mono">
              Enter
            </kbd>{' '}
            select
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded border border-[var(--color-border)] font-mono">
              Esc
            </kbd>{' '}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
