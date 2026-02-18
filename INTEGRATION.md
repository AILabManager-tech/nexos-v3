# NEXOS — Intégration des Design Tokens dans le Pipeline

## Fichiers livrés

```
templates/design-tokens.schema.json   → Schéma JSON (contrat de données)
examples/usine-rh.design-tokens.json  → Exemple industriel (dark, brut, Oswald)
examples/plomberie-qc.design-tokens.json → Exemple artisan (light, rond, Nunito)
tools/generate_tailwind.py            → Générateur tailwind.config.ts + CSS vars
```

## Installation

```bash
# Depuis ~/___00___MARK_SYSTEMS_BIZ___/03_PRODUITS/NEXOS/nexos_v.3.0/

# 1. Copier les fichiers
cp templates/design-tokens.schema.json templates/
cp tools/generate_tailwind.py tools/

# 2. Pour chaque nouveau client :
cp examples/usine-rh.design-tokens.json clients/<CLIENT_SLUG>/design-tokens.json
# → Éditer les valeurs selon le brief

# 3. Générer la config Tailwind
python tools/generate_tailwind.py clients/<CLIENT_SLUG>/design-tokens.json clients/<CLIENT_SLUG>/
```

---

## Patches Agents (à appliquer manuellement)

### PATCH 1 — `agents/ph0-discovery/_orchestrator.md`

Ajouter à la fin de la section "Outputs" :

```markdown
### Output additionnel : design-tokens-draft.json

Le `design-critic.md` analyse les `reference_urls` du brief et produit un draft de
`design-tokens.json` avec :
- Palette extraite des sites de référence
- Archétype détecté (corporate/artisan/portfolio/etc.)
- `anti_patterns[]` peuplé à partir des faiblesses identifiées
- `style_mood` inféré du secteur d'activité et du brief
```

### PATCH 2 — `agents/ph0-discovery/design-critic.md`

Ajouter à la section "Responsabilités" :

```markdown
## Responsabilité additionnelle : Initialisation des Design Tokens

Après analyse des sites de référence, je produis un fichier `design-tokens-draft.json`
conforme au schéma `templates/design-tokens.schema.json`.

Processus :
1. Analyser les `reference_urls` du brief (couleurs dominantes, typo, layout)
2. Croiser avec le `style_mood` demandé par le client
3. Choisir un `archetype` parmi : corporate, artisan, portfolio, magazine, landing, saas
4. Remplir `anti_patterns[]` avec les patterns à éviter (basé sur la concurrence analysée)
5. Proposer 2-3 variantes de palette (le client choisit)

⚠️ RÈGLE CRITIQUE : Si le client précédent utilisait archetype=X + hero_style=Y,
   le nouveau client doit différer sur AU MOINS 2 de ces 3 axes :
   - archetype
   - hero_style
   - style_mood
```

### PATCH 3 — `agents/ph2-design/design-system-architect.md`

Remplacer la section de création du design system par :

```markdown
## Source de vérité : design-tokens.json

Je ne crée PAS le design system de zéro. Je consomme `design-tokens.json` du client.

Workflow :
1. Lire `clients/<slug>/design-tokens.json`
2. Exécuter `python tools/generate_tailwind.py` pour produire :
   - `tailwind.config.ts` (couleurs, typo, spacing, radius, shadows)
   - `design-tokens.css` (CSS custom properties)
   - `google-fonts-url.txt` (lien d'import)
3. Copier les outputs dans le projet Next.js du client
4. Vérifier que `anti_patterns[]` n'est violé par aucun composant

❌ INTERDIT : Inventer des couleurs, des polices ou des radius qui ne sont pas
   dans `design-tokens.json`. Toute déviation doit être justifiée et loggée.
```

### PATCH 4 — `agents/ph2-design/layout-designer.md`

Ajouter en tête du fichier :

```markdown
## Contraintes de layout depuis design-tokens.json

Avant de concevoir un layout, je lis :
- `layout.nav_style` → détermine le type de navigation
- `layout.hero_style` → détermine le hero (PAS de choix libre)
- `layout.section_divider` → séparateurs entre sections
- `layout.footer_style` → structure du footer
- `layout.card_style` → elevated/outlined/flat/glass
- `meta.archetype` → influence la structure globale des pages

⚠️ `anti_patterns[]` est une liste de VETO. Si "rounded-xl cards" est listé,
   je n'utilise JAMAIS rounded-xl sur les cards, même si ça "paraît mieux".
```

### PATCH 5 — `agents/ph4-build/component-builder.md`

Ajouter :

```markdown
## Règle d'implémentation des tokens

- Toutes les couleurs viennent de `tailwind.config.ts` (PAS de hex hardcodé)
- `font-heading` pour h1-h6, `font-body` pour le reste
- Les `borderRadius` viennent des tokens (PAS de `rounded-2xl` arbitraire)
- Les `boxShadow` viennent des tokens
- Si `motion.enabled` est false → aucune animation framer-motion
- Si `motion.intensity` est "subtle" → durées ≤ 200ms, ease-out uniquement

Vérification : `grep -rn "rounded-\|shadow-\|#[0-9a-f]\{6\}" src/` ne doit
retourner AUCUN hardcode qui ne correspond pas aux tokens.
```

### PATCH 6 — `agents/ph5-qa/_orchestrator.md`

Ajouter un check :

```markdown
## Check additionnel : Token Compliance

Le `visual-qa.md` vérifie :
1. Aucune couleur hex hardcodée hors de `design-tokens.json`
2. Aucun `rounded-*` hors des valeurs définies dans `borders.radius`
3. Aucune font-family hors de `fontFamily` dans les tokens
4. `anti_patterns[]` respectés (grep négatif sur chaque pattern)
5. Score : 100% compliance = PASS, <95% = FAIL + itération
```

---

## Intégration dans `orchestrator.py`

Ajouter dans le flow entre ph0 et ph2 :

```python
# Après ph0, avant ph2 :
def inject_design_tokens(client_dir: str):
    tokens_path = Path(client_dir) / "design-tokens.json"
    if not tokens_path.exists():
        raise FileNotFoundError(
            f"design-tokens.json manquant pour {client_dir}. "
            f"Le design-critic de ph0 aurait dû le générer."
        )
    # Générer tailwind.config.ts
    subprocess.run([
        sys.executable, "tools/generate_tailwind.py",
        str(tokens_path), client_dir
    ], check=True)
```

---

## Différenciation mesurable

Avec les deux exemples fournis :

| Propriété | usine-rh | plomberie-qc | Δ |
|---|---|---|---|
| Background | `#1c1917` (dark) | `#f9fafb` (light) | Inversé |
| Heading font | Oswald uppercase | Nunito normal | Différent |
| Border radius sm | 2px | 8px | ×4 |
| Hero style | full-bleed-image | split-text-image | Différent |
| Nav style | fixed-top | sticky-top | Différent |
| Card style | flat | elevated | Différent |
| Section divider | angle | wave | Différent |
| Shadows | dramatic | subtle | Opposé |
| Anti-patterns | pill buttons | dark theme | Croisés |

**Résultat** : même pipeline, même code, deux sites visuellement distincts.
