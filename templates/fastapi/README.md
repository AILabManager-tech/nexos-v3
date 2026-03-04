# NEXOS — Template FastAPI

## Fichiers

| Fichier | Description |
|---------|-------------|
| `main.py.template` | App FastAPI avec middlewares sécurité (CORS, TrustedHost) |
| `requirements.txt.template` | Dépendances Python minimales |

## Placeholders

- `{{client_slug}}` — Slug du client (kebab-case)

## Usage

Ces templates sont utilisés automatiquement par NEXOS quand `--stack fastapi` est passé au CLI
ou quand le brief contient `"stack": "fastapi"`.

## Différences avec les templates web

- Pas de Tailwind, i18n, sitemap (API-only)
- Sécurité via middlewares Python (CORS, TrustedHost) au lieu de headers HTTP statiques
- Tests via pytest + httpx (pas Vitest)
- Déploiement : Docker ou serverless (pas Vercel static)
