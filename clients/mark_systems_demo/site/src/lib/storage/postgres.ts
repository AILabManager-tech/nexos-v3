/**
 * Postgres storage implementation via Drizzle ORM.
 * Used when DATABASE_URL is configured.
 */
import { eq, desc, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { runs, agentCalls, users } from '@/lib/db';
import type {
  RunStorage,
  UserStorage,
  StoredRun,
  StoredAgentCall,
  StoredUser,
} from './types';
import { AgentIdSchema } from '@/agents/types';

function requireDb() {
  const db = getDb();
  if (!db) {
    throw new Error('[storage/postgres] DATABASE_URL not configured');
  }
  return db;
}

// Helpers to convert between DB types (decimals are strings in Drizzle) and domain types
function toStoredRun(row: typeof runs.$inferSelect): StoredRun {
  return {
    id: row.id,
    userId: row.userId,
    objective: row.objective,
    plan: row.plan,
    status: row.status,
    totalCostUsd: Number(row.totalCostUsd),
    totalTokensUsed: row.totalTokensUsed,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
  };
}

function toStoredAgentCall(row: typeof agentCalls.$inferSelect): StoredAgentCall {
  // Validate enum value instead of blind cast — protects against schema drift.
  return {
    id: row.id,
    runId: row.runId,
    agentId: AgentIdSchema.parse(row.agentId),
    stepOrder: row.stepOrder,
    input: row.input,
    output: row.output,
    error: row.error,
    model: row.model,
    provider: row.provider,
    tokensUsed: row.tokensUsed,
    costUsd: Number(row.costUsd),
    durationMs: row.durationMs,
    soicScore: row.soicScore !== null ? Number(row.soicScore) : null,
    createdAt: row.createdAt,
  };
}

function toStoredUser(row: typeof users.$inferSelect): StoredUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    quotaUsdRemaining: Number(row.quotaUsdRemaining),
    quotaResetAt: row.quotaResetAt,
    createdAt: row.createdAt,
  };
}

export const postgresRunStorage: RunStorage = {
  async createRun({ userId, objective, plan }) {
    const db = requireDb();
    const [row] = await db
      .insert(runs)
      .values({
        userId,
        objective,
        plan,
        status: 'pending',
      })
      .returning();
    if (!row) throw new Error('Failed to create run');
    return toStoredRun(row);
  },

  async updateRun(id, params) {
    const db = requireDb();
    const updates: Record<string, unknown> = {};
    if (params.status !== undefined) updates.status = params.status;
    if (params.totalCostUsd !== undefined)
      updates.totalCostUsd = params.totalCostUsd.toString();
    if (params.totalTokensUsed !== undefined)
      updates.totalTokensUsed = params.totalTokensUsed;
    if (params.completedAt !== undefined) updates.completedAt = params.completedAt;

    const [row] = await db.update(runs).set(updates).where(eq(runs.id, id)).returning();
    return row ? toStoredRun(row) : null;
  },

  async getRun(id) {
    const db = requireDb();
    const [row] = await db.select().from(runs).where(eq(runs.id, id)).limit(1);
    return row ? toStoredRun(row) : null;
  },

  async listRuns({ userId, limit = 50, offset = 0 }) {
    const db = requireDb();
    const base = db.select().from(runs);
    const query = userId !== undefined ? base.where(eq(runs.userId, userId)) : base;
    const rows = await query.orderBy(desc(runs.startedAt)).limit(limit).offset(offset);
    return rows.map(toStoredRun);
  },

  async addAgentCall(call) {
    const db = requireDb();
    const [row] = await db
      .insert(agentCalls)
      .values({
        runId: call.runId,
        agentId: call.agentId,
        stepOrder: call.stepOrder,
        input: call.input,
        output: call.output,
        error: call.error,
        model: call.model,
        provider: call.provider,
        tokensUsed: call.tokensUsed,
        costUsd: call.costUsd.toString(),
        durationMs: call.durationMs,
        soicScore: call.soicScore !== null ? call.soicScore.toString() : null,
      })
      .returning();
    if (!row) throw new Error('Failed to add agent call');
    return toStoredAgentCall(row);
  },

  async listAgentCalls(runId) {
    const db = requireDb();
    const rows = await db
      .select()
      .from(agentCalls)
      .where(eq(agentCalls.runId, runId))
      .orderBy(agentCalls.stepOrder);
    return rows.map(toStoredAgentCall);
  },
};

export const postgresUserStorage: UserStorage = {
  async getOrCreateUser({ email, name }) {
    const db = requireDb();
    if (email) {
      const existing = await this.getUserByEmail(email);
      if (existing) return existing;
    }
    const [row] = await db
      .insert(users)
      .values({
        email: email ?? null,
        name: name ?? null,
      })
      .returning();
    if (!row) throw new Error('Failed to create user');
    return toStoredUser(row);
  },

  async getUser(id) {
    const db = requireDb();
    const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return row ? toStoredUser(row) : null;
  },

  async getUserByEmail(email) {
    const db = requireDb();
    const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return row ? toStoredUser(row) : null;
  },

  async decrementQuota(userId, amountUsd) {
    // Atomic SQL update with GREATEST() to avoid TOCTOU race condition.
    // Two concurrent calls cannot double-spend because the subtraction
    // happens inside a single UPDATE statement.
    const db = requireDb();
    const [row] = await db
      .update(users)
      .set({
        quotaUsdRemaining: sql`GREATEST(0, ${users.quotaUsdRemaining}::numeric - ${amountUsd.toString()}::numeric)`,
      })
      .where(eq(users.id, userId))
      .returning();
    return row ? toStoredUser(row) : null;
  },

  async resetQuota(userId, amountUsd) {
    const db = requireDb();
    const [row] = await db
      .update(users)
      .set({
        quotaUsdRemaining: amountUsd.toString(),
        quotaResetAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return row ? toStoredUser(row) : null;
  },
};
