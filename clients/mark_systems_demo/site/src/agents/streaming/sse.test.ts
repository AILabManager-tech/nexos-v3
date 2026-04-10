import { describe, it, expect } from 'vitest';
import { encodeSseEvent, eventsToStream, type SseEvent } from './sse';

describe('SSE encoder', () => {
  it('encodes a plan event correctly', () => {
    const event: SseEvent = { type: 'plan', plan: { id: '123', steps: [] } };
    const encoded = encodeSseEvent(event);
    expect(encoded).toContain('event: plan');
    expect(encoded).toContain('data: ');
    expect(encoded.endsWith('\n\n')).toBe(true);
  });

  it('encodes text-delta events', () => {
    const event: SseEvent = { type: 'text-delta', agentId: 'devops', text: 'hello' };
    const encoded = encodeSseEvent(event);
    expect(encoded).toContain('event: text-delta');
    expect(encoded).toContain('"text":"hello"');
  });

  it('encodes error events', () => {
    const event: SseEvent = { type: 'error', error: 'test error' };
    const encoded = encodeSseEvent(event);
    expect(encoded).toContain('event: error');
    expect(encoded).toContain('test error');
  });
});

describe('eventsToStream', () => {
  it('converts async generator to ReadableStream', async () => {
    async function* gen(): AsyncGenerator<SseEvent, void, unknown> {
      yield { type: 'step-start', agentId: 'devops', order: 1 };
      yield { type: 'text-delta', agentId: 'devops', text: 'chunk1' };
      yield {
        type: 'step-end',
        agentId: 'devops',
        order: 1,
        tokensUsed: 10,
        costUsd: 0.001,
        durationMs: 100,
        model: 'mock',
        provider: 'mock',
      };
    }

    const stream = eventsToStream(gen());
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value);
    }

    expect(accumulated).toContain('event: step-start');
    expect(accumulated).toContain('event: text-delta');
    expect(accumulated).toContain('event: step-end');
    expect(accumulated).toContain('chunk1');
  });

  it('handles errors in generator by yielding error event', async () => {
    async function* genWithError(): AsyncGenerator<SseEvent, void, unknown> {
      yield { type: 'step-start', agentId: 'devops', order: 1 };
      throw new Error('Generator failed');
    }

    const stream = eventsToStream(genWithError());
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value);
    }

    expect(accumulated).toContain('event: error');
    expect(accumulated).toContain('Generator failed');
  });
});
