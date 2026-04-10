/**
 * OpenAI adapter via Vercel AI SDK.
 * Used as fallback when Anthropic is unavailable.
 */
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import type {
  LlmCallOptions,
  LlmResult,
  LlmStreamResult,
  LlmAdapter,
} from './types';
import { estimateCost } from './types';

const MODEL_MAP: Record<string, string> = {
  'gpt-4.1': 'gpt-4-turbo',
  'gpt-4o-mini': 'gpt-4o-mini',
  'claude-sonnet-4.6': 'gpt-4-turbo', // Fallback mapping
  'claude-haiku-4': 'gpt-4o-mini',
};

function resolveModel(requested: string): string {
  return MODEL_MAP[requested] ?? 'gpt-4o-mini';
}

export const openaiAdapter: LlmAdapter = {
  async generate(options: LlmCallOptions): Promise<LlmResult> {
    const start = Date.now();
    const modelName = resolveModel(options.model);

    const result = await generateText({
      model: openai(modelName),
      system: options.systemPrompt,
      prompt: options.userPrompt,
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens,
    });

    const inputTokens = result.usage.inputTokens ?? 0;
    const outputTokens = result.usage.outputTokens ?? 0;
    const tokensUsed = inputTokens + outputTokens;

    return {
      content: result.text,
      tokensUsed,
      costUsd: estimateCost(options.model, inputTokens, outputTokens),
      model: modelName,
      provider: 'openai',
      durationMs: Date.now() - start,
    };
  },

  async *stream(options: LlmCallOptions): LlmStreamResult {
    const modelName = resolveModel(options.model);

    const result = streamText({
      model: openai(modelName),
      system: options.systemPrompt,
      prompt: options.userPrompt,
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens,
    });

    for await (const chunk of result.textStream) {
      yield { type: 'text-delta', text: chunk };
    }

    const usage = await result.usage;
    const inputTokens = usage.inputTokens ?? 0;
    const outputTokens = usage.outputTokens ?? 0;

    yield {
      type: 'finish',
      tokensUsed: inputTokens + outputTokens,
      costUsd: estimateCost(options.model, inputTokens, outputTokens),
      model: modelName,
      provider: 'openai',
    };
  },
};
