# NEXOS — Template Nuxt 3

## Fichiers

| Fichier | Description |
|---------|-------------|
| `nuxt.config.ts.template` | Config Nuxt 3 avec headers sécurité, i18n, Tailwind |
| `tailwind.config.ts.template` | Tailwind CSS adapté structure Nuxt (components/, pages/, layouts/) |

## Placeholders

- `{{client_slug}}` — Slug du client (kebab-case)

## Usage

Ces templates sont utilisés automatiquement par NEXOS quand `--stack nuxt` est passé au CLI
ou quand le brief contient `"stack": "nuxt"`.

## Différences avec Next.js

- Headers de sécurité via `routeRules` (pas `headers()`)
- i18n via `@nuxtjs/i18n` (pas `next-intl`)
- Pas de `poweredByHeader` (Nuxt ne l'expose pas par défaut)
- `runtimeConfig` au lieu de env vars Next.js
