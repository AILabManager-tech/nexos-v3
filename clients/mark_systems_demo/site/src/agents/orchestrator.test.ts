import { describe, it, expect } from 'vitest';
import { runAgent, runPipeline } from './orchestrator';
import type { AgentRequest } from './types';

describe('Orchestrator — runAgent', () => {
  it('executes a single agent and returns valid response', async () => {
    const request: AgentRequest = {
      agentId: 'lab-director',
      input: 'Create a button',
      context: { locale: 'fr' },
      options: {
        stream: false,
        maxTokens: 1000,
        temperature: 0.7,
        budgetUsd: 0.5,
      },
    };

    const response = await runAgent(request);

    expect(response.requestId).toBeDefined();
    expect(response.agentId).toBe('lab-director');
    expect(response.status).toBe('success');
    expect(response.output.length).toBeGreaterThan(0);
    expect(response.steps).toHaveLength(1);
    expect(response.metadata.tokensUsed).toBeGreaterThan(0);
    expect(response.metadata.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('handles different agent types', async () => {
    const agents = ['devops', 'ui-generator', 'docs-writer'] as const;

    for (const agentId of agents) {
      const response = await runAgent({
        agentId,
        input: 'Test',
        context: { locale: 'fr' },
        options: {
          stream: false,
          maxTokens: 1000,
          temperature: 0.7,
          budgetUsd: 0.5,
        },
      });
      expect(response.agentId).toBe(agentId);
      expect(response.status).toBe('success');
    }
  });
});

describe('Orchestrator — runPipeline', () => {
  it('executes default 8-agent pipeline end-to-end', async () => {
    const result = await runPipeline('Create a dashboard card');

    expect(result.status).toBe('success');
    expect(result.responses).toHaveLength(8);
    expect(result.totalTokensUsed).toBeGreaterThan(0);
    expect(result.totalCostUsd).toBeGreaterThan(0);
    expect(result.plan.steps).toHaveLength(8);

    // All steps should be success
    expect(result.plan.steps.every((s) => s.status === 'success')).toBe(true);
  });

  it('respects budget cap and skips steps', async () => {
    const result = await runPipeline(
      'Create a card',
      ['lab-director', 'devops', 'ui-generator'],
      {
        stream: false,
        maxTokens: 1000,
        temperature: 0.7,
        budgetUsd: 0.0000001, // Basically zero — first step will consume it
      }
    );

    // First step should succeed, subsequent should skip
    const statusCounts = result.plan.steps.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    expect(statusCounts.skipped).toBeGreaterThan(0);
  });

  it('executes custom pipeline with subset of agents', async () => {
    const result = await runPipeline('Test', ['devops', 'docs-writer']);

    expect(result.responses).toHaveLength(2);
    expect(result.responses[0]?.agentId).toBe('devops');
    expect(result.responses[1]?.agentId).toBe('docs-writer');
  });

  it('output of previous agent flows to next agent context', async () => {
    const result = await runPipeline('Original objective', ['devops', 'ui-generator']);

    // The second agent's call should have received the first agent's output in context
    expect(result.plan.steps[1]?.input).toContain('Previous output');
  });
});
