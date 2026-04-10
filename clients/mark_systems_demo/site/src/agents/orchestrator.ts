import { randomUUID } from 'node:crypto';
import type {
  AgentId,
  AgentRequest,
  AgentResponse,
  AgentStep,
  OrchestrationPlan,
} from './types';
import { AGENT_REGISTRY, buildDefaultPipeline } from './registry';
import { getSystemPrompt } from './prompts';
import { callLlm } from './adapters/llm';

/**
 * Execute a single agent call.
 */
export async function runAgent(request: AgentRequest): Promise<AgentResponse> {
  const definition = AGENT_REGISTRY[request.agentId];
  const systemPrompt = getSystemPrompt(request.agentId);
  const start = Date.now();

  const result = await callLlm({
    systemPrompt,
    userPrompt: request.input,
    model: definition.model.default,
    temperature: request.options.temperature,
    maxTokens: request.options.maxTokens,
  });

  const step: AgentStep = {
    id: randomUUID(),
    agentId: request.agentId,
    status: 'success',
    startedAt: new Date(start).toISOString(),
    completedAt: new Date().toISOString(),
    output: result.content,
    tokensUsed: result.tokensUsed,
    costUsd: result.costUsd,
  };

  return {
    requestId: randomUUID(),
    agentId: request.agentId,
    status: 'success',
    output: result.content,
    steps: [step],
    metadata: {
      model: result.model,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
      costUsd: result.costUsd,
      durationMs: result.durationMs,
    },
    artifacts: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Execute a full pipeline sequentially, stopping on first error.
 * Each agent receives the output of the previous as additional context.
 */
export async function runPipeline(
  objective: string,
  pipeline: AgentId[] = buildDefaultPipeline(),
  options: AgentRequest['options'] = {
    stream: false,
    maxTokens: 4096,
    temperature: 0.7,
    budgetUsd: 1.0,
  }
): Promise<{
  plan: OrchestrationPlan;
  responses: AgentResponse[];
  totalCostUsd: number;
  totalTokensUsed: number;
  status: 'success' | 'error' | 'partial';
}> {
  const planId = randomUUID();
  const plan: OrchestrationPlan = {
    id: planId,
    objective,
    steps: pipeline.map((agentId, index) => ({
      order: index + 1,
      agentId,
      input: '',
      dependsOn: index > 0 ? [index] : [],
      status: 'pending',
    })),
    totalBudgetUsd: options.budgetUsd,
    createdAt: new Date().toISOString(),
  };

  const responses: AgentResponse[] = [];
  let totalCostUsd = 0;
  let totalTokensUsed = 0;
  let previousOutput = objective;

  for (const [index, agentId] of pipeline.entries()) {
    const step = plan.steps[index];
    if (!step) continue;
    step.status = 'running';

    // Check budget
    if (totalCostUsd >= options.budgetUsd) {
      step.status = 'skipped';
      continue;
    }

    try {
      const request: AgentRequest = {
        agentId,
        input:
          index === 0
            ? objective
            : `Previous output from ${pipeline[index - 1]}:\n${previousOutput.slice(0, 2000)}\n\nYour task: ${objective}`,
        context: { locale: 'fr' },
        options,
      };

      const response = await runAgent(request);
      responses.push(response);
      totalCostUsd += response.metadata.costUsd;
      totalTokensUsed += response.metadata.tokensUsed;
      previousOutput = response.output;

      step.input = request.input.slice(0, 200);
      step.status = response.status === 'success' ? 'success' : 'error';
    } catch (error) {
      step.status = 'error';
      return {
        plan,
        responses,
        totalCostUsd,
        totalTokensUsed,
        status: 'error',
      };
    }
  }

  const allSuccess = plan.steps.every((s) => s.status === 'success');

  return {
    plan,
    responses,
    totalCostUsd,
    totalTokensUsed,
    status: allSuccess ? 'success' : 'partial',
  };
}
