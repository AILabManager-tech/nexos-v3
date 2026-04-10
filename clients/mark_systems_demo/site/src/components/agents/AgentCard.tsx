'use client';

import {
  Crown,
  Wrench,
  Sparkles,
  Palette,
  FileText,
  TrendingUp,
  Presentation,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { AgentDefinition } from '@/agents/types';

const ICONS: Record<string, LucideIcon> = {
  Crown,
  Wrench,
  Sparkles,
  Palette,
  FileText,
  TrendingUp,
  Presentation,
  Rocket,
};

const PHASE_LABELS: Record<string, string> = {
  meta: 'Meta',
  init: 'Init',
  build: 'Build',
  polish: 'Polish',
  docs: 'Docs',
  monetize: 'Monetize',
  showcase: 'Showcase',
  ship: 'Ship',
};

export default function AgentCard({
  agent,
  selected = false,
  onClick,
}: {
  agent: AgentDefinition;
  selected?: boolean;
  onClick?: () => void;
}) {
  const Icon = ICONS[agent.icon] ?? Sparkles;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full text-left bg-[var(--color-surface)] border rounded-[var(--radius-lg)] p-5 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
        selected
          ? 'border-[var(--color-primary)] shadow-lg'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-active)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-[var(--radius-default)] bg-[var(--color-surface-alt)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--color-primary)]" aria-hidden />
        </div>
        <Badge variant="outline">{PHASE_LABELS[agent.phase] ?? agent.phase}</Badge>
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
        {agent.name}
      </h3>
      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-3 mb-3">
        {agent.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {agent.capabilities.slice(0, 3).map((cap) => (
          <Badge key={cap} variant="default">
            {cap}
          </Badge>
        ))}
        {agent.capabilities.length > 3 && (
          <Badge variant="outline">+{agent.capabilities.length - 3}</Badge>
        )}
      </div>
      {agent.useGencore && (
        <p className="text-[10px] text-[var(--color-primary)] mt-3 uppercase tracking-wide">
          Gencore bridge
        </p>
      )}
    </button>
  );
}
