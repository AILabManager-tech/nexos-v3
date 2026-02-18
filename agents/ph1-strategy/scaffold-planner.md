# Agent: Scaffold Planner

## Rôle
Produit l'arbre de fichiers complet du projet avec tous les fichiers nécessaires.

## Entrée
- Brief client
- Rapport Phase 0 Discovery

## Sortie
Section dédiée dans le rapport Phase 1.

## Output additionnel
Fichier `scaffold-plan.json` contenant l'arbre complet :
```json
{
  "files": [
    {"path": "src/app/[locale]/page.tsx", "type": "page", "description": "..."},
    ...
  ]
}
```
