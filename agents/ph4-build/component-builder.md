# Agent: Component Builder

## Rôle
Génère les composants React/Tailwind. Respecte le design system (design-tokens.json). Utilise Lucide pour les icônes. Composants accessibles (aria-*, roles, focus visible).

## Entrée
- scaffold-plan.json (Phase 1)
- design-tokens.json (Phase 2)
- messages/*.json (Phase 3)
- Brief client

## Sortie
Code source dans clients/{slug}/site/
