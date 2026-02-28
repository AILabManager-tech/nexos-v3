# Contribuer a NEXOS

## Pre-requis

```bash
# Verifier l'environnement
nexos doctor

# Installer les dependances de dev
pip install -e ".[dev]"
```

## Structure du projet

```
nexos_v.3.0/
├── orchestrator.py      # Moteur principal (~1100 lignes)
├── nexos/               # Package Python v4.0
│   ├── __init__.py
│   ├── tooling_manager.py   # Verification outils CLI
│   ├── build_validator.py   # Validation build reelle
│   ├── auto_fixer.py        # Auto-correction D4/D8
│   └── cli_commands.py      # Commandes CLI standalone
├── agents/              # 46 agents specialises (markdown)
│   ├── ph0-discovery/   # 6 agents
│   ├── ph1-strategy/    # 6 agents
│   ├── ph2-design/      # 6 agents
│   ├── ph3-content/     # 6 agents
│   ├── ph4-build/       # 7 agents
│   ├── ph5-qa/          # 24 agents (dont 15 QA specialises)
│   └── site-update/     # 6 agents
├── templates/           # 15 templates securises
├── soic/                # Moteur SOIC (symlink)
├── tools/               # Scripts utilitaires
├── tests/               # Tests pytest
├── clients/             # Repertoires clients
└── docs/                # Documentation etendue
```

## Conventions de code

### Python (package `nexos/`)

- **Python 3.10+** minimum
- Type hints obligatoires sur les fonctions publiques
- Dataclasses pour les structures de donnees (`BuildResult`, `FixReport`)
- Gestion d'erreur : `try/except` avec fallback gracieux (pas de crash)
- Rich pour la console (avec fallback si absent) :
  ```python
  try:
      from rich.console import Console
      console = Console()
  except ImportError:
      class Console:
          def print(self, *a, **kw): print(*a)
      console = Console()
  ```
- Imports conditionnels pour la retrocompatibilite :
  ```python
  try:
      from nexos.module import function
      _NEXOS_V4 = True
  except ImportError:
      _NEXOS_V4 = False
  ```

### Agents (markdown)

- Un fichier `.md` par agent, un domaine par agent
- `_orchestrator.md` dans chaque dossier de phase = point d'entree
- Format des outputs : toujours indiquer le fichier cible et le format attendu
- References SOIC : utiliser les dimensions D1-D9 explicitement

### Templates

- Placeholders : `{{VARIABLE_NAME}}` (double accolades, UPPER_SNAKE_CASE)
- Commentaires d'instructions en tete de chaque template
- Nom de fichier : `<usage>.template.<ext>` (sauf composants `.tsx`)

## Tests

### Lancer les tests

```bash
# Tous les tests
cd nexos_v.3.0
python -m pytest tests/ -v

# Un module specifique
python -m pytest tests/test_auto_fixer.py -v

# Avec couverture
python -m pytest tests/ -v --cov=nexos --cov-report=term-missing
```

### Ecrire un test

- Fichier : `tests/test_<module>.py`
- Classes de test groupees par fonctionnalite
- Utiliser `tmp_path` (fixture pytest) pour les fichiers temporaires
- Mocker les subprocess avec `@patch("nexos.module.subprocess.run")`
- Mocker `console` pour les commandes CLI avec `@patch("nexos.cli_commands.console")`

Exemple :
```python
class TestFixNextConfig:
    def test_adds_powered_by_header(self, tmp_path):
        config = tmp_path / "next.config.mjs"
        config.write_text('const nextConfig = {\n  images: {},\n};\n')

        report = FixReport()
        _fix_next_config(tmp_path, report)

        assert report.next_config_patched is True
        assert "poweredByHeader: false" in config.read_text()
```

## Ajouter un nouveau module `nexos/`

1. Creer `nexos/mon_module.py` avec docstring et pattern Rich fallback
2. Creer `tests/test_mon_module.py`
3. Importer conditionnellement dans `orchestrator.py` :
   ```python
   try:
       from nexos.mon_module import ma_fonction
       _NEXOS_V4 = True
   except ImportError:
       _NEXOS_V4 = False
   ```
4. Documenter dans `docs/api-reference.md`
5. Ajouter l'entree dans `CHANGELOG.md`

## Ajouter un nouveau template

1. Creer `templates/<usage>.template.<ext>`
2. Ajouter un commentaire d'instructions en tete
3. Utiliser les placeholders `{{VAR}}` pour les valeurs dynamiques
4. Ajouter la verification dans `tooling_manager.py:_check_templates()`
5. Si auto-applicable, ajouter le fix dans `auto_fixer.py`

## Ajouter un agent

1. Creer `agents/<phase>/<nom-agent>.md`
2. Mettre a jour le `_orchestrator.md` de la phase pour l'inclure
3. Format : role, responsabilites, inputs, outputs, regles
4. Mettre a jour le compteur d'agents dans la documentation

## Pull Requests

### Format

```
## Resume
- [1-3 bullet points]

## Dimension SOIC impactee
- D4 Securite / D8 Loi 25 / etc.

## Tests
- [ ] `python -m pytest tests/ -v` passe
- [ ] Pas de regression sur les clients existants
- [ ] Templates verifies (si modifies)
```

### Checklist avant merge

- [ ] Tests passent (`python -m pytest tests/ -v`)
- [ ] Pas de hardcode de chemins absolus
- [ ] Pas de secrets dans le code
- [ ] Retrocompatibilite v3.0 preservee (flag `_NEXOS_V4`)
- [ ] CHANGELOG.md mis a jour
- [ ] Documentation mise a jour si necessaire

## License

Propriete de Mark Systems. Voir [LICENSE](LICENSE).
