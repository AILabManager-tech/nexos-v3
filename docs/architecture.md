# NEXOS v4.0 — Architecture

## Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────────┐
│                     NEXOS v4.0 ORCHESTRATOR                      │
│                  orchestrator.py (Python 3.12)                    │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│  PHASE 0 │ PHASE 1  │ PHASE 2  │ PHASE 3  │ PHASE 4  │ PHASE 5  │
│ DISCOVERY│ STRATEGY │ DESIGN   │ CONTENT  │ BUILD    │ QA+DEPLOY│
│ 6 agents │ 6 agents │ 6 agents │ 6 agents │ 7 agents │ 24 agents│
├──────────┴──────────┴──────────┴──────────┴──────────┴──────────┤
│                 NEXOS v4.0 AUGMENTATION LAYER                    │
│  tooling_manager · build_validator · auto_fixer · cli_commands   │
├──────────────────────────────────────────────────────────────────┤
│                    QUALITY GATES (SOIC v3.0)                     │
│            μ = mean(D1..D9) — Gate ≥ 8.0 entre phases            │
├──────────────────────────────────────────────────────────────────┤
│                    TOOLING LAYER (CLI natif)                     │
│  lighthouse · pa11y · curl -I · npm audit · testssl.sh · osiris  │
├──────────────────────────────────────────────────────────────────┤
│                    TEMPLATES SECURISES (15)                       │
│  vercel-headers · next-config · cookie-consent · legal pages     │
│  brief-intake · brief-schema · sitemap · robots · og-image       │
├──────────────────────────────────────────────────────────────────┤
│                    RUNTIME                                        │
│  Claude Code CLI (Pro Max OAuth) — --dangerously-skip-permissions │
└──────────────────────────────────────────────────────────────────┘
```

## Differences entre versions

| Aspect | v2 | v3.0 | v4.0 |
|--------|-----|------|------|
| Appels CLI | 1 (tout dans 1 session) | N (1 par phase) | N + augmentation |
| Quality gates | 0 | 6 (SOIC μ entre phases) | 6 + build validation reelle |
| Tooling reel | 0 outils | 6 outils CLI | 6 + verification automatique |
| Agents audit | 6 generalistes | 22 specialises | 24 specialises |
| Headers secu | Optionnels | Templates obligatoires | Auto-fix si manquants |
| Conformite legale | Absente | Agent dedie (Loi 25) | Auto-fix D8 + generation pages |
| Mesures vs estimations | 0% mesures | ≥60% mesures reelles | ≥80% mesures reelles |
| Validation build | Aucune | String "BUILD PASS" | npm install + tsc + build + audit |
| Auto-correction | Aucune | Aucune | 6 fixes automatiques (D4/D8) |
| CLI standalone | 0 commandes | 5 commandes | 8 commandes (doctor/fix/report) |

## Package `nexos/` — Architecture d'augmentation

Le package `nexos/` est **optionnel**. L'orchestrateur detecte sa presence au demarrage :

```python
try:
    from nexos.tooling_manager import ensure_tooling
    from nexos.build_validator import validate_build
    from nexos.auto_fixer import auto_fix
    _NEXOS_V4 = True
except ImportError:
    _NEXOS_V4 = False
```

### Modules

```
nexos/
├── __init__.py           # __version__ = "4.0.0"
├── tooling_manager.py    # Verification outils CLI au demarrage
├── build_validator.py    # Validation build reelle (remplace "BUILD PASS")
├── auto_fixer.py         # Auto-correction D4 (Securite) + D8 (Loi 25)
└── cli_commands.py       # Commandes CLI standalone (doctor/fix/report)
```

### Points d'integration dans orchestrator.py

```
orchestrator.py
     │
     ├── [DEBUT] ensure_tooling()         ← tooling_manager
     │
     ├── ph0 → ph1 → ph2 → ph3
     │
     ├── ph4: validate_build()            ← build_validator
     │         │
     │         └── si FAIL → auto_fix()   ← auto_fixer (try-fix-retry)
     │                       │
     │                       └── re-validate_build()
     │
     ├── [AVANT ph5] auto_fix()           ← auto_fixer (compliance D4/D8)
     │
     └── ph5 → deploy si μ ≥ 8.5
```

### Pattern try-fix-retry

```
validate_build(site_dir)
        │
        ├── PASS → continuer
        │
        └── FAIL → auto_fix(site_dir, client_dir, brief)
                    │
                    └── validate_build(site_dir)  [2eme tentative]
                            │
                            ├── PASS → continuer
                            └── FAIL → arret (intervention manuelle)
```

## Pipeline de phases

### Mode create (complet)

```
Brief client
     │
     ▼
ph0-discovery (6 agents)     μ ≥ 7.0
     │
     ▼
ph1-strategy (6 agents)      μ ≥ 8.0
     │
     ▼
ph2-design (6 agents)        μ ≥ 8.0
     │
     ▼
ph3-content (6 agents)       μ ≥ 8.0
     │
     ▼
ph4-build (7 agents)         BUILD PASS (validate_build)
     │
     ├── [auto-fix D4/D8]
     │
     ▼
ph5-qa (24 agents)           μ ≥ 8.5
     │
     ▼
Deploy (Vercel)
```

### Mode modify (site-update)

```
Branche update/<slug>-<date>
     │
     ▼
repo-manager → site-auditor → site-modifier → qa-reviewer → deployer
```

### Mode audit

```
URL existant → tooling scan → ph5-qa (24 agents) → rapport
```

## SOIC — Quality Gates

9 dimensions evaluees a chaque gate :

| Dimension | Description | Poids |
|-----------|-------------|-------|
| D1 | Architecture technique | 1.0 |
| D2 | Performance | 1.0 |
| D3 | Accessibilite (WCAG) | 1.0 |
| D4 | Securite | 1.2 |
| D5 | SEO | 1.0 |
| D6 | UX/UI | 1.0 |
| D7 | Contenu | 1.0 |
| D8 | Conformite legale (Loi 25) | 1.2 |
| D9 | Maintenance | 0.8 |

Score mu = moyenne ponderee des 9 dimensions.

## Agents — 46+ specialises

### ph0-discovery (6 agents)
- `_orchestrator.md` — Coordination phase
- `brief-analyzer.md` — Analyse du brief client
- `competitor-analyst.md` — Analyse concurrentielle
- `design-critic.md` — Critique design + tokens draft
- `market-researcher.md` — Recherche marche
- `tech-auditor.md` — Audit technique existant

### ph1-strategy (6 agents)
- `_orchestrator.md` — Coordination
- `content-strategist.md` — Strategie de contenu
- `ia-strategist.md` — Integration IA
- `scaffold-planner.md` — Structure du site
- `seo-strategist.md` — Strategie SEO
- `tech-strategist.md` — Architecture technique

### ph2-design (6 agents)
- `_orchestrator.md` — Coordination
- `animation-designer.md` — Motion design
- `component-designer.md` — Design systeme composants
- `design-system-architect.md` — Architecture design tokens
- `layout-designer.md` — Layout responsive
- `responsive-specialist.md` — Adaptation multi-device

### ph3-content (6 agents)
- `_orchestrator.md` — Coordination
- `content-writer.md` — Redaction contenu
- `copywriter.md` — Textes marketing
- `i18n-translator.md` — Traduction FR/EN
- `media-curator.md` — Selection medias
- `seo-content-writer.md` — Contenu SEO

### ph4-build (7 agents)
- `_orchestrator.md` — Coordination
- `api-integrator.md` — Integration APIs
- `component-builder.md` — Implementation composants
- `config-generator.md` — Fichiers de config
- `page-builder.md` — Pages Next.js
- `seo-asset-generator.md` — Assets SEO (sitemap, robots, OG)
- `test-writer.md` — Tests Vitest

### ph5-qa (24 agents)
- `_orchestrator.md` — Coordination
- 15 agents QA specialises (perf, a11y, seo, securite, legal, etc.)
- `report-aggregator.md` — Rapport final

### site-update (6 agents)
- `_orchestrator.md` — Coordination du pipeline modify
- `repo-manager.md` — Gestion branches
- `site-auditor.md` — Audit pre-modification
- `site-modifier.md` — Application modifications
- `qa-reviewer.md` — Verification post-modification
- `deployer.md` — Deploiement preview + merge

## Templates securises (15)

| Template | Usage | Auto-fix |
|----------|-------|----------|
| `vercel-headers.template.json` | Headers securite + cache | Oui |
| `next-config.template.mjs` | Next.js config securisee | Oui |
| `cookie-consent-component.tsx` | Bandeau consentement Loi 25 | Oui |
| `privacy-policy-template.md` | Politique confidentialite | Oui |
| `legal-mentions-template.md` | Mentions legales | Oui |
| `brief-intake.md` | Formulaire brief client | Non |
| `brief-schema.json` | Validation JSON du brief | Non |
| `sitemap.template.xml` | Sitemap multilingue | Non |
| `robots.template.txt` | Robots.txt | Non |
| `og-image.template.svg` | Image OG 1200x630 | Non |
| `tsconfig.template.json` | TypeScript strict | Non |
| `tailwind.template.config.ts` | Config Tailwind | Non |
| `ad-unit-component.tsx` | Composant AdSense | Non |
| `audit-template.md` | Template rapport audit | Non |
| `book-summary-template.md` | Resume livre | Non |

## Symlinks

```
soic/    → Moteur SOIC v3.0 (quality gates)
osiris/  → Osiris scanner (audit externe)
```
