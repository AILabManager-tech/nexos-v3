import { useTranslations } from 'next-intl';
import { Wrench, Sparkles, TrendingUp, type LucideIcon } from 'lucide-react';
import type { AgentId, AgentStatus } from '@/types';

interface AgentCard {
  id: AgentId;
  icon: LucideIcon;
  status: AgentStatus;
  lastActivity: string;
}

const AGENTS: AgentCard[] = [
  { id: 'devops', icon: Wrench, status: 'active', lastActivity: '5 min' },
  { id: 'uiGenerator', icon: Sparkles, status: 'idle', lastActivity: '1 h' },
  { id: 'businessStrategist', icon: TrendingUp, status: 'processing', lastActivity: 'now' },
];

const STATUS_COLORS: Record<AgentStatus, string> = {
  active: 'var(--color-success)',
  idle: 'var(--color-text-muted)',
  processing: 'var(--color-warning)',
  error: 'var(--color-error)',
};

export default function AgentStatusPanel() {
  const t = useTranslations('common.agents');
  const td = useTranslations('dashboard.agentStatus');

  return (
    <section aria-labelledby="agent-status-heading">
      <h2
        id="agent-status-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4"
      >
        {td('title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: STATUS_COLORS[agent.status] }}
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {td(agent.status)}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                {t(`${agent.id}.name`)}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                {t(`${agent.id}.description`)}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
                {agent.lastActivity}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
