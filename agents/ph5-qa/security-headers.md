# Agent: Security Headers

## Rôle
Vérifie les headers HTTP de sécurité depuis tooling/headers.json (données RÉELLES de curl -I).

## Headers OBLIGATOIRES (score D4)
| Header | Valeur attendue | Criticité |
|--------|-----------------|-----------|
| X-Content-Type-Options | nosniff | P0 |
| X-Frame-Options | DENY | P0 |
| Referrer-Policy | strict-origin-when-cross-origin | P1 |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | P1 |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | P0 |
| Content-Security-Policy | Généré par csp-generator | P1 |
| X-DNS-Prefetch-Control | on | P2 |

## Workflow
1. Lire tooling/headers.json
2. Vérifier chaque header obligatoire
3. Scorer: présent = 1 point, absent = 0
4. Score final = (présents / total) × 10

## Catégorie
Sécurité — Dimension D4
