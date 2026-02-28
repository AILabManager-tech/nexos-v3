# NEXOS v4.0 — Guide de deploiement

## Pre-requis

```bash
nexos doctor  # Verifier que tout est operationnel
```

| Outil | Version min | Usage |
|-------|-------------|-------|
| Node.js | 20.0+ | Build et runtime |
| npm | inclus | Dependances |
| Claude Code | latest | Agents IA |
| Vercel CLI | latest | Deploiement (optionnel) |

## Pipeline de deploiement

```
Brief client → ph0-ph4 → auto-fix D4/D8 → ph5-qa → Vercel deploy
                                ↑                        |
                           validate_build          μ ≥ 8.5 requis
                           try-fix-retry
```

### Seuils de qualite

| Transition | Seuil SOIC |
|------------|------------|
| ph0 → ph1 | μ ≥ 7.0 |
| ph1 → ph2 | μ ≥ 8.0 |
| ph2 → ph3 | μ ≥ 8.0 |
| ph3 → ph4 | μ ≥ 8.0 |
| ph4 → ph5 | BUILD PASS (validate_build) |
| ph5 → deploy | μ ≥ 8.5 |

## Deploiement sur Vercel

### Configuration requise

1. **vercel.json** — Headers securite (6 obligatoires) + cache statique
   ```bash
   # Verifier ou creer depuis template
   nexos fix clients/mon-client --dry-run
   ```

2. **next.config.mjs** — `poweredByHeader: false`

3. **Pages legales** (Loi 25 Quebec) :
   - `/politique-confidentialite`
   - `/mentions-legales`

### Deploiement automatique

```bash
# Creation complete depuis un brief
nexos create --brief clients/.template/brief-client.json

# Le pipeline gere tout : ph0 → ph5 → deploy si μ ≥ 8.5
```

### Deploiement manuel

```bash
cd clients/mon-client/site

# 1. Verifier le build
npm run build

# 2. Deployer
vercel --prod

# ou via git push (si Vercel connecte au repo)
git push origin main
```

## Verifications pre-deploiement

### Auto-fix standalone

```bash
# Analyser sans appliquer
nexos fix clients/mon-client --dry-run

# Appliquer les corrections
nexos fix clients/mon-client
```

### Checklist manuelle

```bash
cd clients/mon-client/site

# 1. Build propre
npm run build

# 2. Audit securite
npm audit

# 3. Fichiers critiques
ls vercel.json next.config.mjs
ls src/app/\[locale\]/politique-confidentialite/page.tsx
ls src/app/\[locale\]/mentions-legales/page.tsx

# 4. Headers dans vercel.json
cat vercel.json | python -c "
import json, sys
data = json.load(sys.stdin)
headers = set()
for block in data.get('headers', []):
    for h in block.get('headers', []):
        headers.add(h['key'].lower())
required = {'x-content-type-options','x-frame-options','referrer-policy',
            'permissions-policy','strict-transport-security','x-dns-prefetch-control'}
missing = required - headers
print('PASS' if not missing else f'MANQUANTS: {missing}')
"
```

### Verification post-deploiement

```bash
# Headers HTTP
curl -I https://mon-site.vercel.app | grep -iE "x-content-type|x-frame|referrer|permissions|strict-transport|x-dns"

# Lighthouse
lighthouse https://mon-site.vercel.app --output json --output-path ./lighthouse.json

# Accessibilite
pa11y https://mon-site.vercel.app
```

## Structure des fichiers deployes

```
clients/mon-client/
├── brief-client.json           # Brief (legal Loi 25)
├── ph0-discovery-report.md     # Rapports de phase
├── ph1-strategy-report.md
├── ph2-design-report.md
├── ph3-content-report.md
├── ph4-build-log.md
├── ph5-qa-report.md
├── soic-gates.json             # Historique quality gates
├── tooling/                    # Resultats scans
│   ├── lighthouse.json
│   ├── headers.json
│   ├── npm-audit.json
│   └── pa11y.json
└── site/                       # Code source Next.js
    ├── package.json
    ├── next.config.mjs
    ├── vercel.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── public/
    │   ├── sitemap.xml
    │   ├── robots.txt
    │   └── images/
    └── src/
        ├── app/
        │   └── [locale]/
        │       ├── layout.tsx      # CookieConsent injecte
        │       ├── page.tsx
        │       ├── politique-confidentialite/
        │       │   └── page.tsx
        │       └── mentions-legales/
        │           └── page.tsx
        └── components/
            └── cookie-consent.tsx
```

## Conformite Loi 25

Chaque site deploye DOIT inclure :

| Element | Fichier | Verification |
|---------|---------|-------------|
| Bandeau cookies | `cookie-consent.tsx` + injection `layout.tsx` | `<CookieConsent` dans layout |
| Politique confidentialite | `politique-confidentialite/page.tsx` | RPP identifie, droits, duree |
| Mentions legales | `mentions-legales/page.tsx` | NEQ, adresse, hebergeur |
| Headers securite | `vercel.json` | 6 headers requis |
| poweredByHeader | `next.config.mjs` | `false` |

Le module `auto_fixer.py` corrige automatiquement ces 6 points.
Le score D8 (Conformite) doit etre ≥ 7.0 pour deployer.

## Rollback

Si un deploiement cause des problemes :

```bash
# Vercel : revenir au deploiement precedent
vercel rollback

# Git : revenir au commit precedent
git log --oneline -5  # identifier le commit
git revert <commit-sha>
```

## Environnements

| Env | URL | Usage |
|-----|-----|-------|
| Preview | `*.vercel.app` | Chaque push = preview automatique |
| Production | domaine client | Deploy `--prod` ou merge main |
| Local | `localhost:3000` | `npm run dev` |
