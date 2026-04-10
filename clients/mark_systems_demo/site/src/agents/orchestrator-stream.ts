/**
 * Streaming orchestrator.
 *
 * Executes a pipeline and emits SSE events for each step.
 * Persists the run and agent calls via the storage layer.
 */
import { randomUUID } from 'node:crypto';
import type { AgentId } from './types';
import { AGENT_REGISTRY, buildDefaultPipeline } from './registry';
import { getSystemPrompt } from './prompts';
import { streamLlm } from './adapters/llm';
import { runStorage, userStorage } from '@/lib/storage';
import { evaluate as evaluateSoic } from '@/lib/soic';
import { dispatch as dispatchWebhook } from '@/lib/webhooks';
import type { SseEvent } from './streaming/sse';

export interface StreamPipelineOptions {
  objective: string;
  userId?: string | null;
  pipeline?: AgentId[];
  maxTokens?: number;
  temperature?: number;
  budgetUsd?: number;
}

/**
 * Execute a pipeline and yield SSE events.
 * Caller wraps this in eventsToStream() + ReadableStream.
 */
export async function* streamPipeline(
  options: StreamPipelineOptions
): AsyncGenerator<SseEvent, void, unknown> {
  const pipeline = options.pipeline ?? buildDefaultPipeline();
  const maxTokens = options.maxTokens ?? 4096;
  const temperature = options.temperature ?? 0.7;
  const budgetUsd = options.budgetUsd ?? 1.0;
  const userId = options.userId ?? null;

  // Check quota before starting (if user is authenticated)
  if (userId) {
    const user = await userStorage.getUser(userId);
    if (user && user.quotaUsdRemaining < budgetUsd) {
      yield {
        type: 'error',
        error: `Quota insuffisant: $${user.quotaUsdRemaining.toFixed(2)} restant, $${budgetUsd.toFixed(2)} requis.`,
      };
      return;
    }
  }

  // Create run record
  const plan = {
    id: randomUUID(),
    objective: options.objective,
    steps: pipeline.map((agentId, index) => ({
      order: index + 1,
      agentId,
      dependsOn: index > 0 ? [index] : [],
      status: 'pending' as const,
    })),
  };

  const run = await runStorage.createRun({
    userId,
    objective: options.objective,
    plan,
  });

  yield { type: 'plan', plan };

  await runStorage.updateRun(run.id, { status: 'running' });

  let totalCostUsd = 0;
  let totalTokensUsed = 0;
  let previousOutput = options.objective;
  let stepSucceeded = 0;

  // Emit pipeline.started webhook (fire-and-forget)
  void dispatchWebhook('pipeline.started', {
    runId: run.id,
    data: { objective: options.objective, pipeline, userId },
  });

  for (const [index, agentId] of pipeline.entries()) {
    const order = index + 1;

    // Check budget per-step
    if (totalCostUsd >= budgetUsd) {
      yield {
        type: 'error',
        error: `Budget $${budgetUsd.toFixed(2)} depasse apres ${index} etapes.`,
      };
      break;
    }

    const definition = AGENT_REGISTRY[agentId];
    const systemPrompt = getSystemPrompt(agentId);
    const userPrompt =
      index === 0
        ? options.objective
        : `Previous output from ${pipeline[index - 1]}:\n${previousOutput.slice(0, 2000)}\n\nYour task: ${options.objective}`;

    yield { type: 'step-start', agentId, order };

    // Emit webhook for step start
    void dispatchWebhook('pipeline.step.started', {
      runId: run.id,
      data: { agentId, order },
    });

    const stepStart = Date.now();
    let accumulatedText = '';
    let finalTokens = 0;
    let finalCost = 0;
    let finalModel = definition.model.default;
    let finalProvider = 'unknown';
    let hadError = false;

    try {
      for await (const chunk of streamLlm({
        systemPrompt,
        userPrompt,
        model: definition.model.default,
        temperature,
        maxTokens,
      })) {
        if (chunk.type === 'text-delta') {
          accumulatedText += chunk.text;
          yield { type: 'text-delta', agentId, text: chunk.text };
        } else if (chunk.type === 'finish') {
          finalTokens = chunk.tokensUsed;
          finalCost = chunk.costUsd;
          finalModel = chunk.model;
          finalProvider = chunk.provider;
        } else if (chunk.type === 'error') {
          hadError = true;
          yield { type: 'error', error: chunk.error };
          // Approximate the cost of streamed-but-unfinished tokens
          // so budget accounting stays honest even on mid-stream errors.
          if (finalTokens === 0 && accumulatedText.length > 0) {
            finalTokens = Math.ceil(accumulatedText.length / 4);
            finalCost = (finalTokens / 1_000_000) * 3;
          }
          break;
        }
      }
    } catch (error) {
      hadError = true;
      const reason = error instanceof Error ? error.message : String(error);
      yield { type: 'error', error: `Agent ${agentId}: ${reason}` };
      // Same approximation for thrown errors so partial costs are billed.
      if (finalTokens === 0 && accumulatedText.length > 0) {
        finalTokens = Math.ceil(accumulatedText.length / 4);
        finalCost = (finalTokens / 1_000_000) * 3;
      }
    }

    // Always include partial cost in the totals so budget and quota
    // tracking never miss charges incurred on a failed step.
    if (hadError) {
      totalCostUsd += finalCost;
      totalTokensUsed += finalTokens;
    }

    const durationMs = Date.now() - stepStart;

    // SOIC evaluation on the agent output (heuristic scoring)
    const soicReport = evaluateSoic({
      output: accumulatedText,
      agentId,
    });

    // Persist agent call with SOIC score
    await runStorage.addAgentCall({
      runId: run.id,
      agentId,
      stepOrder: order,
      input: userPrompt.slice(0, 2000),
      output: accumulatedText,
      error: hadError ? 'Stream error' : null,
      model: finalModel,
      provider: finalProvider,
      tokensUsed: finalTokens,
      costUsd: finalCost,
      durationMs,
      soicScore: soicReport.weightedAverage,
    });

    // Emit webhook for step completion
    void dispatchWebhook('pipeline.step.completed', {
      runId: run.id,
      data: {
        agentId,
        order,
        tokensUsed: finalTokens,
        costUsd: finalCost,
        soicScore: soicReport.weightedAverage,
        hadError,
      },
    });

    // Emit SOIC event
    void dispatchWebhook('soic.evaluated', {
      runId: run.id,
      data: {
        agentId,
        report: soicReport,
      },
    });

    yield {
      type: 'step-end',
      agentId,
      order,
      tokensUsed: finalTokens,
      costUsd: finalCost,
      durationMs,
      model: finalModel,
      provider: finalProvider,
    };

    if (hadError) {
      break;
    }

    totalCostUsd += finalCost;
    totalTokensUsed += finalTokens;
    previousOutput = accumulatedText;
    stepSucceeded++;
  }

  // Finalize run
  const finalStatus =
    stepSucceeded === pipeline.length ? 'success' : stepSucceeded > 0 ? 'partial' : 'error';

  await runStorage.updateRun(run.id, {
    status: finalStatus,
    totalCostUsd,
    totalTokensUsed,
    completedAt: new Date(),
  });

  // Decrement user quota
  if (userId) {
    await userStorage.decrementQuota(userId, totalCostUsd);
  }

  // Emit final webhook
  void dispatchWebhook(finalStatus === 'error' ? 'pipeline.failed' : 'pipeline.completed', {
    runId: run.id,
    data: {
      status: finalStatus,
      totalCostUsd,
      totalTokensUsed,
      stepSucceeded,
      totalSteps: pipeline.length,
    },
  });

  yield {
    type: 'finish',
    runId: run.id,
    totalTokensUsed,
    totalCostUsd,
    status: finalStatus,
  };
}
