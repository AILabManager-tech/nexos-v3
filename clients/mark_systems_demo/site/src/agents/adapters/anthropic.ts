/**
 * Anthropic adapter via Vercel AI SDK.
 * Uses claude-sonnet or claude-haiku depending on the requested model.
 *
 * Resilience:
 * - If streamText throws "No output generated" (AI SDK v6 edge case), fall back
 *   to generateText and emit the result as a single synthesized chunk.
 * - Catches errors inside the generator so callers get a clean error event.
 */
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText } from 'ai';
import type {
  LlmCallOptions,
  LlmResult,
  LlmStreamResult,
  LlmAdapter,
} from './types';
import { estimateCost } from './types';

const MODEL_MAP: Record<string, string> = {
  'claude-sonnet-4.6': 'claude-sonnet-4-5',
  'claude-haiku-4': 'claude-3-5-haiku-latest',
};

function resolveModel(requested: string): string {
  return MODEL_MAP[requested] ?? 'claude-sonnet-4-5';
}

/**
 * Non-streaming generate — direct generateText call.
 */
async function anthropicGenerate(options: LlmCallOptions): Promise<LlmResult> {
  const start = Date.now();
  const modelName = resolveModel(options.model);

  const result = await generateText({
    model: anthropic(modelName),
    system: options.systemPrompt,
    prompt: options.userPrompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxTokens,
  });

  const inputTokens = result.usage.inputTokens ?? 0;
  const outputTokens = result.usage.outputTokens ?? 0;

  return {
    content: result.text,
    tokensUsed: inputTokens + outputTokens,
    costUsd: estimateCost(options.model, inputTokens, outputTokens),
    model: modelName,
    provider: 'anthropic',
    durationMs: Date.now() - start,
  };
}

/**
 * Streaming generator with resilience against empty-stream errors.
 *
 * If `streamText` completes with zero text chunks OR throws "No output generated",
 * we fall back to `generateText` and emit the full response as chunks of ~40 chars
 * to preserve a streaming UX for the client.
 */
async function* anthropicStream(options: LlmCallOptions): LlmStreamResult {
  const modelName = resolveModel(options.model);

  let chunkCount = 0;
  let streamError: Error | null = null;
  let finalUsage: { inputTokens?: number; outputTokens?: number } | null = null;

  try {
    const result = streamText({
      model: anthropic(modelName),
      system: options.systemPrompt,
      prompt: options.userPrompt,
      temperature: options.temperature,
      maxOutputTokens: options.maxTokens,
    });

    try {
      for await (const chunk of result.textStream) {
        if (chunk.length > 0) {
          chunkCount++;
          yield { type: 'text-delta', text: chunk };
        }
      }
      // Only await usage if stream produced data — otherwise it throws.
      if (chunkCount > 0) {
        const usage = await result.usage;
        finalUsage = {
          inputTokens: usage.inputTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0,
        };
      }
    } catch (innerError) {
      streamError = innerError instanceof Error ? innerError : new Error(String(innerError));
    }
  } catch (outerError) {
    streamError = outerError instanceof Error ? outerError : new Error(String(outerError));
  }

  // Fallback: if zero chunks yielded, retry with non-streaming and synthesize.
  if (chunkCount === 0) {
    try {
      const fallback = await anthropicGenerate(options);
      // Emit the text as chunks to preserve streaming UX
      const CHUNK_SIZE = 40;
      for (let i = 0; i < fallback.content.length; i += CHUNK_SIZE) {
        yield {
          type: 'text-delta',
          text: fallback.content.slice(i, i + CHUNK_SIZE),
        };
      }
      yield {
        type: 'finish',
        tokensUsed: fallback.tokensUsed,
        costUsd: fallback.costUsd,
        model: fallback.model,
        provider: 'anthropic',
      };
      return;
    } catch (fallbackError) {
      yield {
        type: 'error',
        error:
          fallbackError instanceof Error
            ? `Anthropic fallback failed: ${fallbackError.message}`
            : 'Anthropic fallback failed',
      };
      return;
    }
  }

  // Normal path — we got chunks from the stream.
  const inputTokens = finalUsage?.inputTokens ?? 0;
  const outputTokens = finalUsage?.outputTokens ?? 0;

  yield {
    type: 'finish',
    tokensUsed: inputTokens + outputTokens,
    costUsd: estimateCost(options.model, inputTokens, outputTokens),
    model: modelName,
    provider: 'anthropic',
  };

  // If we had an error but still got chunks, log it but don't fail.
  if (streamError && chunkCount > 0) {
    console.warn('[anthropic] Stream completed with error after chunks:', streamError.message);
  }
}

export const anthropicAdapter: LlmAdapter = {
  generate: anthropicGenerate,
  stream: anthropicStream,
};
