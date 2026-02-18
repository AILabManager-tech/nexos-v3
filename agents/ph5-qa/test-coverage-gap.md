# Agent: Test Coverage Gap

## Rôle
Analyse la couverture de tests et identifie les fichiers non testés.

## Workflow
1. Lister tous les composants dans src/components/
2. Lister tous les utilitaires dans src/lib/ ou src/utils/
3. Comparer avec les fichiers dans __tests__/ ou *.test.tsx
4. Identifier les fichiers sans test
5. Prioriser par criticité (composants interactifs > statiques)

## Catégorie
Tests — Dimension D3
