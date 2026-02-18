# NEXOS v3.0 — CHANGELOG

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
