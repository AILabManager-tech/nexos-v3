# NEXOS — CHANGELOG

## [4.0.0] - 2026-02-28 — Pipeline Augmentation (Sprint 1 + 2)

### Nouveau package `nexos/`

Trois modules d'augmentation qui se branchent sur `orchestrator.py` via le flag `_NEXOS_V4`.
Retrocompatibilite totale : si `nexos/` est absent, l'orchestrateur fonctionne en mode v3.0.

#### Sprint 1 — Modules de base
- **A01** : `nexos/tooling_manager.py` — Verification des outils CLI (node, npm, claude, lighthouse, pa11y) avec degradation gracieuse pour les optionnels
- **A02** : `nexos/build_validator.py` — Remplace la validation superficielle "BUILD PASS" par des verifications reelles (npm install, tsc, build, audit, fichiers critiques, headers)
- **A03** : `nexos/auto_fixer.py` — Auto-correction D4/D8 : injection cookie consent, npm audit fix, vercel headers, next.config, generation pages legales

#### Sprint 2 — Commandes CLI
- **A04** : `nexos/cli_commands.py` — Nouvelles commandes standalone
- **CMD** : `nexos doctor` — Diagnostic systeme complet (outils, templates, SOIC engine, clients)
- **CMD** : `nexos fix <client_dir> [--dry-run]` — Auto-correction D4/D8 sans lancer le pipeline
- **CMD** : `nexos report <client_dir>` — Rapport agrege (phases, SOIC gates, tooling, brief)

### Fichiers modifies
- `orchestrator.py` — Imports v4.0 conditionnels, tooling check au demarrage, auto-fix avant ph5, validation build reelle a ph4, 3 nouvelles commandes CLI (doctor/fix/report)
- `nexos/tooling_manager.py:doctor_report()` — Enrichi avec sections templates, SOIC engine, clients

### Fichiers crees
- `nexos/__init__.py` — Package v4.0.0
- `nexos/tooling_manager.py` — 230 lignes
- `nexos/build_validator.py` — 238 lignes
- `nexos/auto_fixer.py` — 478 lignes
- `nexos/cli_commands.py` — 260 lignes
- `pyproject.toml` — Config projet Python (rich>=13.0, pytest>=8.0)

### Tests
- `tests/test_tooling_manager.py` — 16 tests (check_tool, ensure_tooling, doctor_report)
- `tests/test_build_validator.py` — 13 tests (BuildResult, fichiers critiques, headers, audit)
- `tests/test_auto_fixer.py` — 17 tests (FixReport, vercel headers, next.config, cookie consent, pages legales)
- `tests/test_cli_commands.py` — 11 tests (doctor, fix, fix --dry-run, report)
- **Total : 57 tests, tous passent**

---

## [3.0.1] - 2026-02-16 — Stabilisation Loi 25

### Corrections de bugs
- **B05** : `orchestrator.py` — `process = None` initialise avant try/except pour eviter NameError
- **B08** : `orchestrator.py` — `import re` et `import unicodedata` deplaces en haut du fichier
- **B08b** : `soic/gate.py` — `import re` deplace en haut du fichier
- **B08-unicode** : `slugify()` reecrit avec `unicodedata.normalize(NFD)` pour support complet des accents

### Nouvelles fonctionnalites
- **A05** : `orchestrator.py` — `verify_phase_output()` verifie que chaque phase produit un rapport valide (>500 chars)
- **D8-eval** : `soic/evaluate.py` — `evaluate_d8_legal()` evalue programmatiquement la conformite legale (6 points)
- **D8-fix** : D8 n'est plus fixe a 5.0 par defaut — score 0.0 si aucun element de conformite trouve

### Templates crees
- `templates/cookie-consent-component.tsx` — Composant React bandeau consentement Loi 25
- `templates/privacy-policy-template.md` — Template politique de confidentialite avec placeholders
- `templates/legal-mentions-template.md` — Template mentions legales avec placeholders

### Fichiers modifies
- `templates/brief-intake.md` — Reecrit avec section Loi 25 complete (RPP, donnees, finalites, retention, transfert, consentement, incidents)
- `templates/brief-schema.json` — Reecrit avec validation Loi 25 (champs required: rpp, data_collected, purposes, etc.)
- `agents/ph5-qa/legal-compliance.md` — Reecrit avec 28 points de verification (A1-E2)
- `agents/ph4-build/_orchestrator.md` — Renforce avec integration templates Loi 25, remplacement placeholders, checklist BUILD PASS elargie
- `CLAUDE.md` — Section conformite legale etendue avec toutes les exigences Loi 25

### Tests
- `tests/briefs/plomberie-qc.json` — Brief test complet avec donnees legales Loi 25
- Validation end-to-end : orchestrator charge le brief, slugify, build_phase_prompt, SOIC gates, D8 evaluation
- `orchestrator.py` compile sans erreur
- `soic/` compile sans erreur

### Documentation
- `STABILISATION_AUDIT.md` — Audit initial des 16 fichiers (incohérences, references cassees, lacunes Loi 25)
- `CHANGELOG.md` — Ce fichier
