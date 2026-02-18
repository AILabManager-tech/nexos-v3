# SOIC v3.0 — Corrections Log

## CORRECTION 1 — Eliminer les faux 5.0 neutres
**Statut** : DONE
**Fichiers modifies** : soic/models.py, soic/gate_protocol.py, soic/converger.py, soic/report.py, soic/domain_grids/web.py
**Details** :
- GateStatus.NOT_EXECUTED ajoute (distinct de SKIP)
- NOT_EXECUTED = score 0.0, pas 5.0
- coverage = actually_ran / total_gates
- coverage < 0.7 → ABORT_LOW_COVERAGE dans Converger
- Rapport affiche ⊘ pour NOT_EXECUTED, verdict INCOMPLETE si coverage < 0.7
- W-08, W-10, W-11, W-12 retournent NOT_EXECUTED si tooling/*.json absent
**Tests** : test_models.py (8 tests), test_converger.py::test_low_coverage_aborts, test_report.py (6 tests)

## CORRECTION 2 — Sequencer le preflight dans l'orchestrateur
**Statut** : DONE
**Fichiers modifies** : orchestrator.py
**Details** :
- Fonction run_preflight(site_dir, client_dir) ajoutee
- Build le site si .next/ absent, lance npx next start sur port libre
- Execute lighthouse-scan.sh, a11y-scan.sh, headers-scan.sh, ssl-scan.sh, deps-scan.sh
- Timeout 60s par scan, 5min total
- Kill le serveur Next.js en fin de preflight
- Appele AVANT le gate engine pour ph5-qa
**Tests** : Import validation (run_preflight, _find_free_port, _SCAN_SCRIPTS)

## CORRECTION 3 — Detection de plateau fonctionnelle
**Statut** : DONE
**Fichiers modifies** : soic/converger.py
**Details** :
- Plateau = 1 delta <= 0 (pas 2)
- Exception : si fail_count diminue, pas de plateau (progres qualitatif)
- max_iter = 4
- fail_history trackee en plus de mu_history
**Tests** : test_converger.py::test_plateau_detected, test_stagnant_mu_fewer_fails_continues

## CORRECTION 4 — Feedback priorise (top 5 critiques)
**Statut** : DONE
**Fichiers modifies** : soic/feedback_router.py
**Details** :
- Priorites : D4/D8 = CRITIQUE (0), D5/D6 = HAUTE (1), reste = NORMALE (2)
- Max 5 items dans le feedback, tries par priorite puis score croissant
- Footer : "(+ N corrections mineures reportees)"
- Templates correctifs concis (1 ligne par gate)
- generate_full() pour les logs (tous les gates)
**Tests** : test_feedback_router.py (7 tests)

## CORRECTION 5 — W-14 legal-compliance : detail par check
**Statut** : DONE
**Fichiers modifies** : soic/domain_grids/web.py
**Details** :
- 6 checks explicites dans l'evidence :
  1. Page /politique-de-confidentialite existe
  2. Lien dans le footer
  3. 6 mots-cles Loi 25 obligatoires
  4. Checkbox consentement non pre-cochee
  5. Mention de finalite avant submit
  6. Lien politique pres du formulaire
- Score = (checks passes / 6) * 10
**Tests** : Integration via test_gate_engine.py (gate W-14 presente)

## CORRECTION 6 — Gate cookies Loi 25 (W-17)
**Statut** : DONE
**Fichiers modifies** : soic/domain_grids/web.py, soic/domain_grids/__init__.py, soic/feedback_router.py
**Details** :
- Nouvelle gate W-17 cookie-consent, dimension D8
- Analyse statique : composant consent existe, trackers wrappes dans conditionnel, pas de trackers dans layout head, bouton refuser present
- TRACKER_DOMAINS : 12 domaines tiers (Google Analytics, Facebook, Hotjar, etc.)
- Score max 7.0 (analyse statique seulement, pas runtime)
- 17 gates au total pour ph5-qa
**Tests** : test_gate_engine.py::test_ph5_qa_has_17_gates, test_web_gate_ids

## CORRECTION 7 — Closure _rerun → objet RerunContext
**Statut** : DONE
**Fichiers modifies** : orchestrator.py
**Details** :
- Dataclass RerunContext(phase, client_dir, site_dir, url, timestamp)
- Methode rerun(phase, feedback, iteration) → bool
- Remplace la closure _rerun dans run_pipeline
- Testable independamment, pas de capture de variables implicites
**Tests** : Import validation (RerunContext instanciation + callable)

## CORRECTION 8 — Timeout global sur la boucle
**Statut** : DONE
**Fichiers modifies** : soic/iterator.py
**Details** :
- timeout_minutes=15 par defaut dans PhaseIterator
- Verifie temps ecoule avant chaque iteration
- Si timeout atteint → LoopResult avec decision=ABORT, reason="Timeout global atteint"
- IterationResult.duration_s pour diagnostic
**Tests** : Import validation (timeout default = 15)

## CORRECTION 9 — Tests unitaires
**Statut** : DONE
**Fichiers crees** : tests/test_soic/__init__.py, test_models.py, test_converger.py, test_feedback_router.py, test_gate_engine.py, test_report.py
**Details** :
- 41 tests au total, tous passent
- test_models.py : 8 tests (GateStatus, PhaseGateReport, NOT_EXECUTED, coverage)
- test_converger.py : 8 tests (ACCEPT, blocking D4/D8, coverage, plateau, max_iter, summary)
- test_feedback_router.py : 7 tests (max items, priority, format, generate_full)
- test_gate_engine.py : 8 tests (phase mapping, gate IDs, duplicates)
- test_report.py : 6 tests (NOT_EXECUTED icon, coverage, INCOMPLETE, structure)
**Commande** : `python -m pytest tests/test_soic/ -v --tb=short`
