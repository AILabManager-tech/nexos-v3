'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface RunSummary {
  id: string;
  objective: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'partial';
  totalCostUsd: number;
  totalTokensUsed: number;
  startedAt: string;
  completedAt: string | null;
}

const STATUS_VARIANT = {
  success: 'success',
  error: 'error',
  partial: 'warning',
  running: 'info',
  pending: 'outline',
} as const;

export default function RunsHistory() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch('/api/agents/runs?limit=10');
        if (!response.ok) throw new Error('Failed to load runs');
        const data = await response.json();
        if (!cancelled) {
          setRuns(data.runs ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          Loading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <p className="text-sm text-[var(--color-error)]">Error: {error}</p>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center">
        <Clock className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" aria-hidden />
        <p className="text-sm text-[var(--color-text-muted)]">
          Aucun run pour l&apos;instant. Lance le premier pipeline au-dessus.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="runs-history-heading">
      <h2
        id="runs-history-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-4"
      >
        Historique des runs
      </h2>
      <div className="space-y-3">
        {runs.map((run) => (
          <RunCard key={run.id} run={run} />
        ))}
      </div>
    </section>
  );
}

function RunCard({ run }: { run: RunSummary }) {
  const date = new Date(run.startedAt);
  const duration = run.completedAt
    ? Math.round((new Date(run.completedAt).getTime() - date.getTime()) / 1000)
    : null;

  const statusIcon = {
    success: <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" aria-hidden />,
    error: <XCircle className="w-4 h-4 text-[var(--color-error)]" aria-hidden />,
    partial: <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" aria-hidden />,
    running: <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin" aria-hidden />,
    pending: <Clock className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden />,
  }[run.status];

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-4 hover:border-[var(--color-border-active)] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {statusIcon}
          <p className="text-sm text-[var(--color-text)] truncate">{run.objective}</p>
        </div>
        <Badge variant={STATUS_VARIANT[run.status]}>{run.status}</Badge>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
        <span>{date.toLocaleString('fr-CA')}</span>
        {duration !== null && (
          <>
            <span aria-hidden>•</span>
            <span>{duration}s</span>
          </>
        )}
        <span aria-hidden>•</span>
        <span>{run.totalTokensUsed.toLocaleString()} tokens</span>
        <span aria-hidden>•</span>
        <span>${run.totalCostUsd.toFixed(4)}</span>
      </div>
    </div>
  );
}
