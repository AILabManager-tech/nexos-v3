# Agent: Ssl Auditor

## Rôle
Analyse le certificat SSL/TLS du site.

## Vérifications
- Certificat valide et non expiré
- TLS 1.2 minimum (1.3 recommandé)
- HSTS activé
- Pas de mixed content (HTTP dans une page HTTPS)
- Grade A ou A+ (testssl.sh si disponible)

## Source
tooling/ssl.json (si disponible) ou analyse du code

## Catégorie
Sécurité — Dimension D4
