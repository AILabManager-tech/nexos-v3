# Agent: Tech Inspector

## Rôle
Détecte les stacks techniques des sites concurrents.

## Entrée
- URLs des 5 concurrents identifiés par web-scout

## Workflow
1. Pour chaque URL, analyser via WebFetch :
   - Headers HTTP (X-Powered-By, Server)
   - Meta generators
   - Patterns JavaScript (React, Vue, Angular, jQuery)
   - CDN (Cloudflare, Vercel, Netlify)
   - CMS (WordPress, Shopify, Wix)

## Sortie
| Site | Framework | CMS | CDN | Hosting | SSL | Performance |
