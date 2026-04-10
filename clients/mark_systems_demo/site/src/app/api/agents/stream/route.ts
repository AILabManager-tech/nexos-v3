/**
 * POST /api/agents/stream
 *
 * Streaming pipeline execution with Server-Sent Events.
 *
 * Body: { objective: string, budgetUsd?: number, maxTokens?: number }
 *
 * Response: text/event-stream with events:
 *   plan, step-start, text-delta, step-end, finish, error
 */
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { streamPipeline } from '@/agents/orchestrator-stream';
import { eventsToStream, SSE_HEADERS } from '@/agents/streaming/sse';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const BodySchema = z.object({
  objective: z.string().min(5).max(2000),
  budgetUsd: z.number().positive().max(5).optional(),
  maxTokens: z.number().int().min(100).max(16000).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export async function POST(request: NextRequest) {
  // Rate limit
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`agents:stream:${ip}`);
  if (!limit.success) {
    return new Response(
      JSON.stringify({ error: 'rate_limited', resetAt: limit.resetAt }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'invalid_body', details: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get user session (optional — guest mode allowed)
  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;

  // Create the SSE stream
  const stream = eventsToStream(
    streamPipeline({
      objective: parsed.data.objective,
      userId,
      budgetUsd: parsed.data.budgetUsd,
      maxTokens: parsed.data.maxTokens,
      temperature: parsed.data.temperature,
    })
  );

  return new Response(stream, { headers: SSE_HEADERS });
}
