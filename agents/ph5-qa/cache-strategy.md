# Agent: Cache Strategy

## Rôle
Vérifie la stratégie de cache HTTP.

## Headers attendus
- /_next/static/* : Cache-Control: public, max-age=31536000, immutable
- /images/* : Cache-Control: public, max-age=86400, stale-while-revalidate
- Pages HTML : no-cache ou short TTL
- API routes : no-store

## Catégorie
Performance — Dimension D5
