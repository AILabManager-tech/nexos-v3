'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  FlaskConical,
  NotebookPen,
  Presentation,
  Settings,
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
  { key: 'notes', href: '/notes', icon: NotebookPen },
  { key: 'showroom', href: '/showroom', icon: Presentation },
  { key: 'settings', href: '/settings', icon: Settings },
];

export default function MobileNav() {
  const t = useTranslations('common.nav');
  const pathname = usePathname();
  const locale = useLocale();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-around px-2"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.key}
            href={`/${locale}${item.href === '/' ? '' : item.href}`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              active
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)]'
            )}
          >
            <Icon className="w-5 h-5" aria-hidden />
            <span className="truncate max-w-[60px]">{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
