# Gencore FastAPI gateway deployment for Mark Systems Mega-Lab.
#
# This Dockerfile packages the Gencore codebase (located at
# /home/gear-code/projects/gearforge/gencore on the dev machine) into
# a deployable container.
#
# Build locally:
#   docker build -t mark-systems-gencore -f infra/gencore/Dockerfile /path/to/gencore
#
# Deploy targets:
#   - Fly.io:    fly deploy --dockerfile infra/gencore/Dockerfile
#   - Railway:   railway up --dockerfile infra/gencore/Dockerfile
#   - Render:    (create new Web Service with Docker runtime)
#
# Required environment variables at runtime:
#   - GENCORE_API_KEY  (bearer token for auth from Next.js bridge)
#   - ANTHROPIC_API_KEY / OPENAI_API_KEY (for LLM providers)
#   - PORT (defaults to 8080)

FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8080

# System dependencies for Playwright + sentence-transformers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    ca-certificates \
    libnss3 \
    libxss1 \
    libasound2 \
    libgbm1 \
    libxdamage1 \
    libxcomposite1 \
    libxrandr2 \
    libatk1.0-0 \
    libcups2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Gencore source (build context must point to gencore repo)
COPY pyproject.toml requirements.txt* ./
RUN pip install --upgrade pip && \
    (pip install -e . 2>/dev/null || pip install -r requirements.txt 2>/dev/null || true)

COPY . .

# Install Playwright browsers (Chromium only for smaller image)
RUN pip install playwright 2>/dev/null || true && \
    playwright install chromium --with-deps 2>/dev/null || true

# Non-root user for security
RUN useradd -u 1001 -m gencore && chown -R gencore:gencore /app
USER gencore

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:${PORT}/v1/health || exit 1

# Entrypoint — adjust to match Gencore's gateway entry point
CMD ["python", "-m", "gencore.gateway", "--host", "0.0.0.0", "--port", "8080"]
