/**
 * Database client with lazy initialization and environment detection.
 *
 * Strategy:
 * - If DATABASE_URL is set → real Postgres via `postgres` driver + Drizzle ORM
 * - If not set → returns `null` so storage layer falls back to in-memory
 *
 * This allows the app to run locally without a DB, while production uses Postgres.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let cachedDb: DrizzleDb | null | undefined;

/**
 * Get the database client (singleton).
 * Returns null if DATABASE_URL is not set — callers should handle this.
 */
export function getDb(): DrizzleDb | null {
  if (cachedDb !== undefined) {
    return cachedDb;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    cachedDb = null;
    return null;
  }

  try {
    const client = postgres(connectionString, {
      max: 1, // Serverless — single connection per function
      idle_timeout: 20,
      connect_timeout: 10,
    });
    cachedDb = drizzle(client, { schema });
    return cachedDb;
  } catch (error) {
    console.error('[db] Failed to connect:', error);
    cachedDb = null;
    return null;
  }
}

/**
 * Check if a DB is available without initializing it.
 */
export function hasDb(): boolean {
  return !!process.env.DATABASE_URL;
}

export { schema };
export type { DrizzleDb };
