import { describe, it, expect, beforeEach } from 'vitest';
import { memoryRunStorage, memoryUserStorage } from './memory';

describe('Memory Run Storage', () => {
  it('creates a run with pending status', async () => {
    const run = await memoryRunStorage.createRun({
      userId: null,
      objective: 'Test objective',
      plan: { steps: [] },
    });

    expect(run.id).toBeDefined();
    expect(run.status).toBe('pending');
    expect(run.totalCostUsd).toBe(0);
    expect(run.objective).toBe('Test objective');
  });

  it('updates run status and totals', async () => {
    const run = await memoryRunStorage.createRun({
      userId: null,
      objective: 'Test',
      plan: {},
    });

    const updated = await memoryRunStorage.updateRun(run.id, {
      status: 'success',
      totalCostUsd: 0.42,
      totalTokensUsed: 1500,
      completedAt: new Date(),
    });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('success');
    expect(updated?.totalCostUsd).toBe(0.42);
    expect(updated?.totalTokensUsed).toBe(1500);
    expect(updated?.completedAt).toBeInstanceOf(Date);
  });

  it('returns null when updating non-existent run', async () => {
    const result = await memoryRunStorage.updateRun('nonexistent', { status: 'success' });
    expect(result).toBeNull();
  });

  it('lists runs sorted by startedAt desc', async () => {
    const run1 = await memoryRunStorage.createRun({ userId: null, objective: 'First', plan: {} });
    await new Promise((resolve) => setTimeout(resolve, 5));
    const run2 = await memoryRunStorage.createRun({ userId: null, objective: 'Second', plan: {} });

    const list = await memoryRunStorage.listRuns({ limit: 10 });
    const ids = list.map((r) => r.id);
    expect(ids.indexOf(run2.id)).toBeLessThan(ids.indexOf(run1.id));
  });

  it('adds and lists agent calls in order', async () => {
    const run = await memoryRunStorage.createRun({
      userId: null,
      objective: 'Test',
      plan: {},
    });

    await memoryRunStorage.addAgentCall({
      runId: run.id,
      agentId: 'devops',
      stepOrder: 1,
      input: 'in1',
      output: 'out1',
      error: null,
      model: 'claude-sonnet-4.6',
      provider: 'mock',
      tokensUsed: 100,
      costUsd: 0.01,
      durationMs: 200,
      soicScore: null,
    });

    await memoryRunStorage.addAgentCall({
      runId: run.id,
      agentId: 'ui-generator',
      stepOrder: 2,
      input: 'in2',
      output: 'out2',
      error: null,
      model: 'claude-sonnet-4.6',
      provider: 'mock',
      tokensUsed: 200,
      costUsd: 0.02,
      durationMs: 400,
      soicScore: null,
    });

    const calls = await memoryRunStorage.listAgentCalls(run.id);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.agentId).toBe('devops');
    expect(calls[1]?.agentId).toBe('ui-generator');
  });
});

describe('Memory User Storage', () => {
  it('creates a new user with default quota', async () => {
    const user = await memoryUserStorage.getOrCreateUser({
      email: `test-${Math.random()}@example.com`,
    });

    expect(user.id).toBeDefined();
    expect(user.quotaUsdRemaining).toBe(5.0);
  });

  it('returns existing user when getOrCreate called twice with same email', async () => {
    const email = `repeat-${Math.random()}@example.com`;
    const first = await memoryUserStorage.getOrCreateUser({ email });
    const second = await memoryUserStorage.getOrCreateUser({ email });

    expect(first.id).toBe(second.id);
  });

  it('decrements quota correctly', async () => {
    const user = await memoryUserStorage.getOrCreateUser({
      email: `quota-${Math.random()}@example.com`,
    });

    const updated = await memoryUserStorage.decrementQuota(user.id, 1.5);
    expect(updated?.quotaUsdRemaining).toBe(3.5);

    const updated2 = await memoryUserStorage.decrementQuota(user.id, 10);
    expect(updated2?.quotaUsdRemaining).toBe(0); // Floor at 0
  });

  it('resets quota to specified amount', async () => {
    const user = await memoryUserStorage.getOrCreateUser({
      email: `reset-${Math.random()}@example.com`,
    });

    await memoryUserStorage.decrementQuota(user.id, 3);
    const reset = await memoryUserStorage.resetQuota(user.id, 10);

    expect(reset?.quotaUsdRemaining).toBe(10);
    expect(reset?.quotaResetAt).toBeInstanceOf(Date);
  });
});
