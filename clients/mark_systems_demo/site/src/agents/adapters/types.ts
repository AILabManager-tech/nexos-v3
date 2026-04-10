/**
 * Shared types for LLM adapters.
 * All adapters must implement `generate` and optionally `stream`.
 */

export interface LlmCallOptions {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LlmResult {
  content: string;
  tokensUsed: number;
  costUsd: number;
  model: string;
  provider: string;
  durationMs: number;
}

export type LlmStreamChunk =
  | { type: 'text-delta'; text: string }
  | {
      type: 'finish';
      tokensUsed: number;
      costUsd: number;
      model: string;
      provider: string;
    }
  | { type: 'error'; error: string };

export type LlmStreamResult = AsyncGenerator<LlmStreamChunk, void, unknown>;

export interface LlmAdapter {
  generate(options: LlmCallOptions): Promise<LlmResult>;
  stream?(options: LlmCallOptions): LlmStreamResult;
}

/**
 * Token pricing per million tokens (input only for simplicity).
 * Used to estimate cost from token count.
 */
export const PRICING_PER_MILLION: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4.6': { input: 3, output: 15 },
  'claude-haiku-4': { input: 0.8, output: 4 },
  'gpt-4.1': { input: 2.5, output: 10 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
};

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING_PER_MILLION[model] ?? PRICING_PER_MILLION['claude-sonnet-4.6']!;
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}
