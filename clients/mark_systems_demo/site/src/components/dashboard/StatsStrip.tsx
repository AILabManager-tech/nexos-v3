import { useTranslations } from 'next-intl';
import { FlaskConical, NotebookPen, Presentation, Clock } from 'lucide-react';
import { getExperimentStats } from '@/lib/data/experiments';

export default function StatsStrip() {
  const t = useTranslations('dashboard.stats');
  const stats = getExperimentStats();

  const items = [
    {
      label: t('experiments'),
      value: stats.total.toString(),
      icon: FlaskConical,
      hint: `${stats.stable} stable • ${stats.beta} beta`,
    },
    {
      label: t('notes'),
      value: '12',
      icon: NotebookPen,
      hint: '+3 this week',
    },
    {
      label: t('showroomItems'),
      value: '4',
      icon: Presentation,
      hint: '2 public',
    },
    {
      label: t('lastUpdated'),
      value: '2h',
      icon: Clock,
      hint: 'animated-card',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                {item.label}
              </span>
              <Icon className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden />
            </div>
            <p className="text-3xl font-semibold text-[var(--color-text)] mb-1 tabular-nums">
              {item.value}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{item.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
