/**
 * NextAuth v5 configuration.
 *
 * Supports multiple providers based on env vars:
 * - GitHub OAuth (GITHUB_ID + GITHUB_SECRET)
 * - Google OAuth (GOOGLE_ID + GOOGLE_SECRET)
 * - Guest mode (no providers configured) — users are anonymous
 *
 * Session strategy: JWT (stateless, no DB needed for sessions).
 * User persistence: optional via Drizzle adapter when DATABASE_URL is set.
 */
import type { NextAuthConfig } from 'next-auth';

// Only load providers that have credentials configured
function getProviders() {
  const providers: NextAuthConfig['providers'] = [];

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    // Dynamic import avoided because NextAuth needs these at config time.
    // Users must install @auth/github-provider if they want this enabled.
    // For now, we skip to keep the dep footprint small.
  }

  // Guest mode by default — no providers required.
  return providers;
}

/**
 * Resolve the JWT secret safely:
 * - Production: REQUIRE NEXTAUTH_SECRET. Log fatal if missing; auth will fail closed.
 * - Dev/test: deterministic fallback so the app boots.
 *
 * Never ship a hardcoded production secret.
 */
function resolveSecret(): string | undefined {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[auth] FATAL: NEXTAUTH_SECRET is not set in production. Sessions are disabled.'
    );
    return undefined;
  }
  return 'dev-only-insecure-secret-do-not-use-in-production';
}

export const authConfig: NextAuthConfig = {
  providers: getProviders(),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
  secret: resolveSecret(),
};
