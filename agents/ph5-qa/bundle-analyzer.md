# Agent: Bundle Analyzer

## Rôle
Analyse la taille des chunks JavaScript. Identifie les dépendances lourdes et les opportunités de code splitting.

## Workflow
1. Analyser .next/build-manifest.json ou le output du build
2. Identifier les chunks > 100KB
3. Détecter les imports non tree-shakés (framer-motion, lodash)
4. Recommander le dynamic import pour les composants lourds

## Catégorie
Performance — Dimension D5
