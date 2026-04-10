import type { Config } from 'drizzle-kit';

/**
 * Drizzle Kit config for schema migrations.
 *
 * Usage:
 *   npx drizzle-kit generate   # Generate SQL migration from schema.ts
 *   npx drizzle-kit push       # Apply directly to DB (dev only)
 *   npx drizzle-kit migrate    # Run generated migrations (prod)
 *
 * Requires DATABASE_URL in .env.local or environment.
 */
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/marksystems',
  },
  verbose: true,
  strict: true,
} satisfies Config;
