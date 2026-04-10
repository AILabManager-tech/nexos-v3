'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  FlaskConical,
  NotebookPen,
  Presentation,
  Settings,
  Bot,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  key: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'experiments', href: '/experiments', icon: FlaskConical },
  { key: 'agents', href: '/agents', icon: Bot },
  { key: 'notes', href: '/notes', icon: NotebookPen },
  { key: 'showroom', href: '/showroom', icon: Presentation },
  { key: 'admin', href: '/admin', icon: Shield },
  { key: 'settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const t = useTranslations('common.nav');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const locale = useLocale();

  const isActive = (href: string) => {
    const localizedHref = `/${locale}${href === '/' ? '' : href}`;
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(localizedHref);
  };

  return (
    <aside
      aria-label="Main navigation"
      className="hidden md:flex flex-col w-16 lg:w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] h-screen sticky top-0 shrink-0"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[var(--color-border)]">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-sm)]"
          aria-label={tc('siteName')}
        >
          <div className="w-8 h-8 rounded-[var(--radius-default)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="hidden lg:inline font-semibold text-[var(--color-text)]">
            {tc('siteName')}
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-default)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                active
                  ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden />
              <span className="hidden lg:inline truncate">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer version */}
      <div className="p-3 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] hidden lg:block">
        v0.1.0 • mark-systems
      </div>
    </aside>
  );
}
