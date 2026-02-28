# NEXOS v4.0 — Reference API des modules `nexos/`

## Vue d'ensemble

Le package `nexos/` contient 4 modules qui augmentent `orchestrator.py` :

```
nexos/
├── __init__.py           # __version__ = "4.0.0"
├── tooling_manager.py    # Verification outils CLI
├── build_validator.py    # Validation build reelle
├── auto_fixer.py         # Auto-correction D4/D8
└── cli_commands.py       # Commandes CLI standalone
```

Tous les modules sont optionnels. Si `nexos/` est absent, `orchestrator.py` fonctionne en mode v3.0.

---

## `nexos.tooling_manager`

Verifie que les outils CLI requis sont installes avant de lancer le pipeline.

### Constantes

#### `REQUIRED_TOOLS: dict[str, dict]`

Dictionnaire des outils requis avec leur configuration :

| Cle | Type | Description |
|-----|------|-------------|
| `cmd` | `list[str]` | Commande pour verifier la version |
| `min_version` | `str \| None` | Version minimale requise |
| `install` | `str` | Instructions d'installation |
| `critical` | `bool` | Si `True`, l'absence arrete le pipeline |

Outils definis :
- `node` (critical, min 20.0.0)
- `npm` (critical)
- `claude` (critical)
- `lighthouse` (optionnel)
- `pa11y` (optionnel)

### Fonctions

#### `check_tool(name: str) -> tuple[bool, Optional[str]]`

Verifie si un outil est installe et sa version.

**Parametres :**
- `name` — Nom de l'outil (cle dans `REQUIRED_TOOLS`)

**Retourne :** `(disponible, version_string)`
- `(True, "v22.20.0")` — Outil trouve, version OK
- `(False, "v18.0.0")` — Outil trouve, version trop basse
- `(False, None)` — Outil non trouve

**Exceptions :** Aucune (capture FileNotFoundError, TimeoutExpired, OSError)

---

#### `ensure_tooling(interactive: bool = True) -> dict[str, bool]`

Verifie tous les outils et retourne leur statut.

**Parametres :**
- `interactive` — Si `True`, propose d'installer les outils optionnels manquants

**Retourne :** `{"node": True, "npm": True, "lighthouse": False, ...}`

**Exceptions :**
- `RuntimeError` — Si un outil critique (node, npm, claude) manque

**Exemple :**
```python
from nexos.tooling_manager import ensure_tooling

results = ensure_tooling(interactive=False)
if not results["lighthouse"]:
    print("Lighthouse absent — scan performances desactive")
```

---

#### `doctor_report() -> str`

Genere un rapport complet du systeme pour `nexos doctor`.

**Retourne :** Texte formate multi-sections :
1. **OUTILS CLI** — Statut de chaque outil
2. **TEMPLATES** — Presence des 7 templates critiques
3. **SOIC ENGINE** — Etat du symlink soic/
4. **CLIENTS** — Nombre de clients et ceux avec un site/

---

#### `_parse_version(version_str: str) -> tuple[int, ...]`

Extrait les composants numeriques d'une version.

```python
_parse_version("v22.20.0")     # (22, 20, 0)
_parse_version("2.1.62 (CLI)") # (2, 1, 62)
_parse_version("no version")   # (0,)
```

---

## `nexos.build_validator`

Remplace la validation superficielle "BUILD PASS" de Ph4 par des verifications reelles.

### Constantes

#### `CRITICAL_FILES: list[str]`

Fichiers dont la presence est verifiee :
- `vercel.json`
- `next.config.mjs`
- `src/app/[locale]/politique-confidentialite/page.tsx`
- `src/app/[locale]/mentions-legales/page.tsx`

#### `REQUIRED_HEADERS: list[str]`

Headers de securite requis dans `vercel.json` :
- `x-content-type-options`
- `x-frame-options`
- `referrer-policy`
- `permissions-policy`
- `strict-transport-security`
- `x-dns-prefetch-control`

### Classes

#### `BuildResult`

```python
@dataclass
class BuildResult:
    npm_install_ok: bool = False
    tsc_ok: bool = False
    tsc_errors: list[str] = field(default_factory=list)
    build_ok: bool = False
    build_errors: str = ""
    audit_highs: int = 0
    audit_criticals: int = 0
    missing_files: list[str] = field(default_factory=list)
    headers_ok: bool = False
    overall_pass: bool = False
```

**Note :** `tsc_ok` est non-bloquant. `overall_pass` ne depend que de :
- `npm_install_ok`
- `build_ok`
- `audit_criticals == 0`
- `headers_ok`

### Fonctions

#### `validate_build(site_dir: Path) -> BuildResult`

Execute toutes les validations build sur le site genere.

**Etapes :**
1. `npm install` (si node_modules absent, timeout 120s)
2. `npx tsc --noEmit` (timeout 120s, non-bloquant)
3. `npm run build` (timeout 300s)
4. `npm audit --json` (parse HIGH/CRITICAL)
5. Verification des fichiers critiques
6. Verification des headers vercel.json

**Parametres :**
- `site_dir` — Chemin vers le repertoire du site Next.js

**Retourne :** `BuildResult` avec tous les champs remplis

**Comportement short-circuit :** Si `npm install` echoue, retourne immediatement avec `overall_pass=False`.

---

#### `format_build_report(result: BuildResult) -> str`

Formatte un `BuildResult` en texte lisible.

```
NEXOS v4.0 — Build Validation Report
=============================================
  [+] npm install
  [-] tsc --noEmit (3 erreurs)
  [+] npm run build
  [+] npm audit (HIGH:0 CRITICAL:0)
  [+] Fichiers critiques (0 manquants)
  [+] Headers securite vercel.json
=============================================

  Resultat: BUILD PASS
```

---

### Fonctions internes

| Fonction | Retour | Description |
|----------|--------|-------------|
| `_check_npm_install(site_dir)` | `bool` | npm install si node_modules absent |
| `_check_tsc(site_dir)` | `(bool, list[str])` | tsc --noEmit, retourne erreurs |
| `_check_build(site_dir)` | `(bool, str)` | npm run build, retourne stderr |
| `_check_audit(site_dir)` | `(int, int)` | npm audit, retourne (highs, criticals) |
| `_check_critical_files(site_dir)` | `list[str]` | Liste des fichiers manquants |
| `_check_vercel_headers(site_dir)` | `bool` | Verifie les 6 headers requis |

---

## `nexos.auto_fixer`

Auto-correction des problemes D4 (Securite) et D8 (Loi 25) les plus frequents.

### Constantes

#### `TEMPLATES_DIR: Path`

Chemin vers le repertoire `templates/` (relatif au package).

#### `REQUIRED_HEADERS: dict[str, str]`

Headers de securite avec leurs valeurs par defaut :

```python
{
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "on",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
}
```

### Classes

#### `FixReport`

```python
@dataclass
class FixReport:
    cookie_consent_added: bool = False
    npm_audit_fixed: int = 0
    vercel_headers_fixed: bool = False
    next_config_patched: bool = False
    privacy_page_added: bool = False
    legal_page_added: bool = False

    @property
    def total_fixes(self) -> int: ...  # Nombre de categories corrigees (0-6)
```

### Fonctions

#### `auto_fix(site_dir: Path, client_dir: Path, brief: dict | None = None) -> FixReport`

Applique tous les auto-fixes D4/D8.

**Parametres :**
- `site_dir` — Repertoire du site Next.js
- `client_dir` — Repertoire client NEXOS (contient brief-client.json)
- `brief` — Brief pre-charge. Si `None`, tente de lire `brief-client.json`

**Retourne :** `FixReport` avec le detail de chaque correction

**Ordre d'execution :**
1. `_fix_cookie_consent` — Copie template + injection layout.tsx
2. `_fix_npm_audit` — `npm audit fix`
3. `_fix_vercel_headers` — Ajoute headers manquants
4. `_fix_next_config` — `poweredByHeader: false`
5. `_fix_privacy_page` — Genere page politique-confidentialite
6. `_fix_legal_page` — Genere page mentions-legales

---

### Fonctions de fix

#### `_fix_cookie_consent(site_dir, report)`

1. Cherche un fichier contenant "cookie" ET "consent" dans `src/components/`
2. Si absent, copie `templates/cookie-consent-component.tsx`
3. Trouve le `layout.tsx` (locale ou racine)
4. Si `<CookieConsent` absent, injecte l'import et le composant avant `</body>`
5. L'import path est calcule dynamiquement depuis l'emplacement reel du fichier

#### `_fix_npm_audit(site_dir, report)`

Execute `npm audit fix` (timeout 60s). Parse "fixed X of Y" dans la sortie.

#### `_fix_vercel_headers(site_dir, report)`

- Si `vercel.json` absent → copie template
- Si JSON corrompu → remplace par template
- Sinon → ajoute les headers manquants au bloc `/(.*)`

#### `_fix_next_config(site_dir, report)`

- Cherche dans `next.config.mjs`, `.js`, `.ts`
- Si `poweredByHeader: true` → change a `false`
- Si absent → ajoute apres le premier `{` du config

#### `_fix_privacy_page(site_dir, brief, report)`

Genere `src/app/[locale]/politique-confidentialite/page.tsx` depuis le template markdown.
Remplace les placeholders `{{VAR}}` depuis `brief.legal`.

#### `_fix_legal_page(site_dir, brief, report)`

Meme pattern que `_fix_privacy_page` pour les mentions legales.

---

### Fonctions utilitaires

#### `_markdown_to_html(md: str) -> str`

Conversion markdown simplifiee : headings (h1-h3), listes, paragraphes, bold, italic.

#### `_inline_md(text: str) -> str`

Convertit `**bold**` et `*italic*` en HTML inline.

#### `_generate_legal_page_tsx(markdown_content, title) -> str`

Genere un composant Next.js `page.tsx` qui rend du HTML statique avec `dangerouslySetInnerHTML`.

---

## `nexos.cli_commands`

Commandes CLI standalone accessibles via `nexos doctor/fix/report`.

### Fonctions

#### `run_doctor()`

Affiche le diagnostic complet dans un Panel Rich.

```bash
nexos doctor
```

---

#### `run_fix(client_dir: Path, dry_run: bool = False)`

Applique les auto-fixes D4/D8 sur un client.

**Flux :**
1. Detecte le repertoire site (`client_dir/site/` ou `client_dir/`)
2. Valide le build (avant)
3. Si `dry_run=True` → analyse sans appliquer, affiche les corrections possibles
4. Si `overall_pass=True` et aucun probleme non-bloquant → sort
5. Applique `auto_fix()`
6. Re-valide le build (apres)
7. Affiche le resume

```bash
nexos fix clients/mon-client
nexos fix clients/mon-client --dry-run
```

---

#### `run_report(client_dir: Path)`

Affiche un rapport agrege du client :
1. **Phases** — Rapports presents/absents avec taille
2. **SOIC Gates** — Historique mu + decisions
3. **Tooling** — Resultats scans disponibles
4. **Site** — Fichiers critiques + headers
5. **Brief** — Nom entreprise + RPP

```bash
nexos report clients/mon-client
```

---

#### `_dry_run_analysis(site_dir: Path, client_dir: Path)`

Analyse interne pour le mode `--dry-run`. Verifie :
- Cookie consent present
- vercel.json et headers
- poweredByHeader dans next.config
- Pages legales
- npm audit (toujours suggere)

---

## Integration dans `orchestrator.py`

Le package `nexos/` s'integre a 4 points dans l'orchestrateur :

### 1. Imports conditionnels (debut du fichier)
```python
try:
    from nexos.tooling_manager import ensure_tooling
    from nexos.build_validator import validate_build
    from nexos.auto_fixer import auto_fix
    _NEXOS_V4 = True
except ImportError:
    _NEXOS_V4 = False
```

### 2. Verification tooling (debut de `run_pipeline()`)
```python
if _NEXOS_V4:
    ensure_tooling(interactive=False)
```

### 3. Auto-fix avant ph5 (preflight)
```python
if phase == "ph5-qa" and _NEXOS_V4 and site_dir:
    fix_report = auto_fix(site_dir, client_dir, brief)
```

### 4. Validation build reelle (Ph4)
```python
if threshold is None and _NEXOS_V4:
    build_result = validate_build(site_dir)
    if not build_result.overall_pass:
        # try-fix-retry (1 tentative)
        auto_fix(site_dir, client_dir, brief)
        build_result = validate_build(site_dir)
```

### 5. Commandes CLI (sous-parseurs)
```python
# nexos doctor / nexos fix / nexos report
```
