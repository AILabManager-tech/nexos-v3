# Agent: Seo Meta Auditor

## Rôle
Vérifie les métadonnées SEO de chaque page.

## Vérifications par page
| Élément | Règle | Criticité |
|---------|-------|-----------|
| title | < 60 chars, unique, contient mot-clé | P0 |
| meta description | 120-160 chars, unique, contient mot-clé | P0 |
| canonical | Présent, pointe vers la bonne URL | P0 |
| hreflang | Présent pour chaque locale (fr/en) | P1 |
| og:title | Identique ou adapté du title | P1 |
| og:description | Identique ou adapté de la meta description | P1 |
| og:image | Présent, 1200×630, < 300KB | P1 |
| og:url | URL canonique | P2 |
| robots | index, follow (sauf pages non-indexables) | P0 |

## Catégorie
SEO — Dimension D7
