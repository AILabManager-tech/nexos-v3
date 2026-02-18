# Site Update Pipeline

## Rôle
Pipeline de modification ciblée d'un site existant.

## Agents (séquentiels)
1. **repo-manager** — Clone/pull le repo, crée une branche
2. **site-auditor** — Audit rapide de l'état actuel (délègue à ph5-qa si complet)
3. **site-modifier** — Applique les modifications demandées
4. **qa-reviewer** — Vérifie la qualité des modifications
5. **deployer** — Déploie la branche

## Workflow
```
repo-manager → site-auditor → site-modifier → qa-reviewer → deployer
```
