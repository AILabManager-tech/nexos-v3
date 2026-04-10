'use client';

import { useEffect, useState } from 'react';
import { Loader2, Database, Bot, Webhook, DollarSign, Activity, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface AdminStats {
  backend: {
    storage: string;
    llm: string;
    env: string;
  };
  runs: {
    total: number;
    byStatus: Record<string, number>;
    totalCostUsd: number;
    totalTokens: number;
    avgCostUsd: number;
    avgTokens: number;
    successRate: number;
  };
  agents: Array<{ id: string; name: string; phase: string }>;
  webhooks: { targets: number; active: number };
  generatedAt: string;
}

export default function AdminStatsPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 10_000); // Refresh every 10s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          Loading stats...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <p className="text-sm text-[var(--color-error)]">Error: {error ?? 'No data'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Backend status */}
      <section aria-labelledby="backend-heading">
        <h2
          id="backend-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4"
        >
          Backend services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatusCard label="Storage" value={stats.backend.storage} icon={Database} />
          <StatusCard label="LLM Adapter" value={stats.backend.llm} icon={Bot} />
          <StatusCard label="Environment" value={stats.backend.env} icon={CheckCircle2} />
        </div>
      </section>

      {/* Run metrics */}
      <section aria-labelledby="runs-heading">
        <h2
          id="runs-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4"
        >
          Pipeline runs
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total runs"
            value={stats.runs.total.toString()}
            icon={Activity}
            hint={`${stats.runs.successRate.toFixed(1)}% success`}
          />
          <MetricCard
            label="Total cost"
            value={`$${stats.runs.totalCostUsd.toFixed(4)}`}
            icon={DollarSign}
            hint={`$${stats.runs.avgCostUsd.toFixed(4)} avg`}
          />
          <MetricCard
            label="Total tokens"
            value={stats.runs.totalTokens.toLocaleString()}
            icon={Bot}
            hint={`${Math.round(stats.runs.avgTokens)} avg`}
          />
          <MetricCard
            label="Webhooks"
            value={`${stats.webhooks.active}/${stats.webhooks.targets}`}
            icon={Webhook}
            hint="active / total"
          />
        </div>

        {/* Status breakdown */}
        {Object.keys(stats.runs.byStatus).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(stats.runs.byStatus).map(([status, count]) => (
              <Badge
                key={status}
                variant={
                  status === 'success'
                    ? 'success'
                    : status === 'error'
                      ? 'error'
                      : status === 'partial'
                        ? 'warning'
                        : 'outline'
                }
              >
                {status}: {count}
              </Badge>
            ))}
          </div>
        )}
      </section>

      {/* Agents inventory */}
      <section aria-labelledby="agents-heading">
        <h2
          id="agents-heading"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4"
        >
          Agents registered ({stats.agents.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stats.agents.map((a) => (
            <div
              key={a.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] px-3 py-2 text-xs"
            >
              <div className="font-semibold text-[var(--color-text)] truncate">{a.name}</div>
              <div className="text-[var(--color-text-muted)]">{a.phase}</div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[10px] text-[var(--color-text-muted)]">
        Auto-refresh 10s. Last: {new Date(stats.generatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Database;
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof Database;
  hint?: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
          {label}
        </span>
        <Icon className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden />
      </div>
      <p className="text-2xl font-semibold text-[var(--color-text)] tabular-nums mb-1">
        {value}
      </p>
      {hint && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}
