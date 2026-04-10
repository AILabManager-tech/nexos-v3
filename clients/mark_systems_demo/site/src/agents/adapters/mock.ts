/**
 * Mock LLM adapter — deterministic stubs for each agent.
 * Used when no real provider is configured.
 */
import type { LlmCallOptions, LlmResult, LlmStreamResult } from './types';

const STUB_RESPONSES: Array<{ match: string; output: string }> = [
  {
    match: 'lab director',
    output: JSON.stringify(
      {
        objective: 'user-provided',
        plan: [
          { order: 1, agentId: 'devops', input: 'Scaffold experiment' },
          { order: 2, agentId: 'ui-generator', input: 'Generate component' },
          { order: 3, agentId: 'docs-writer', input: 'Document component' },
          { order: 4, agentId: 'business-strategist', input: 'Propose pricing' },
        ],
        estimatedCostUsd: 0.45,
      },
      null,
      2
    ),
  },
  {
    match: 'devops agent',
    output: `[DevOps] Scaffolded experiment structure:

/experiments/ui/new-component/
├── component.tsx
├── component.stories.tsx
├── component.test.tsx
└── metadata.json

Branch: feature/new-component
CI: .github/workflows/test.yml updated`,
  },
  {
    match: 'ui-generator',
    output: `[UI-Generator] Component generated across 4 themes.

\`\`\`tsx
import { motion } from 'framer-motion';
export function Component() {
  return (
    <motion.div
      className="p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    />
  );
}
\`\`\``,
  },
  {
    match: 'content curator',
    output: `[Content Curator] FR/EN copy ready.
FR: "Composants prets a deployer"
EN: "Production-ready components"`,
  },
  {
    match: 'docs writer',
    output: `[Docs Writer] MDX documentation drafted with props table, usage examples, and a11y notes.`,
  },
  {
    match: 'business strategist',
    output: JSON.stringify(
      {
        tier: 'pro',
        price: 49,
        uvp: 'The only web lab where every experiment becomes a micro-product.',
      },
      null,
      2
    ),
  },
  {
    match: 'showroom publisher',
    output: `[Showroom Publisher] Landing page + SEO meta generated.`,
  },
  {
    match: 'deploy sentinel',
    output: `[Deploy Sentinel] SOIC: 9.2/10 PASS. Deployed to Vercel. Health checks OK.`,
  },
];

function matchResponse(systemPrompt: string): string {
  const lower = systemPrompt.toLowerCase();
  const hit = STUB_RESPONSES.find((r) => lower.includes(r.match));
  return hit?.output ?? '[Agent] Processed.';
}

export async function mockGenerate(options: LlmCallOptions): Promise<LlmResult> {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 200));
  const content = matchResponse(options.systemPrompt);
  const tokensUsed = Math.ceil(content.length / 4);
  return {
    content,
    tokensUsed,
    costUsd: (tokensUsed / 1_000_000) * 3,
    model: options.model + ' (mock)',
    provider: 'mock',
    durationMs: Date.now() - start,
  };
}

export async function* mockStream(options: LlmCallOptions): LlmStreamResult {
  const content = matchResponse(options.systemPrompt);
  // Split into small chunks to simulate streaming
  const chunks = content.match(/.{1,30}/g) ?? [content];
  let tokensUsed = 0;

  for (const chunk of chunks) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    tokensUsed += Math.ceil(chunk.length / 4);
    yield { type: 'text-delta', text: chunk };
  }

  yield {
    type: 'finish',
    tokensUsed,
    costUsd: (tokensUsed / 1_000_000) * 3,
    model: options.model + ' (mock)',
    provider: 'mock',
  };
}
