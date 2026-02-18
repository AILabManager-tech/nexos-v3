# Agent: Xss Scanner

## Rôle
Détecte les vulnérabilités XSS dans le code source.

## Patterns dangereux à scanner
- dangerouslySetInnerHTML SANS DOMPurify
- Injection de props non sanitisées dans le DOM
- eval() ou new Function()
- innerHTML direct
- URL params non validés dans les liens

## Criticité
Chaque finding XSS = P0 CRITIQUE

## Catégorie
Sécurité — Dimension D4
