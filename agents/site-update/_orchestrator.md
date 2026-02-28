# Site Update Pipeline (NEXOS — Mode Modify)

## Contexte

Pipeline de modification ciblee d'un site NEXOS existant et deploye. Contrairement au pipeline de creation (Ph0→Ph5), ce pipeline opere sur un repo existant avec du contenu en production.

**Declencheur** : `nexos modify --client <slug> --brief "description des modifications"`

## Agents (sequentiels — chaque agent bloque le suivant)

```
repo-manager → site-auditor → site-modifier → qa-reviewer → deployer
```

| # | Agent | Input | Output | Timeout |
|---|-------|-------|--------|---------|
| 1 | **repo-manager** | client slug + remote URL | Branche `update/<slug>-<date>` prete | 2 min |
| 2 | **site-auditor** | Branche clonee | `audit-pre-modification.json` | 5 min |
| 3 | **site-modifier** | Audit + brief modification | Fichiers modifies + `changelog.md` | 15 min |
| 4 | **qa-reviewer** | Branche modifiee | `qa-report.json` (PASS/FAIL) | 10 min |
| 5 | **deployer** | Branche validee QA | URL de preview + merge si PASS | 3 min |

## Regles du pipeline

1. **Branche obligatoire** : JAMAIS modifier `main` directement — toujours via branche `update/`
2. **Audit avant modification** : Le site-auditor DOIT etablir le baseline AVANT toute modification
3. **Non-regression** : Le qa-reviewer compare le score post-modification au baseline pre-modification
4. **Rollback automatique** : Si le qa-reviewer retourne FAIL, le deployer annule le merge
5. **SOIC gate** : Le score mu post-modification doit etre >= score mu pre-modification (non-regression)

## Variables d'entree

```json
{
  "client_slug": "nom-client",
  "repo_url": "github.com/org/repo",
  "modification_brief": "Description des changements demandes",
  "deploy_target": "vercel|ionos|manual",
  "auto_merge": false,
  "notify_client": false
}
```

## Criteres d'arret

- **STOP si** : `tsc --noEmit` echoue apres modification
- **STOP si** : `next build` echoue
- **STOP si** : Score mu post < score mu pre (regression)
- **STOP si** : Toute gate D4 (Security) ou D8 (Legal) passe de PASS a FAIL
