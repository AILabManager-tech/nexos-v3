/**
 * LLM adapter dispatcher.
 *
 * Auto-detects which adapter to use based on environment:
 * 1. LLM_ADAPTER explicitly set → use that
 * 2. ANTHROPIC_API_KEY present → anthropic
 * 3. OPENAI_API_KEY present → openai
 * 4. Otherwise → mock
 *
 * Provides fallback chain on errors (anthropic → openai → mock).
 */
import type {
  LlmCallOptions,
  LlmResult,
  LlmStreamResult,
  LlmAdapter,
} from './types';
import { mockGenerate, mockStream } from './mock';

// Re-export types for backwards compatibility
export type { LlmCallOptions, LlmResult, LlmStreamResult, LlmAdapter } from './types';

type AdapterName = 'mock' | 'anthropic' | 'openai';

function detectAdapter(): AdapterName {
  const explicit = process.env.LLM_ADAPTER?.toLowerCase();
  if (explicit === 'mock' || explicit === 'anthropic' || explicit === 'openai') {
    return explicit;
  }
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'mock';
}

async function loadAdapter(name: AdapterName): Promise<LlmAdapter> {
  if (name === 'anthropic') {
    const mod = await import('./anthropic');
    return mod.anthropicAdapter;
  }
  if (name === 'openai') {
    const mod = await import('./openai');
    return mod.openaiAdapter;
  }
  // Mock adapter
  return {
    generate: mockGenerate,
    stream: mockStream,
  };
}

/**
 * Non-streaming generate with automatic fallback.
 */
export async function callLlm(options: LlmCallOptions): Promise<LlmResult> {
  const primary = detectAdapter();
  try {
    const adapter = await loadAdapter(primary);
    return await adapter.generate(options);
  } catch (error) {
    console.error(`[llm] Primary adapter '${primary}' failed:`, error);
    if (primary !== 'mock') {
      console.warn('[llm] Falling back to mock adapter');
      const mockAdapter = await loadAdapter('mock');
      return mockAdapter.generate(options);
    }
    throw error;
  }
}

/**
 * Streaming generate with automatic fallback.
 */
export async function* streamLlm(options: LlmCallOptions): LlmStreamResult {
  const primary = detectAdapter();
  try {
    const adapter = await loadAdapter(primary);
    if (!adapter.stream) {
      // Adapter doesn't support streaming → wrap non-streaming as single chunk
      const result = await adapter.generate(options);
      yield { type: 'text-delta', text: result.content };
      yield {
        type: 'finish',
        tokensUsed: result.tokensUsed,
        costUsd: result.costUsd,
        model: result.model,
        provider: result.provider,
      };
      return;
    }

    for await (const chunk of adapter.stream(options)) {
      yield chunk;
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    yield { type: 'error', error: reason };
  }
}

/**
 * Get the currently active adapter name (for diagnostics / UI).
 */
export function getActiveAdapter(): AdapterName {
  return detectAdapter();
}
