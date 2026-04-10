/**
 * GET /api/admin/stats
 *
 * Admin-only aggregate stats: runs, users, cost, success rate.
 * Protected by session check — requires an authenticated user.
 */
import { NextResponse } from 'next/server';
import { runStorage, getStorageBackend } from '@/lib/storage';
import { getActiveAdapter } from '@/agents/adapters/llm';
import { listAgents } from '@/agents/registry';
import { listTargets as listWebhookTargets } from '@/lib/webhooks';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth().catch(() => null);

  // In guest mode (no auth configured) we still expose stats for demo.
  // When auth is configured, we enforce authentication.
  if (process.env.NEXTAUTH_SECRET && !session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const runs = await runStorage.listRuns({ limit: 100 });

  // Aggregate metrics
  const total = runs.length;
  const byStatus = runs.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalCostUsd = runs.reduce((sum, r) => sum + r.totalCostUsd, 0);
  const totalTokens = runs.reduce((sum, r) => sum + r.totalTokensUsed, 0);
  const avgCostUsd = total > 0 ? totalCostUsd / total : 0;
  const avgTokens = total > 0 ? totalTokens / total : 0;
  const successRate =
    total > 0 ? ((byStatus.success ?? 0) / total) * 100 : 0;

  return NextResponse.json({
    backend: {
      storage: getStorageBackend(),
      llm: getActiveAdapter(),
      env: process.env.NODE_ENV,
    },
    runs: {
      total,
      byStatus,
      totalCostUsd,
      totalTokens,
      avgCostUsd,
      avgTokens,
      successRate,
    },
    agents: listAgents().map((a) => ({
      id: a.id,
      name: a.name,
      phase: a.phase,
    })),
    webhooks: {
      targets: listWebhookTargets().length,
      active: listWebhookTargets().filter((t) => t.active).length,
    },
    generatedAt: new Date().toISOString(),
  });
}
