# NEXOS v4.0 — Pipeline Web Autonome

NEXOS est un systeme de creation et d'audit de sites web professionnels pilote par IA.
Il orchestre 46+ agents specialises a travers 6 phases sequentielles avec quality gates SOIC.

## Quick Start

```bash
# 1. Installer la commande CLI
bash install_nexos.sh

# 2. Lancer l'accueil NEXOS interactif
nexos

# 3. Verifier que le systeme est operationnel
nexos doctor

# 4. Creer un site complet depuis un brief
nexos create --brief clients/.template/brief-client.json

# 5. Auditer un site existant
nexos audit --client-dir clients/mon-client --url https://example.com

# 6. Corriger automatiquement un client
nexos fix clients/mon-client
nexos fix clients/mon-client --dry-run   # apercu sans appliquer
```

`nexos` sans argument ouvre maintenant un accueil NEXOS interactif:
1. menu principal (`create`, `audit`, `modify`, etc.)
2. selection du CLI hote
3. recommandation + forces/faiblesses de chaque CLI selon le type de travail
4. ecran de resume final avec confirmation ou retour arriere
5. lancement du CLI choisi avec bootstrap NEXOS

Astuce: appuyer sur `Entree` accepte le choix recommande, `b` revient a l'etape precedente et `q` quitte l'accueil NEXOS.

## Prerequis

| Outil | Version min | Critique | Installation |
|-------|-------------|----------|-------------|
| Python | 3.10+ | Oui | systeme |
| Node.js | 20.0+ | Oui | https://nodejs.org |
| npm | inclus | Oui | inclus avec Node |
| Codex CLI | latest | Oui | `npm i -g @openai/codex` |
| Lighthouse | latest | Non | `npm i -g lighthouse` |
| pa11y | latest | Non | `npm i -g pa11y` |

Verifiez avec `nexos doctor` pour un diagnostic complet.

## Architecture

```
NEXOS v4.0 = Multi-phase x Quality Gates x Tooling Reel x Auto-Fix

                    orchestrator.py
                         |
          +--------------+--------------+
          |              |              |
     nexos/         agents/        templates/
   (modules)      (46 agents)    (15 templates)
          |              |
  +-------+-------+     +-- ph0-discovery (6)
  |       |       |     +-- ph1-strategy  (6)
  | tooling_mgr   |     +-- ph2-design    (6)
  | build_valid    |     +-- ph3-content   (6)
  | auto_fixer     |     +-- ph4-build     (7)
  | cli_commands   |     +-- ph5-qa       (24)
  +-------+-------+     +-- site-update   (6)
          |
     soic/ (symlink)
    Quality Gates
```

## Modes d'operation

| Commande | Description |
|----------|-------------|
| `nexos create --brief <path>` | Creation complete ph0 → ph5 |
| `nexos audit --client-dir <dir> --url <url>` | Audit site existant (ph5-qa) |
| `nexos modify --client-dir <dir>` | Modification ciblee |
| `nexos content --client-dir <dir>` | Redaction/traduction (ph3) |
| `nexos analyze --client-dir <dir>` | Discovery seule (ph0) |
| `nexos converge <dir> --target 8.5` | Boucle convergence SOIC |
| `nexos doctor` | Diagnostic systeme |
| `nexos fix <dir> [--dry-run]` | Auto-correction D4/D8 |
| `nexos report <dir>` | Rapport agrege client |

## Pipeline de creation (mode `create`)

```
ph0-discovery → ph1-strategy → ph2-design → ph3-content → ph4-build → ph5-qa
     |               |              |             |             |          |
   mu>=7.0        mu>=8.0       mu>=8.0       mu>=8.0     BUILD PASS  mu>=8.5
                                                               |
                                                         auto-fix si FAIL
                                                         (try-fix-retry)
```

Chaque transition est gardee par un quality gate SOIC (9 dimensions, score mu pondere).
Le threshold de deploiement est mu >= 8.5 a la sortie de ph5-qa.

## Auto-Fix v4.0

Le module `nexos/auto_fixer.py` corrige automatiquement les problemes recurrents :

| Fix | Dimension | Description |
|-----|-----------|-------------|
| Cookie consent | D8 Loi 25 | Copie template + injection dans layout.tsx |
| npm audit fix | D4 Securite | Corrige les vulnerabilites connues |
| Vercel headers | D4 Securite | Ajoute les 6 headers requis |
| next.config | D4 Securite | `poweredByHeader: false` |
| Politique confidentialite | D8 Loi 25 | Genere la page depuis template + brief |
| Mentions legales | D8 Loi 25 | Genere la page depuis template + brief |

## Structure client

```
clients/{slug}/
+-- brief-client.json          # Brief client (donnees legales Loi 25)
+-- ph0-discovery-report.md    # Rapport phase 0
+-- ph1-strategy-report.md     # Rapport phase 1
+-- ph2-design-report.md       # Rapport phase 2
+-- ph3-content-report.md      # Rapport phase 3
+-- ph4-build-log.md           # Log de build
+-- ph5-qa-report.md           # Rapport QA final
+-- soic-gates.json            # Historique des quality gates
+-- tooling/                   # Resultats scans (lighthouse, pa11y, etc.)
+-- site/                      # Code source du site Next.js
```

## Stack technique par defaut

- **Framework** : Next.js 15+ (App Router)
- **Langage** : TypeScript 5 (strict mode)
- **CSS** : Tailwind CSS 3.4+
- **Tests** : Vitest + @testing-library/react
- **i18n** : next-intl (FR/EN minimum)
- **Deploiement** : Vercel
- **Conformite** : Loi 25 du Quebec (obligatoire)

## Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](CLAUDE.md) | Specification architecturale complete |
| [CHANGELOG.md](CHANGELOG.md) | Historique des versions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guide de contribution |
| [INTEGRATION.md](INTEGRATION.md) | Design tokens et patches agents |
| [docs/api-reference.md](docs/api-reference.md) | Reference API modules nexos/ |
| [docs/architecture.md](docs/architecture.md) | Architecture detaillee |
| [docs/deployment.md](docs/deployment.md) | Guide de deploiement |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Erreurs frequentes et solutions |

## License

Propriete de Mark Systems. Voir [LICENSE](LICENSE).
