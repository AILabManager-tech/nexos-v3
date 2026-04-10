import type { AgentDefinition, AgentId } from './types';

/**
 * Mark Systems Mega-Lab Agent Registry
 *
 * 8 agents orchestrated around the experiment lifecycle:
 * IDEA → SCAFFOLD → CODE → POLISH → DOCS → MONETIZE → SHOWCASE → SHIP
 */
export const AGENT_REGISTRY: Record<AgentId, AgentDefinition> = {
  'lab-director': {
    id: 'lab-director',
    name: 'Lab Director',
    description:
      'Meta-orchestrator. Receives user intent, classifies, plans, and dispatches to specialized agents.',
    phase: 'meta',
    capabilities: ['text-generation', 'data-analysis'],
    requires: [],
    color: 'primary',
    icon: 'Crown',
    systemPromptKey: 'lab-director',
    model: {
      default: 'claude-sonnet-4.6',
      fallbacks: ['gpt-4.1', 'claude-haiku-4'],
    },
    maxBudgetUsd: 0.05,
    useGencore: false,
  },

  devops: {
    id: 'devops',
    name: 'DevOps Agent',
    description:
      'Infrastructure automation. Scaffolds experiments, creates feature branches, configures CI, manages deployments.',
    phase: 'init',
    capabilities: ['code-generation', 'file-manipulation', 'deployment'],
    requires: ['lab-director'],
    color: 'info',
    icon: 'Wrench',
    systemPromptKey: 'devops',
    model: {
      default: 'claude-sonnet-4.6',
      fallbacks: ['gpt-4.1'],
    },
    maxBudgetUsd: 0.15,
    useGencore: false,
  },

  'ui-generator': {
    id: 'ui-generator',
    name: 'UI-Generator Agent',
    description:
      'Visual component designer. Generates React/Tailwind/Framer Motion components across the 4 themes with Storybook stories.',
    phase: 'build',
    capabilities: ['code-generation', 'text-generation'],
    requires: ['devops'],
    color: 'accent',
    icon: 'Sparkles',
    systemPromptKey: 'ui-generator',
    model: {
      default: 'claude-sonnet-4.6',
      fallbacks: ['gpt-4.1'],
    },
    maxBudgetUsd: 0.25,
    useGencore: false,
  },

  'content-curator': {
    id: 'content-curator',
    name: 'Content Curator',
    description:
      'Multimodal content agent. Generates copy, alt texts, OG images, visuals. Uses Gencore bridge for image generation.',
    phase: 'polish',
    capabilities: ['text-generation', 'image-generation', 'multimodal-analysis'],
    requires: ['ui-generator'],
    color: 'warning',
    icon: 'Palette',
    systemPromptKey: 'content-curator',
    model: {
      default: 'claude-sonnet-4.6',
      fallbacks: ['gpt-4.1'],
    },
    maxBudgetUsd: 0.3,
    useGencore: true, // Uses Gencore for image gen via Geargrinder MCP
  },

  'docs-writer': {
    id: 'docs-writer',
    name: 'Docs Writer',
    description:
      'Auto-documentation agent. Extracts props from TypeScript interfaces, analyzes Storybook stories, generates MDX docs.',
    phase: 'docs',
    capabilities: ['text-generation', 'code-generation', 'file-manipulation'],
    requires: ['ui-generator'],
    color: 'success',
    icon: 'FileText',
    systemPromptKey: 'docs-writer',
    model: {
      default: 'claude-haiku-4', // Cheaper for bulk docs
      fallbacks: ['claude-sonnet-4.6'],
    },
    maxBudgetUsd: 0.1,
    useGencore: false,
  },

  'business-strategist': {
    id: 'business-strategist',
    name: 'Business Strategist',
    description:
      'Product monetization agent. Analyzes experiment value, generates pricing tiers, UVP, competitive analysis, landing copy.',
    phase: 'monetize',
    capabilities: ['text-generation', 'data-analysis'],
    requires: ['content-curator', 'docs-writer'],
    color: 'error',
    icon: 'TrendingUp',
    systemPromptKey: 'business-strategist',
    model: {
      default: 'claude-sonnet-4.6',
      fallbacks: ['gpt-4.1'],
    },
    maxBudgetUsd: 0.2,
    useGencore: false,
  },

  'showroom-publisher': {
    id: 'showroom-publisher',
    name: 'Showroom Publisher',
    description:
      'Publishing agent. Generates landing pages per experiment, SEO meta, OG images, integrates into the /showroom gallery.',
    phase: 'showcase',
    capabilities: ['code-generation', 'image-generation', 'file-manipulation'],
    requires: ['business-strategist'],
    color: 'primary',
    icon: 'Presentation',
    systemPromptKey: 'showroom-publisher',
    model: {
      default: 'claude-sonnet-4.6',
      fallbacks: ['gpt-4.1'],
    },
    maxBudgetUsd: 0.15,
    useGencore: true, // OG image generation
  },

  'deploy-sentinel': {
    id: 'deploy-sentinel',
    name: 'Deploy Sentinel',
    description:
      'Deployment guardian. Triggers Vercel deploys, runs post-deploy health checks, SOIC validation, rollback on failure.',
    phase: 'ship',
    capabilities: ['deployment', 'data-analysis', 'browser-automation'],
    requires: ['showroom-publisher'],
    color: 'info',
    icon: 'Rocket',
    systemPromptKey: 'deploy-sentinel',
    model: {
      default: 'claude-haiku-4',
      fallbacks: ['claude-sonnet-4.6'],
    },
    maxBudgetUsd: 0.1,
    useGencore: true, // Browser automation for health checks
  },
};

/**
 * Agent phase ordering for sequential pipelines.
 */
export const PHASE_ORDER: Record<string, number> = {
  meta: 0,
  init: 1,
  build: 2,
  polish: 3,
  docs: 4,
  monetize: 5,
  showcase: 6,
  ship: 7,
};

export function listAgents(): AgentDefinition[] {
  return Object.values(AGENT_REGISTRY).sort(
    (a, b) => PHASE_ORDER[a.phase]! - PHASE_ORDER[b.phase]!
  );
}

export function getAgent(id: AgentId): AgentDefinition {
  return AGENT_REGISTRY[id];
}

export function getAgentsByPhase(phase: string): AgentDefinition[] {
  return listAgents().filter((a) => a.phase === phase);
}

/**
 * Build a default orchestration pipeline from lab-director → deploy-sentinel.
 */
export function buildDefaultPipeline(): AgentId[] {
  return [
    'lab-director',
    'devops',
    'ui-generator',
    'content-curator',
    'docs-writer',
    'business-strategist',
    'showroom-publisher',
    'deploy-sentinel',
  ];
}
