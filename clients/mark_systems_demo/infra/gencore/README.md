# Gencore Deployment for Mark Systems Mega-Lab

Mark Systems delegates multimodal, browser automation, voice (STT/TTS), and Docker
sandbox operations to Gencore via a FastAPI bridge. This directory contains the
artifacts to deploy Gencore as a remote service.

## Architecture

```
Next.js (Vercel)  ──HTTPS──>  Gencore FastAPI (Fly.io / Railway / VPS)
  lib/agents/bridges/gencore.ts          gencore.gateway
```

## Quick start

### 1. Fly.io (recommended — free tier, edge-close to Vercel)

```bash
cd infra/gencore
./deploy.sh fly
```

This will:
1. Copy the Dockerfile into the Gencore source (default: `~/projects/gearforge/gencore`)
2. Run `fly deploy`
3. Set up health checks + auto-stop on idle

Then set Vercel environment variables:

```bash
cd ../..  # back to site/
vercel env add GENCORE_URL production
# Value: https://mark-systems-gencore.fly.dev

vercel env add GENCORE_API_KEY production
# Value: the API key you set via `fly secrets set GENCORE_API_KEY=...`
```

### 2. Railway

```bash
cd infra/gencore
./deploy.sh railway
```

### 3. Local Docker (dev)

```bash
cd infra/gencore
./deploy.sh local
docker run -p 8080:8080 --env-file .env.gencore mark-systems-gencore
```

Then in `site/.env.local`:

```
GENCORE_URL=http://localhost:8080
GENCORE_API_KEY=your-local-key
```

## Required secrets

Create `infra/gencore/.env.gencore` (gitignored) with:

```env
GENCORE_API_KEY=generate-a-random-bearer-token
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Optional — for image generation via Geargrinder MCP
REPLICATE_API_KEY=...
LEONARDO_API_KEY=...
```

## Health check

After deploy, verify:

```bash
curl https://mark-systems-gencore.fly.dev/v1/health
# => { "status": "ok", "version": "3.0.0" }
```

## Graceful fallback

The Next.js bridge at `src/agents/bridges/gencore.ts` handles the case where
Gencore is unreachable — agents using the bridge will receive an `offline` status
and should fall back to their primary LLM instead.

This means **the Mega-Lab works fully without Gencore** — only multimodal features
(image generation, voice, browser automation) will be unavailable until Gencore is
online.

## Agents that depend on Gencore

- `content-curator` — image generation via Geargrinder MCP
- `showroom-publisher` — OG image generation
- `deploy-sentinel` — browser automation for visual regression checks

All other agents (devops, ui-generator, docs-writer, business-strategist, lab-director)
work purely via the Vercel AI SDK and do not require Gencore.
