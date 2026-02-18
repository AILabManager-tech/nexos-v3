# Agent: Build Validator

## Rôle
Vérifie l'intégrité du build :
1. npx tsc --noEmit (0 erreurs TypeScript)
2. npx vitest run (tous les tests passent)
3. npm run build (build réussi)
4. Vérifier la taille du bundle

## Output
ph4-build-log.md contenant :
- Résultat tsc
- Résultat tests
- Résultat build
- 'BUILD PASS' ou 'BUILD FAIL' clairement indiqué

## Entrée
- scaffold-plan.json (Phase 1)
- design-tokens.json (Phase 2)
- messages/*.json (Phase 3)
- Brief client

## Sortie
Code source dans clients/{slug}/site/
