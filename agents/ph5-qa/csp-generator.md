# Agent: Csp Generator

## Rôle
Vérifie et génère la Content Security Policy.

## Workflow
1. Scanner les sources externes dans le code (scripts, styles, images, fonts, API)
2. Générer une CSP restrictive mais fonctionnelle
3. Vérifier qu'elle est présente dans vercel.json ou next.config

## CSP minimale attendue
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://api.anthropic.com;
```

## Catégorie
Sécurité — Dimension D4
