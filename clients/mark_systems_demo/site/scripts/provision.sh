#!/usr/bin/env bash
# Mark Systems — External services provisioning helper.
#
# Usage:
#   ./scripts/provision.sh [step]
#
# Steps:
#   db              Run Drizzle migrations against DATABASE_URL
#   env-anthropic   Add ANTHROPIC_API_KEY to Vercel env (prompts)
#   env-auth        Generate + add NEXTAUTH_SECRET
#   env-db          Add DATABASE_URL to Vercel env (prompts)
#   verify          Verify all expected env vars are present
#   all             Run every applicable step (requires interactive input)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

STEP="${1:-verify}"

step_db() {
  echo "[provision] Running Drizzle migrations..."
  if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "[provision] ERROR: DATABASE_URL not set in environment."
    echo "[provision] Export it first: export DATABASE_URL='postgresql://...'"
    return 1
  fi
  npx drizzle-kit migrate
  echo "[provision] Migrations applied."
}

step_env_anthropic() {
  echo "[provision] Adding ANTHROPIC_API_KEY to Vercel env..."
  echo "[provision] Paste your key (starts with sk-ant-):"
  vercel env add ANTHROPIC_API_KEY production
  vercel env add ANTHROPIC_API_KEY preview
}

step_env_auth() {
  echo "[provision] Generating NEXTAUTH_SECRET..."
  SECRET=$(openssl rand -base64 32)
  echo "[provision] Generated: ${SECRET:0:8}...${SECRET: -4}"
  echo "$SECRET" | vercel env add NEXTAUTH_SECRET production
  echo "$SECRET" | vercel env add NEXTAUTH_SECRET preview
}

step_env_db() {
  echo "[provision] Adding DATABASE_URL to Vercel env..."
  echo "[provision] Paste your Postgres connection string:"
  vercel env add DATABASE_URL production
  vercel env add DATABASE_URL preview
}

step_verify() {
  echo "[provision] Verifying Vercel env vars..."
  vercel env ls production 2>&1 | grep -E "^(ANTHROPIC_API_KEY|NEXTAUTH_SECRET|DATABASE_URL|GENCORE_URL|NEXT_PUBLIC_BASE_URL)" || {
    echo "[provision] Some env vars missing. Run ./scripts/provision.sh all"
    return 1
  }
  echo "[provision] All expected env vars present."
}

case "$STEP" in
  db)            step_db ;;
  env-anthropic) step_env_anthropic ;;
  env-auth)      step_env_auth ;;
  env-db)        step_env_db ;;
  verify)        step_verify ;;
  all)
    step_env_auth
    step_env_anthropic
    echo "[provision] Set DATABASE_URL manually via dashboard or with:"
    echo "  vercel env add DATABASE_URL production"
    step_verify
    ;;
  *)
    echo "Usage: $0 [db|env-anthropic|env-auth|env-db|verify|all]"
    exit 1
    ;;
esac
