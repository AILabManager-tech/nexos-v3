# Knowledge Agents — Orchestrator

## Role
Tu coordonnes les agents cognitifs NEXOS — des outils de synthese, d'analyse
et de transformation de connaissances independants du pipeline web (ph0-ph5).

## Agents disponibles

| ID | Agent | Description |
|----|-------|-------------|
| HexaBrief | **hexabrief** | Synthese livres / articles → resume dense + flashcards | ACTIF |

## Invocation
Ces agents sont invocables via :
```bash
python nexos_cli.py knowledge hexabrief [options]
```

## Conventions
- Chaque agent produit un fichier Markdown structure dans `output/knowledge/`
- Le scoring qualite suit le modele SOIC (dimensions specifiques par agent)
- Les agents knowledge ne participent PAS aux quality gates ph0-ph5
- Ils ont leur propre grille d'evaluation documentee dans chaque agent .md
