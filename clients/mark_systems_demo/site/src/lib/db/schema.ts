/**
 * Drizzle schema for Mark Systems Mega-Lab.
 *
 * Modular: each table is self-contained with its own relations.
 * Usable with Vercel Postgres, Neon, Supabase, or any standard Postgres.
 */
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  decimal,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// Enums
// ============================================================

export const runStatusEnum = pgEnum('run_status', [
  'pending',
  'running',
  'success',
  'error',
  'partial',
]);

export const agentIdEnum = pgEnum('agent_id', [
  'lab-director',
  'devops',
  'ui-generator',
  'content-curator',
  'docs-writer',
  'business-strategist',
  'showroom-publisher',
  'deploy-sentinel',
]);

// ============================================================
// Users (auth + quota)
// ============================================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').unique(),
    name: text('name'),
    image: text('image'),
    emailVerified: timestamp('email_verified', { mode: 'date' }),

    // Quota tracking
    quotaUsdRemaining: decimal('quota_usd_remaining', {
      precision: 10,
      scale: 4,
    })
      .notNull()
      .default('5.0000'),
    quotaResetAt: timestamp('quota_reset_at', { mode: 'date' }),

    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  runs: many(runs),
}));

// ============================================================
// Runs (orchestration executions)
// ============================================================

export const runs = pgTable(
  'runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),

    objective: text('objective').notNull(),
    plan: jsonb('plan').notNull(),
    status: runStatusEnum('status').notNull().default('pending'),

    totalCostUsd: decimal('total_cost_usd', { precision: 10, scale: 4 })
      .notNull()
      .default('0'),
    totalTokensUsed: integer('total_tokens_used').notNull().default(0),

    startedAt: timestamp('started_at', { mode: 'date' }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { mode: 'date' }),
  },
  (table) => ({
    userIdx: index('runs_user_idx').on(table.userId),
    statusIdx: index('runs_status_idx').on(table.status),
    startedAtIdx: index('runs_started_at_idx').on(table.startedAt),
  })
);

export const runsRelations = relations(runs, ({ one, many }) => ({
  user: one(users, {
    fields: [runs.userId],
    references: [users.id],
  }),
  agentCalls: many(agentCalls),
}));

// ============================================================
// Agent calls (individual LLM invocations within a run)
// ============================================================

export const agentCalls = pgTable(
  'agent_calls',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    runId: uuid('run_id')
      .notNull()
      .references(() => runs.id, { onDelete: 'cascade' }),

    agentId: agentIdEnum('agent_id').notNull(),
    stepOrder: integer('step_order').notNull(),

    input: text('input').notNull(),
    output: text('output'),
    error: text('error'),

    model: text('model').notNull(),
    provider: text('provider').notNull(),
    tokensUsed: integer('tokens_used').notNull().default(0),
    costUsd: decimal('cost_usd', { precision: 10, scale: 6 }).notNull().default('0'),
    durationMs: integer('duration_ms').notNull().default(0),
    soicScore: decimal('soic_score', { precision: 3, scale: 1 }),

    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    runIdx: index('agent_calls_run_idx').on(table.runId),
    agentIdx: index('agent_calls_agent_idx').on(table.agentId),
  })
);

export const agentCallsRelations = relations(agentCalls, ({ one }) => ({
  run: one(runs, {
    fields: [agentCalls.runId],
    references: [runs.id],
  }),
}));

// ============================================================
// Type exports for TypeScript consumers
// ============================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Run = typeof runs.$inferSelect;
export type NewRun = typeof runs.$inferInsert;
export type AgentCall = typeof agentCalls.$inferSelect;
export type NewAgentCall = typeof agentCalls.$inferInsert;
