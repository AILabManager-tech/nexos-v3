import type { Metadata } from 'next';
import { listAgents } from '@/agents/registry';
import { getActiveAdapter } from '@/agents/adapters/llm';
import { getStorageBackend } from '@/lib/storage';
import AgentCard from '@/components/agents/AgentCard';
import LabDirectorConsole from '@/components/agents/LabDirectorConsole';
import RunsHistory from '@/components/agents/RunsHistory';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Agents | Mark Systems',
  description:
    'Série d\'agents orchestrés pour le cycle de vie complet d\'une expérimentation : du scaffold au deploy.',
};

export default function AgentsPage() {
  const agents = listAgents();
  const adapter = getActiveAdapter();
  const storage = getStorageBackend();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-2">
          Orchestration
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-3">
          Agents du Mega-Lab
        </h1>
        <p className="text-base text-[var(--color-text-muted)] max-w-3xl leading-relaxed mb-4">
          8 agents specialises orchestres par le Lab Director. Chaque agent a une phase
          dediee dans le cycle de vie d&apos;une experimentation : scaffold, build,
          polish, docs, monetize, showcase, ship.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">LLM: {adapter}</Badge>
          <Badge variant="info">Storage: {storage}</Badge>
          <Badge variant="outline">Streaming SSE</Badge>
        </div>
      </header>

      {/* Lab Director Console */}
      <LabDirectorConsole />

      {/* Runs history */}
      <RunsHistory />

      {/* Agent grid */}
      <section aria-labelledby="agents-grid-heading">
        <h2
          id="agents-grid-heading"
          className="text-xl font-semibold text-[var(--color-text)] mb-6"
        >
          Liste des agents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Integration notice */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
          Integration systemes existants
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Les agents reutilisent 3 systemes locaux deja developpes :
        </p>
        <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">Gencore</strong> (FastAPI gateway)
            — 14 LLM providers, multimodal, Docker sandbox, browser automation,
            voice STT/TTS
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Geargrinder MCP</strong> —
            Provider aggregator 7 LLMs + 4 image gens (DALL-E, SD, FLUX, Leonardo)
          </li>
          <li>
            <strong className="text-[var(--color-text)]">NEXOS SOIC</strong> — Quality
            gates 9 dimensions pour valider chaque output
          </li>
        </ul>
        <p className="text-xs text-[var(--color-text-muted)] mt-4">
          LLM adapter actuel: <code className="font-mono">mock</code>. Configure{' '}
          <code className="font-mono">LLM_ADAPTER=vercel</code> + API keys en production.
        </p>
      </section>
    </div>
  );
}
