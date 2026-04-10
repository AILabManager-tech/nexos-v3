/**
 * Server-Sent Events utilities for agent streaming.
 *
 * Events emitted by the orchestrator:
 * - `plan` — initial orchestration plan
 * - `step-start` — agent step beginning
 * - `text-delta` — streamed content chunk
 * - `step-end` — agent step finished with metadata
 * - `finish` — pipeline complete with totals
 * - `error` — unrecoverable error
 */

export type SseEvent =
  | { type: 'plan'; plan: unknown }
  | { type: 'step-start'; agentId: string; order: number }
  | { type: 'text-delta'; agentId: string; text: string }
  | {
      type: 'step-end';
      agentId: string;
      order: number;
      tokensUsed: number;
      costUsd: number;
      durationMs: number;
      model: string;
      provider: string;
    }
  | {
      type: 'finish';
      runId: string;
      totalTokensUsed: number;
      totalCostUsd: number;
      status: 'success' | 'partial' | 'error';
    }
  | { type: 'error'; error: string };

/**
 * Encode an event for the SSE protocol.
 * Format: `event: <type>\ndata: <json>\n\n`
 */
export function encodeSseEvent(event: SseEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

/**
 * Create a ReadableStream from an async generator of SSE events.
 */
export function eventsToStream(
  generator: AsyncGenerator<SseEvent, void, unknown>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of generator) {
          controller.enqueue(encoder.encode(encodeSseEvent(event)));
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        controller.enqueue(
          encoder.encode(encodeSseEvent({ type: 'error', error: reason }))
        );
      } finally {
        controller.close();
      }
    },
  });
}

export const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no', // Disable nginx buffering
} as const;
