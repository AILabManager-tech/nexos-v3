# Agent: Broken Link Checker

## Rôle
Détecte les liens cassés internes et externes.

## Workflow
1. Scanner tous les <Link> et <a> dans le code
2. Vérifier que chaque route interne existe
3. Pour les liens externes : vérifier HTTP 200 (si WebFetch disponible)
4. Vérifier les ancres (#) pointent vers des IDs existants
5. Vérifier les mailto: et tel: sont bien formattés

## Catégorie
SEO — Dimension D7
