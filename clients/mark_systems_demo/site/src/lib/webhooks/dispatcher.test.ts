import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registerTarget,
  listTargets,
  unregisterTarget,
  dispatch,
  sign,
} from './dispatcher';

describe('Webhook dispatcher', () => {
  beforeEach(() => {
    // Clear state between tests
    for (const t of listTargets()) {
      unregisterTarget(t.id);
    }
  });

  it('registers and lists targets', () => {
    const target = registerTarget({
      url: 'https://example.com/hook',
      events: ['pipeline.completed'],
      active: true,
    });
    expect(target.id).toMatch(/^whk_/);
    expect(listTargets()).toHaveLength(1);
  });

  it('unregisters targets', () => {
    const t = registerTarget({
      url: 'https://example.com/hook',
      events: ['pipeline.started'],
      active: true,
    });
    expect(unregisterTarget(t.id)).toBe(true);
    expect(listTargets()).toHaveLength(0);
  });

  it('signs payloads with HMAC-SHA256', () => {
    const sig = sign('secret-key-12345', 'body', 1234567890);
    expect(sig).toMatch(/^sha256=[a-f0-9]{64}$/);
  });

  it('generates consistent signatures for same input', () => {
    const sig1 = sign('secret', 'hello', 100);
    const sig2 = sign('secret', 'hello', 100);
    expect(sig1).toBe(sig2);
  });

  it('generates different signatures for different bodies', () => {
    const sig1 = sign('secret', 'a', 100);
    const sig2 = sign('secret', 'b', 100);
    expect(sig1).not.toBe(sig2);
  });

  it('dispatches to matching targets in parallel', async () => {
    let callCount = 0;
    const mockFetch = vi.fn(async () => {
      callCount++;
      return new Response('ok', { status: 200 });
    });
    vi.stubGlobal('fetch', mockFetch);

    registerTarget({
      url: 'https://a.example.com/hook',
      events: ['pipeline.completed'],
      active: true,
    });
    registerTarget({
      url: 'https://b.example.com/hook',
      events: ['pipeline.completed'],
      active: true,
    });

    const results = await dispatch('pipeline.completed', {
      runId: 'run-1',
      data: { objective: 'test' },
    });

    expect(results).toHaveLength(2);
    expect(callCount).toBe(2);
    expect(results.every((r) => r.status === 'success')).toBe(true);

    vi.unstubAllGlobals();
  });

  it('skips inactive targets', async () => {
    const mockFetch = vi.fn(async () => new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', mockFetch);

    registerTarget({
      url: 'https://inactive.example.com/hook',
      events: ['pipeline.completed'],
      active: false,
    });

    const results = await dispatch('pipeline.completed', {
      runId: 'run-1',
      data: {},
    });

    expect(results).toHaveLength(0);

    vi.unstubAllGlobals();
  });

  it('skips targets not subscribed to the event', async () => {
    const mockFetch = vi.fn(async () => new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', mockFetch);

    registerTarget({
      url: 'https://other.example.com/hook',
      events: ['pipeline.failed'],
      active: true,
    });

    const results = await dispatch('pipeline.started', {
      runId: 'run-1',
      data: {},
    });

    expect(results).toHaveLength(0);

    vi.unstubAllGlobals();
  });

  it('returns failed status on non-2xx response', async () => {
    const mockFetch = vi.fn(async () => new Response('', { status: 500 }));
    vi.stubGlobal('fetch', mockFetch);

    registerTarget({
      url: 'https://fail.example.com/hook',
      events: ['pipeline.completed'],
      active: true,
    });

    const results = await dispatch('pipeline.completed', {
      runId: 'run-1',
      data: {},
    });

    expect(results[0]?.status).toBe('failed');
    expect(results[0]?.httpStatus).toBe(500);

    vi.unstubAllGlobals();
  });
});
