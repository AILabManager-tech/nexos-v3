#!/usr/bin/env bash
# Gencore deployment helper.
#
# Usage:
#   ./deploy.sh [fly|railway|local]
#
# Requires:
#   - Gencore source at GENCORE_SOURCE (default: ~/projects/gearforge/gencore)
#   - flyctl or railway CLI installed (for remote deploys)
#   - .env.gencore with GENCORE_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY

set -euo pipefail

TARGET="${1:-local}"
GENCORE_SOURCE="${GENCORE_SOURCE:-$HOME/projects/gearforge/gencore}"
INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -d "$GENCORE_SOURCE" ]]; then
  echo "[deploy] ERROR: Gencore source not found at $GENCORE_SOURCE"
  echo "[deploy] Set GENCORE_SOURCE env var to override."
  exit 1
fi

echo "[deploy] Target: $TARGET"
echo "[deploy] Gencore source: $GENCORE_SOURCE"

# Copy Dockerfile into Gencore source for the build context
cp "$INFRA_DIR/Dockerfile" "$GENCORE_SOURCE/Dockerfile.marksystems"

case "$TARGET" in
  local)
    echo "[deploy] Building local Docker image..."
    cd "$GENCORE_SOURCE"
    docker build -t mark-systems-gencore -f Dockerfile.marksystems .
    echo ""
    echo "[deploy] Run locally:"
    echo "  docker run -p 8080:8080 --env-file .env.gencore mark-systems-gencore"
    ;;

  fly)
    echo "[deploy] Deploying to Fly.io..."
    cp "$INFRA_DIR/fly.toml" "$GENCORE_SOURCE/fly.toml"
    cd "$GENCORE_SOURCE"

    if ! command -v fly &> /dev/null; then
      echo "[deploy] ERROR: flyctl not installed. Install from https://fly.io/install.sh"
      exit 1
    fi

    if [[ ! -f .env.gencore ]]; then
      echo "[deploy] WARNING: .env.gencore not found. Set secrets manually with 'fly secrets set'."
    fi

    fly deploy --dockerfile Dockerfile.marksystems
    echo ""
    echo "[deploy] Set GENCORE_URL in Vercel:"
    echo "  vercel env add GENCORE_URL production"
    echo "  Value: https://mark-systems-gencore.fly.dev"
    ;;

  railway)
    echo "[deploy] Deploying to Railway..."
    cp "$INFRA_DIR/railway.json" "$GENCORE_SOURCE/railway.json"
    cd "$GENCORE_SOURCE"

    if ! command -v railway &> /dev/null; then
      echo "[deploy] ERROR: railway CLI not installed."
      echo "[deploy] Install: curl -fsSL https://railway.app/install.sh | sh"
      exit 1
    fi

    railway up --detach
    ;;

  *)
    echo "[deploy] Unknown target: $TARGET"
    echo "[deploy] Usage: $0 [local|fly|railway]"
    exit 1
    ;;
esac

echo "[deploy] Done."
