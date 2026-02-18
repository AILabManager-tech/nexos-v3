# NEXOS v3.0 — Architecture

## Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────────┐
│                      NEXOS v3.0 ORCHESTRATOR                     │
│                    orchestrator.py (Python 3.12)                  │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│  PHASE 0 │ PHASE 1  │ PHASE 2  │ PHASE 3  │ PHASE 4  │ PHASE 5  │
│ DISCOVERY│ STRATEGY │ DESIGN   │ CONTENT  │ BUILD    │ QA+DEPLOY│
│ 5 agents │ 5 agents │ 5 agents │ 5 agents │ 5 agents │ 22 agents│
├──────────┴──────────┴──────────┴──────────┴──────────┴──────────┤
│                    QUALITY GATES (SOIC v3.0)                     │
│            μ = mean(D1..D9) — Gate ≥ 8.0 entre phases            │
├──────────────────────────────────────────────────────────────────┤
│                    TOOLING LAYER (CLI natif)                     │
│  lighthouse · pa11y · curl -I · npm audit · testssl.sh · osiris  │
├──────────────────────────────────────────────────────────────────┤
│                    RUNTIME                                        │
│  Claude Code CLI (Pro Max OAuth) — --dangerously-skip-permissions │
└──────────────────────────────────────────────────────────────────┘
```

## Différences vs NEXOS v2

| Aspect | v2 | v3.0 |
|--------|-----|------|
| Appels CLI | 1 (tout dans 1 session) | N (1 par phase) |
| Quality gates | 0 | 6 (SOIC μ entre phases) |
| Tooling réel | 0 outils | 6 outils CLI |
| Agents audit | 6 (ph5 généralistes) | 22 (spécialisés) |
| Headers sécu | Optionnels | Templates obligatoires |
| Conformité légale | Absente | Agent dédié (Loi 25) |
| Mesures vs estimations | 0% mesures | ≥60% mesures réelles |
