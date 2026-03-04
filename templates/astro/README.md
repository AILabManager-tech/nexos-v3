# NEXOS — Template Astro

## Fichiers

| Fichier | Description |
|---------|-------------|
| `astro.config.mjs.template` | Config Astro avec Tailwind, sitemap, i18n |
| `tailwind.config.ts.template` | Tailwind CSS adapté structure Astro (src/**/) |

## Placeholders

- `{{client_slug}}` — Slug du client (kebab-case)

## Usage

Ces templates sont utilisés automatiquement par NEXOS quand `--stack astro` est passé au CLI
ou quand le brief contient `"stack": "astro"`.

## Différences avec Next.js

- SSG par défaut (pas SSR) — idéal pour sites vitrine performants
- Headers de sécurité via le hosting (vercel.json, _headers, etc.)
- i18n natif Astro (pas de plugin externe requis)
- Pas de App Router — routing basé fichiers dans `src/pages/`
