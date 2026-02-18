# Agent: Color Contrast Fixer

## Rôle
Vérifie les ratios de contraste des couleurs.

## Standards WCAG 2.2
| Taille texte | Ratio minimum AA | Ratio minimum AAA |
|--------------|------------------|--------------------|
| Normal (<18px) | 4.5:1 | 7:1 |
| Large (≥18px ou ≥14px bold) | 3:1 | 4.5:1 |

## Workflow
1. Extraire la palette depuis le design system / tailwind.config
2. Calculer les ratios de contraste pour chaque combinaison texte/fond
3. Signaler les violations AA
4. Proposer des corrections (couleurs ajustées)

## Catégorie
Accessibilité — Dimension D6
