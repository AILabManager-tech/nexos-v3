# NEXOS v4.0 — Troubleshooting

## Erreurs frequentes

### `RuntimeError: Outils critiques manquants: node`

**Cause :** Node.js n'est pas installe ou la version est < 20.0.0.

**Solution :**
```bash
# Verifier la version
node --version

# Installer/mettre a jour via nvm
nvm install 20
nvm use 20
```

---

### `RuntimeError: Outils critiques manquants: claude`

**Cause :** Claude Code CLI n'est pas installe.

**Solution :**
```bash
npm i -g @anthropic-ai/claude-code
claude --version
```

---

### `BUILD FAIL: npm install echoue`

**Cause :** Dependances corrompues ou conflit de versions.

**Solutions :**
```bash
# Supprimer et reinstaller
rm -rf node_modules package-lock.json
npm install

# Si probleme persiste, verifier la version Node
node --version  # doit etre >= 20
```

---

### `BUILD FAIL: npm run build echoue (timeout >300s)`

**Cause :** Le build Next.js depasse les 5 minutes.

**Solutions :**
- Verifier qu'il n'y a pas de boucle d'import circulaire
- Reduire la taille des images dans `public/`
- Verifier que les API routes ne font pas d'appels reseau au build

---

### `BUILD FAIL: Headers securite vercel.json`

**Cause :** Les 6 headers requis ne sont pas tous presents dans `vercel.json`.

**Solution :**
```bash
# Auto-fix ajoute les headers manquants
nexos fix clients/mon-client

# Ou copier le template
cp templates/vercel-headers.template.json clients/mon-client/site/vercel.json
```

Headers requis :
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security
- X-DNS-Prefetch-Control

---

### `tsc --noEmit echoue mais build passe`

**Cause normale :** Les erreurs TypeScript sont dans les fichiers de test (`.test.ts`) qui ne sont pas compiles par Next.js.

**Comportement :** `tsc_ok=False` n'empeche PAS `overall_pass=True`. C'est informationnel.

**Si vous voulez corriger :**
```bash
cd clients/mon-client/site
npx tsc --noEmit 2>&1 | head -20
# Corriger les erreurs affichees
```

---

### `Cookie consent non injecte (template absent)`

**Cause :** Le fichier `templates/cookie-consent-component.tsx` n'existe pas.

**Solution :**
```bash
# Verifier les templates
nexos doctor
# Section TEMPLATES montrera les fichiers manquants
```

---

### `Page politique-confidentialite non generee`

**Cause :** Le template `templates/privacy-policy-template.md` est absent, ou la page existe deja.

**Verification :**
```bash
# Verifier si la page existe
ls clients/mon-client/site/src/app/\[locale\]/politique-confidentialite/

# Verifier le template
ls templates/privacy-policy-template.md
```

---

### `Module not found: @/components/cookie-consent`

**Cause :** L'import path genere ne correspond pas a l'emplacement reel du composant.

**Solution :** Le v4.0 auto_fixer resout dynamiquement le path. Si le probleme persiste :
```bash
# Trouver le fichier
find clients/mon-client/site/src -iname "*cookie*consent*"

# Verifier l'import dans layout.tsx
grep -n "CookieConsent" clients/mon-client/site/src/app/\[locale\]/layout.tsx
```

---

### `nexos doctor: soic/ absent`

**Cause :** Le symlink `soic/` vers le moteur SOIC n'est pas configure.

**Solution :**
```bash
# Creer le symlink
ln -s /chemin/vers/soic soic
```

---

### `nexos fix: pas de package.json`

**Cause :** La structure du client ne contient pas de site Next.js.

**Verification :**
```bash
ls clients/mon-client/site/package.json
# ou
ls clients/mon-client/package.json
```

Le repertoire site peut etre :
- `clients/<slug>/site/` (structure standard)
- `clients/<slug>/` (structure plate)

---

### `ImportError: No module named 'nexos'`

**Cause :** Le package n'est pas installe ou le PYTHONPATH n'inclut pas le repertoire.

**Solution :**
```bash
cd nexos_v.3.0
pip install -e .
# ou
export PYTHONPATH="$PWD:$PYTHONPATH"
```

---

### `ImportError: No module named 'rich'`

**Cause :** La dependance `rich` n'est pas installee.

**Solution :**
```bash
pip install rich>=13.0
# ou
pip install -e ".[dev]"
```

**Note :** Les modules NEXOS fonctionnent sans Rich (fallback sur print), mais l'affichage sera degrade.

---

## Diagnostic complet

```bash
# 1. Verifier l'environnement
nexos doctor

# 2. Analyser un client sans appliquer
nexos fix clients/mon-client --dry-run

# 3. Voir le rapport complet
nexos report clients/mon-client

# 4. Lancer les tests
python -m pytest tests/ -v
```

## Logs et debug

### Activer le mode verbose

L'orchestrateur affiche les informations de progression via Rich. Pour plus de detail :

```bash
# Voir les commandes subprocess executees
python -c "
import logging
logging.basicConfig(level=logging.DEBUG)
from nexos.build_validator import validate_build
from pathlib import Path
validate_build(Path('clients/mon-client/site'))
"
```

### Verifier un client specifique

```python
from nexos.build_validator import validate_build, format_build_report
from pathlib import Path

result = validate_build(Path("clients/mon-client/site"))
print(format_build_report(result))
```

### Tester un fix specifique

```python
from nexos.auto_fixer import FixReport, _fix_vercel_headers
from pathlib import Path

report = FixReport()
_fix_vercel_headers(Path("clients/mon-client/site"), report)
print(f"Headers fixes: {report.vercel_headers_fixed}")
```
