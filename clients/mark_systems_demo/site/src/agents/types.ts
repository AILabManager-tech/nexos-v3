import { z } from 'zod';

// ============================================================
// Agent identity
// ============================================================

export const AgentIdSchema = z.enum([
  'lab-director',
  'devops',
  'ui-generator',
  'content-curator',
  'docs-writer',
  'business-strategist',
  'showroom-publisher',
  'deploy-sentinel',
]);
export type AgentId = z.infer<typeof AgentIdSchema>;

export const AgentPhaseSchema = z.enum([
  'init',
  'build',
  'polish',
  'docs',
  'monetize',
  'showcase',
  'ship',
  'meta',
]);
export type AgentPhase = z.infer<typeof AgentPhaseSchema>;

export const AgentCapabilitySchema = z.enum([
  'text-generation',
  'code-generation',
  'image-generation',
  'voice-synthesis',
  'browser-automation',
  'file-manipulation',
  'multimodal-analysis',
  'data-analysis',
  'deployment',
]);
export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;

// ============================================================
// Agent request / response
// ============================================================

export const AgentRequestSchema = z.object({
  agentId: AgentIdSchema,
  input: z.string().min(1).max(10000),
  context: z
    .object({
      experimentSlug: z.string().optional(),
      theme: z.enum(['minimalist', 'bento', 'glassmorphism', 'cyberpunk']).optional(),
      locale: z.enum(['fr', 'en']).default('fr'),
      userId: z.string().optional(),
    })
    .default(() => ({ locale: 'fr' as const })),
  options: z
    .object({
      stream: z.boolean().default(false),
      maxTokens: z.number().int().min(1).max(32000).default(4096),
      temperature: z.number().min(0).max(2).default(0.7),
      budgetUsd: z.number().positive().default(0.5),
    })
    .default(() => ({
      stream: false,
      maxTokens: 4096,
      temperature: 0.7,
      budgetUsd: 0.5,
    })),
});
export type AgentRequest = z.infer<typeof AgentRequestSchema>;

export const AgentStepSchema = z.object({
  id: z.string(),
  agentId: AgentIdSchema,
  status: z.enum(['pending', 'running', 'success', 'error', 'skipped']),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  output: z.string().optional(),
  error: z.string().optional(),
  tokensUsed: z.number().int().nonnegative().default(0),
  costUsd: z.number().nonnegative().default(0),
});
export type AgentStep = z.infer<typeof AgentStepSchema>;

export const AgentResponseSchema = z.object({
  requestId: z.string(),
  agentId: AgentIdSchema,
  status: z.enum(['success', 'error', 'partial']),
  output: z.string(),
  reasoning: z.string().optional(),
  steps: z.array(AgentStepSchema).default([]),
  metadata: z.object({
    model: z.string(),
    provider: z.string(),
    tokensUsed: z.number().int().nonnegative(),
    costUsd: z.number().nonnegative(),
    durationMs: z.number().int().nonnegative(),
    soicScore: z.number().min(0).max(10).optional(),
  }),
  artifacts: z
    .array(
      z.object({
        type: z.enum(['file', 'image', 'audio', 'code', 'doc', 'json']),
        path: z.string().optional(),
        url: z.string().url().optional(),
        content: z.string().optional(),
      })
    )
    .default([]),
  createdAt: z.string().datetime(),
});
export type AgentResponse = z.infer<typeof AgentResponseSchema>;

// ============================================================
// Agent definition (registry entry)
// ============================================================

export interface AgentDefinition {
  id: AgentId;
  name: string;
  description: string;
  phase: AgentPhase;
  capabilities: AgentCapability[];
  requires: AgentId[]; // Agents that must run first
  color: string; // Theme-aware color key
  icon: string; // Lucide icon name
  systemPromptKey: string; // Key in prompts/
  model: {
    default: string;
    fallbacks: string[];
  };
  maxBudgetUsd: number;
  useGencore: boolean; // If true, delegate to Gencore bridge
}

// ============================================================
// Orchestration plan
// ============================================================

export const OrchestrationPlanSchema = z.object({
  id: z.string(),
  objective: z.string(),
  steps: z.array(
    z.object({
      order: z.number().int().positive(),
      agentId: AgentIdSchema,
      input: z.string(),
      dependsOn: z.array(z.number().int().positive()).default([]),
      status: z.enum(['pending', 'running', 'success', 'error', 'skipped']).default('pending'),
    })
  ),
  totalBudgetUsd: z.number().positive(),
  createdAt: z.string().datetime(),
});
export type OrchestrationPlan = z.infer<typeof OrchestrationPlanSchema>;
