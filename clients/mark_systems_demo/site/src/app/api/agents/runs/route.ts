/**
 * GET /api/agents/runs
 *
 * List recent runs (filtered by user if authenticated).
 * Returns JSON array of StoredRun with metadata.
 */
import { NextRequest, NextResponse } from 'next/server';
import { runStorage } from '@/lib/storage';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await auth().catch(() => null);
  const userId = session?.user?.id;

  // Anonymous callers cannot enumerate runs. An empty list is returned
  // rather than exposing other users' objectives.
  if (!userId) {
    return NextResponse.json({ runs: [], count: 0 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get('limit') ?? '20', 10) || 20, 1),
    100
  );
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10) || 0, 0);

  const runs = await runStorage.listRuns({ userId, limit, offset });

  return NextResponse.json({
    runs: runs.map((r) => ({
      id: r.id,
      objective: r.objective,
      status: r.status,
      totalCostUsd: r.totalCostUsd,
      totalTokensUsed: r.totalTokensUsed,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
    })),
    count: runs.length,
  });
}
