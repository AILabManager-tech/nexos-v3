/**
 * Storage module — public API.
 *
 * Auto-selects the appropriate backend:
 * - Postgres via Drizzle when DATABASE_URL is set
 * - In-memory otherwise (dev/demo/tests)
 *
 * Consumers import from '@/lib/storage' only.
 */
import { hasDb } from '@/lib/db';
import { memoryRunStorage, memoryUserStorage } from './memory';
import { postgresRunStorage, postgresUserStorage } from './postgres';
import type { RunStorage, UserStorage } from './types';

export const runStorage: RunStorage = hasDb() ? postgresRunStorage : memoryRunStorage;
export const userStorage: UserStorage = hasDb() ? postgresUserStorage : memoryUserStorage;

export function getStorageBackend(): 'postgres' | 'memory' {
  return hasDb() ? 'postgres' : 'memory';
}

export type {
  RunStorage,
  UserStorage,
  StoredRun,
  StoredAgentCall,
  StoredUser,
} from './types';
