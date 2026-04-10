/**
 * In-memory storage implementation.
 *
 * Used when no DATABASE_URL is configured.
 * Not suitable for production — data is lost on server restart / serverless cold start.
 * Good for demos, tests, and local dev.
 */
import { randomUUID } from 'node:crypto';
import type {
  RunStorage,
  UserStorage,
  StoredRun,
  StoredAgentCall,
  StoredUser,
} from './types';

const DEFAULT_QUOTA_USD = 5.0;

// Module-level state (singleton per process)
const runs = new Map<string, StoredRun>();
const agentCalls = new Map<string, StoredAgentCall[]>();
const users = new Map<string, StoredUser>();
const usersByEmail = new Map<string, string>();

export const memoryRunStorage: RunStorage = {
  async createRun({ userId, objective, plan }) {
    const run: StoredRun = {
      id: randomUUID(),
      userId,
      objective,
      plan,
      status: 'pending',
      totalCostUsd: 0,
      totalTokensUsed: 0,
      startedAt: new Date(),
      completedAt: null,
    };
    runs.set(run.id, run);
    agentCalls.set(run.id, []);
    return run;
  },

  async updateRun(id, params) {
    const run = runs.get(id);
    if (!run) return null;
    const updated = { ...run, ...params };
    runs.set(id, updated);
    return updated;
  },

  async getRun(id) {
    return runs.get(id) ?? null;
  },

  async listRuns({ userId, limit = 50, offset = 0 }) {
    let list = Array.from(runs.values());
    if (userId !== undefined) {
      list = list.filter((r) => r.userId === userId);
    }
    list.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    return list.slice(offset, offset + limit);
  },

  async addAgentCall(call) {
    const stored: StoredAgentCall = {
      ...call,
      id: randomUUID(),
      createdAt: new Date(),
    };
    const list = agentCalls.get(call.runId) ?? [];
    list.push(stored);
    agentCalls.set(call.runId, list);
    return stored;
  },

  async listAgentCalls(runId) {
    return agentCalls.get(runId) ?? [];
  },
};

export const memoryUserStorage: UserStorage = {
  async getOrCreateUser({ email, name }) {
    if (email && usersByEmail.has(email)) {
      const id = usersByEmail.get(email);
      if (id) {
        const existing = users.get(id);
        if (existing) return existing;
      }
    }

    const user: StoredUser = {
      id: randomUUID(),
      email: email ?? null,
      name: name ?? null,
      quotaUsdRemaining: DEFAULT_QUOTA_USD,
      quotaResetAt: null,
      createdAt: new Date(),
    };
    users.set(user.id, user);
    if (email) usersByEmail.set(email, user.id);
    return user;
  },

  async getUser(id) {
    return users.get(id) ?? null;
  },

  async getUserByEmail(email) {
    const id = usersByEmail.get(email);
    if (!id) return null;
    return users.get(id) ?? null;
  },

  async decrementQuota(userId, amountUsd) {
    const user = users.get(userId);
    if (!user) return null;
    const updated = {
      ...user,
      quotaUsdRemaining: Math.max(0, user.quotaUsdRemaining - amountUsd),
    };
    users.set(userId, updated);
    return updated;
  },

  async resetQuota(userId, amountUsd) {
    const user = users.get(userId);
    if (!user) return null;
    const updated = {
      ...user,
      quotaUsdRemaining: amountUsd,
      quotaResetAt: new Date(),
    };
    users.set(userId, updated);
    return updated;
  },
};
