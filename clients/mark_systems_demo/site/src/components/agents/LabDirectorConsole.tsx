'use client';

import { useState, useRef, useCallback } from 'react';
import { Play, Loader2, Bot, User, CheckCircle2, XCircle, CircleDashed } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { SseEvent } from '@/agents/streaming/sse';

interface StepState {
  order: number;
  agentId: string;
  status: 'pending' | 'running' | 'success' | 'error';
  text: string;
  tokensUsed?: number;
  costUsd?: number;
  durationMs?: number;
  model?: string;
  provider?: string;
}

interface PipelineState {
  planId?: string;
  runId?: string;
  steps: Map<number, StepState>;
  totalCostUsd: number;
  totalTokensUsed: number;
  status: 'idle' | 'running' | 'success' | 'partial' | 'error';
  error?: string;
}

const initialState: PipelineState = {
  steps: new Map(),
  totalCostUsd: 0,
  totalTokensUsed: 0,
  status: 'idle',
};

export default function LabDirectorConsole() {
  const [objective, setObjective] = useState('');
  const [state, setState] = useState<PipelineState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const updateState = useCallback((updater: (s: PipelineState) => PipelineState) => {
    setState((prev) => updater(prev));
  }, []);

  const runPipeline = async () => {
    if (!objective.trim()) return;

    // Reset state
    const abort = new AbortController();
    abortRef.current = abort;
    setState({ ...initialState, status: 'running', steps: new Map() });

    try {
      const response = await fetch('/api/agents/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        const error = await response.json().catch(() => ({ error: 'network' }));
        updateState((s) => ({ ...s, status: 'error', error: error.error ?? 'Request failed' }));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events (separated by \n\n)
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const raw of events) {
          if (!raw.trim()) continue;
          const dataLine = raw.split('\n').find((l) => l.startsWith('data: '));
          if (!dataLine) continue;
          try {
            const event = JSON.parse(dataLine.slice(6));
            handleEvent(event, updateState);
          } catch {
            // Ignore malformed events
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        updateState((s) => ({
          ...s,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    updateState((s) => ({ ...s, status: 'idle' }));
  };

  const steps = Array.from(state.steps.values()).sort((a, b) => a.order - b.order);
  const isRunning = state.status === 'running';

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Lab Director Console
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Decris une experimentation. Le pipeline streame en temps reel via 8 agents.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2 block">
            Objective
          </span>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="ex: Cree un bouton neon avec effet glitch au hover pour le theme Cyberpunk"
            rows={3}
            className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-default)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] resize-none"
            disabled={isRunning}
          />
        </label>

        <div className="flex gap-3">
          <Button onClick={runPipeline} disabled={isRunning || !objective.trim()} size="lg">
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                Pipeline en cours...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" aria-hidden />
                Lancer le pipeline
              </>
            )}
          </Button>
          {isRunning && (
            <Button onClick={cancel} variant="outline" size="lg">
              Annuler
            </Button>
          )}
        </div>

        {state.error && (
          <div className="p-4 bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] rounded-[var(--radius-default)]">
            <p className="text-sm text-[var(--color-error)]">Erreur : {state.error}</p>
          </div>
        )}

        {steps.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Pipeline live
              </h3>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <span>{state.totalTokensUsed.toLocaleString()} tokens</span>
                <span aria-hidden>•</span>
                <span>${state.totalCostUsd.toFixed(4)}</span>
                {state.status !== 'running' && (
                  <Badge variant={state.status === 'success' ? 'success' : 'warning'}>
                    {state.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <StepRow key={step.order} step={step} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepRow({ step }: { step: StepState }) {
  const statusIcon = {
    pending: <CircleDashed className="w-3.5 h-3.5 text-[var(--color-text-muted)]" aria-hidden />,
    running: <Loader2 className="w-3.5 h-3.5 text-[var(--color-primary)] animate-spin" aria-hidden />,
    success: <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden />,
    error: <XCircle className="w-3.5 h-3.5 text-[var(--color-error)]" aria-hidden />,
  }[step.status];

  return (
    <div className="p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-[var(--radius-default)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcon}
          <User className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden />
          <span className="text-xs font-semibold text-[var(--color-text)]">{step.agentId}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">#{step.order}</span>
        </div>
        {step.status === 'success' && step.durationMs !== undefined && (
          <span className="text-[10px] text-[var(--color-text-muted)]">
            {step.durationMs}ms • {step.tokensUsed} tok • ${step.costUsd?.toFixed(4)}
          </span>
        )}
      </div>
      {step.text && (
        <pre className="text-xs text-[var(--color-text-muted)] whitespace-pre-wrap font-mono overflow-x-auto max-h-60 overflow-y-auto">
          {step.text}
        </pre>
      )}
    </div>
  );
}

function handleEvent(event: SseEvent, update: (fn: (s: PipelineState) => PipelineState) => void) {
  update((s) => {
    const steps = new Map(s.steps);

    if (event.type === 'plan') {
      return s;
    }

    if (event.type === 'step-start') {
      steps.set(event.order, {
        order: event.order,
        agentId: event.agentId,
        status: 'running',
        text: '',
      });
      return { ...s, steps };
    }

    if (event.type === 'text-delta') {
      // Find the running step for this agent
      for (const step of steps.values()) {
        if (step.agentId === event.agentId && step.status === 'running') {
          steps.set(step.order, { ...step, text: step.text + event.text });
          break;
        }
      }
      return { ...s, steps };
    }

    if (event.type === 'step-end') {
      const existing = steps.get(event.order);
      if (existing) {
        steps.set(event.order, {
          ...existing,
          status: 'success',
          tokensUsed: event.tokensUsed,
          costUsd: event.costUsd,
          durationMs: event.durationMs,
          model: event.model,
          provider: event.provider,
        });
      }
      return { ...s, steps };
    }

    if (event.type === 'finish') {
      return {
        ...s,
        runId: event.runId,
        totalCostUsd: event.totalCostUsd,
        totalTokensUsed: event.totalTokensUsed,
        status: event.status,
      };
    }

    if (event.type === 'error') {
      return { ...s, status: 'error', error: event.error };
    }

    return s;
  });
}
