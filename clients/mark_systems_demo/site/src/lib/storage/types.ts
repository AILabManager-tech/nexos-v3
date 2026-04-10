/**
 * Storage abstraction types.
 *
 * Defines the public contract for run and user storage.
 * Implementations can target Postgres, in-memory, Redis, etc.
 */
import type { AgentId } from '@/agents/types';

export interface StoredAgentCall {
  id: string;
  runId: string;
  agentId: AgentId;
  stepOrder: number;
  input: string;
  output: string | null;
  error: string | null;
  model: string;
  provider: string;
  tokensUsed: number;
  costUsd: number;
  durationMs: number;
  soicScore: number | null;
  createdAt: Date;
}

export interface StoredRun {
  id: string;
  userId: string | null;
  objective: string;
  plan: unknown;
  status: 'pending' | 'running' | 'success' | 'error' | 'partial';
  totalCostUsd: number;
  totalTokensUsed: number;
  startedAt: Date;
  completedAt: Date | null;
}

export interface StoredUser {
  id: string;
  email: string | null;
  name: string | null;
  quotaUsdRemaining: number;
  quotaResetAt: Date | null;
  createdAt: Date;
}

export interface RunStorage {
  createRun(params: {
    userId: string | null;
    objective: string;
    plan: unknown;
  }): Promise<StoredRun>;

  updateRun(
    id: string,
    params: Partial<Pick<StoredRun, 'status' | 'totalCostUsd' | 'totalTokensUsed' | 'completedAt'>>
  ): Promise<StoredRun | null>;

  getRun(id: string): Promise<StoredRun | null>;

  listRuns(params: {
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<StoredRun[]>;

  addAgentCall(call: Omit<StoredAgentCall, 'id' | 'createdAt'>): Promise<StoredAgentCall>;

  listAgentCalls(runId: string): Promise<StoredAgentCall[]>;
}

export interface UserStorage {
  getOrCreateUser(params: { email?: string; name?: string }): Promise<StoredUser>;
  getUser(id: string): Promise<StoredUser | null>;
  getUserByEmail(email: string): Promise<StoredUser | null>;
  decrementQuota(userId: string, amountUsd: number): Promise<StoredUser | null>;
  resetQuota(userId: string, amountUsd: number): Promise<StoredUser | null>;
}
