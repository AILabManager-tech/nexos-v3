/**
 * Public API for the database module.
 * Consumers should only import from '@/lib/db', not the internals.
 */
export { getDb, hasDb, schema } from './client';
export type { DrizzleDb } from './client';
export {
  users,
  runs,
  agentCalls,
  runStatusEnum,
  agentIdEnum,
  usersRelations,
  runsRelations,
  agentCallsRelations,
} from './schema';
export type {
  User,
  NewUser,
  Run,
  NewRun,
  AgentCall,
  NewAgentCall,
} from './schema';
