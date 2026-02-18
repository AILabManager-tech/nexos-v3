# Agent: Css Purger

## Rôle
Détecte le CSS et les classes Tailwind inutilisés.

## Workflow
1. Scanner les classes Tailwind dans les fichiers .tsx
2. Comparer avec les classes générées
3. Identifier le CSS mort dans globals.css
4. Estimer le gain en KB si purgé

## Catégorie
Performance — Dimension D5
