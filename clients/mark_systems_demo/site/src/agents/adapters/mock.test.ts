import { describe, it, expect } from 'vitest';
import { mockGenerate, mockStream } from './mock';
import { getSystemPrompt } from '../prompts';

describe('Mock LLM Adapter', () => {
  it('generate returns stub for lab-director', async () => {
    const result = await mockGenerate({
      systemPrompt: getSystemPrompt('lab-director'),
      userPrompt: 'Create a button',
      model: 'claude-sonnet-4.6',
      temperature: 0.7,
      maxTokens: 1000,
    });

    expect(result.content.length).toBeGreaterThan(0);
    expect(result.tokensUsed).toBeGreaterThan(0);
    expect(result.costUsd).toBeGreaterThanOrEqual(0);
    expect(result.provider).toBe('mock');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('generate routes by agent type', async () => {
    const agents = ['devops', 'ui-generator', 'content-curator', 'docs-writer', 'business-strategist'] as const;
    const outputs = new Set<string>();

    for (const agentId of agents) {
      const result = await mockGenerate({
        systemPrompt: getSystemPrompt(agentId),
        userPrompt: 'Test',
        model: 'claude-sonnet-4.6',
        temperature: 0.7,
        maxTokens: 1000,
      });
      outputs.add(result.content);
    }

    // Each agent should have a distinct stub
    expect(outputs.size).toBe(agents.length);
  });

  it('stream yields text deltas then finish', async () => {
    const chunks: string[] = [];
    let finished = false;
    let finalTokens = 0;

    for await (const chunk of mockStream({
      systemPrompt: getSystemPrompt('devops'),
      userPrompt: 'Test',
      model: 'claude-sonnet-4.6',
      temperature: 0.7,
      maxTokens: 1000,
    })) {
      if (chunk.type === 'text-delta') {
        chunks.push(chunk.text);
      } else if (chunk.type === 'finish') {
        finished = true;
        finalTokens = chunk.tokensUsed;
      }
    }

    expect(chunks.length).toBeGreaterThan(0);
    expect(finished).toBe(true);
    expect(finalTokens).toBeGreaterThan(0);
  });

  it('cost scales with content length', async () => {
    const result = await mockGenerate({
      systemPrompt: getSystemPrompt('ui-generator'),
      userPrompt: 'Test',
      model: 'claude-sonnet-4.6',
      temperature: 0.7,
      maxTokens: 1000,
    });

    const expectedCost = (result.tokensUsed / 1_000_000) * 3;
    expect(result.costUsd).toBeCloseTo(expectedCost, 6);
  });
});
