import { NextRequest, NextResponse } from 'next/server';
import { AgentRequestSchema } from '@/agents/types';
import { runAgent, runPipeline } from '@/agents/orchestrator';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * POST /api/agents/run
 *
 * Body:
 *   { mode: 'single', agentId: string, input: string, options?: {...} }
 *   { mode: 'pipeline', objective: string, pipeline?: AgentId[], options?: {...} }
 *
 * Rate limiting:
 *   - Authenticated users: 3 requests / 15 min per user id
 *   - Guest (anonymous): 3 requests / 15 min per IP (tighter in practice)
 */
export async function POST(request: NextRequest) {
  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;

  // Scope rate limit by user id if authenticated, otherwise by IP
  const ip = getClientIp(request.headers);
  const rateLimitKey = userId ? `agents:user:${userId}` : `agents:ip:${ip}`;
  const limit = rateLimit(rateLimitKey);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: 'rate_limited', resetAt: limit.resetAt },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid_json' },
      { status: 400 }
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { success: false, error: 'invalid_body' },
      { status: 400 }
    );
  }

  const mode = (body as { mode?: string }).mode ?? 'single';

  if (mode === 'single') {
    const parsed = AgentRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const result = await runAgent(parsed.data);
    return NextResponse.json({ success: true, result });
  }

  if (mode === 'pipeline') {
    const objective = (body as { objective?: string }).objective;
    if (typeof objective !== 'string' || objective.length < 5) {
      return NextResponse.json(
        { success: false, error: 'missing_objective' },
        { status: 400 }
      );
    }
    const result = await runPipeline(objective);
    return NextResponse.json({ success: true, result });
  }

  return NextResponse.json(
    { success: false, error: 'unknown_mode' },
    { status: 400 }
  );
}

/**
 * GET /api/agents/run — list available agents.
 */
export async function GET() {
  const { listAgents } = await import('@/agents/registry');
  return NextResponse.json({
    agents: listAgents().map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      phase: a.phase,
      icon: a.icon,
      color: a.color,
      capabilities: a.capabilities,
      requires: a.requires,
    })),
  });
}
