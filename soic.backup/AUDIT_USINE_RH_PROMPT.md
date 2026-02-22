# MISSION : Audit SOIC v3.0 comparatif — L'Usine RH (4 versions)

Tu es l'auditeur qualité NEXOS. Tu dois exécuter le pipeline SOIC v3.0 sur 4 versions du site L'Usine RH et produire un rapport comparatif.

## CONTEXTE
- Racine NEXOS : ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0/
- SOIC : soic/
- Tools : tools/
- Sites à auditer (chemins relatifs à la racine NEXOS) :
  - MAIN         : clients/USINE_RH/
  - REBRANDING   : clients/USINE_RH_rebranding/
  - CHANTIER     : clients/USINE_RH_chantier/
  - INDUSTRIELLE : clients/USINE_RH_industrielle/

## PRÉ-REQUIS — vérifier avant de commencer
```bash
cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0

# Vérifier que les outils sont installés
which lighthouse || npm install -g lighthouse
which axe || npm install -g @axe-core/cli
npx playwright install chromium 2>/dev/null

# Vérifier que les 4 dossiers existent et ont leurs deps
for d in USINE_RH USINE_RH_rebranding USINE_RH_chantier USINE_RH_industrielle; do
  echo "=== $d ==="
  ls clients/$d/package.json 2>/dev/null && echo "OK" || echo "MISSING"
  ls clients/$d/node_modules/.package-lock.json 2>/dev/null && echo "deps OK" || { echo "installing deps..."; cd clients/$d && npm install && cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0; }
done
```

## VARIABLES DE TRAVAIL
```
VERSIONS=(USINE_RH USINE_RH_rebranding USINE_RH_chantier USINE_RH_industrielle)
PORTS=(3001 3002 3003 3004)
LABELS=(MAIN REBRANDING CHANTIER INDUSTRIELLE)
```

## PROCÉDURE — pour CHAQUE version (i=0,1,2,3)

### Étape 1 : Build
```bash
cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0/clients/${VERSIONS[$i]}
npm run build 2>&1 | tail -20
```
Si le build échoue → documenter l'erreur EXACTE et passer à la version suivante.

### Étape 2 : Démarrer le serveur
```bash
npx next start -p ${PORTS[$i]} &
SERVER_PID=$!
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORTS[$i]}
```
Si le curl ne retourne pas 200 → documenter et passer.

### Étape 3 : Exécuter les scans
```bash
cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0
mkdir -p clients/${VERSIONS[$i]}/tooling

chmod +x tools/*.sh

./tools/lighthouse-scan.sh http://localhost:${PORTS[$i]} clients/${VERSIONS[$i]}
./tools/a11y-scan.sh http://localhost:${PORTS[$i]} clients/${VERSIONS[$i]}
./tools/headers-scan.sh http://localhost:${PORTS[$i]} clients/${VERSIONS[$i]}
./tools/ssl-scan.sh http://localhost:${PORTS[$i]} clients/${VERSIONS[$i]}
./tools/deps-scan.sh clients/${VERSIONS[$i]}
```

Si un script échoue, exécuter manuellement :
```bash
# Lighthouse fallback
lighthouse http://localhost:${PORTS[$i]} --output=json --output-path=clients/${VERSIONS[$i]}/tooling/lighthouse.json --chrome-flags="--headless --no-sandbox"

# Axe-core fallback
axe http://localhost:${PORTS[$i]} --save clients/${VERSIONS[$i]}/tooling/a11y.json

# Headers fallback
curl -sI http://localhost:${PORTS[$i]} > clients/${VERSIONS[$i]}/tooling/headers.txt

# Deps fallback
cd clients/${VERSIONS[$i]} && npm audit --json > tooling/deps.json 2>&1 && cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0
```

### Étape 4 : Exécuter SOIC gate engine
```bash
cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0
python3 -c "
import sys; sys.path.insert(0, '.')
from soic import GateEngine
from soic.report import generate_report

engine = GateEngine(phase='ph5-qa', client_dir='clients/${VERSIONS[$i]}')
report = engine.run()
txt = generate_report(report)
print(txt)
with open('clients/${VERSIONS[$i]}/tooling/soic-report.txt', 'w') as f:
    f.write(txt)
"
```

Si l'import échoue, exécuter les gates manuellement et documenter chaque résultat.

### Étape 5 : Kill le serveur
```bash
kill $SERVER_PID 2>/dev/null
```

## LIVRABLES

### 1. Tableau comparatif (OBLIGATOIRE)
```
| Métrique              | MAIN    | REBRANDING | CHANTIER | INDUSTRIELLE |
|-----------------------|---------|------------|----------|--------------|
| Build OK?             |         |            |          |              |
| μ (score global)      |         |            |          |              |
| Coverage              |         |            |          |              |
| Gates PASS            |    /17  |       /17  |     /17  |         /17  |
| Gates FAIL            |         |            |          |              |
| Gates NOT_EXECUTED    |         |            |          |              |
| D4 Sécurité           |         |            |          |              |
| D5 Performance        |         |            |          |              |
| D6 Accessibilité      |         |            |          |              |
| D7 SEO                |         |            |          |              |
| D8 Conformité légale  |         |            |          |              |
| Verdict SOIC          |         |            |          |              |
| Lighthouse Perf       |         |            |          |              |
| Lighthouse A11y       |         |            |          |              |
| Lighthouse BP         |         |            |          |              |
| Lighthouse SEO        |         |            |          |              |
| WCAG violations       |         |            |          |              |
| Security headers      |    /6   |       /6   |     /6   |         /6   |
| npm audit high/crit   |         |            |          |              |
| W-14 legal (détail)   |    /6   |       /6   |     /6   |         /6   |
| W-17 cookies          |   /10   |      /10   |    /10   |        /10   |
```

### 2. Détail des FAIL par version
Pour chaque gate en FAIL, lister :
- Gate ID + nom
- Score obtenu vs seuil
- Diagnostic en 1 ligne
- Action corrective concrète

### 3. Analyse différentielle
- Quelles gates passent dans une version et échouent dans une autre ?
- Y a-t-il une régression entre versions ?
- Quelle version est la plus avancée en conformité ?

### 4. Recommandation finale
- Quelle version utiliser comme base pour la livraison ?
- Top 5 correctifs prioritaires pour atteindre μ ≥ 8.5
- Estimation du temps de correction par correctif
- Gates BLOQUANTES encore en FAIL (D4 + D8)

## CONTRAINTES
- NE PAS modifier le code des sites. Audit READ-ONLY.
- Si un scan échoue, documenter POURQUOI et marquer NOT_EXECUTED.
- Si un outil manque, l'installer via npm -g AVANT de commencer.
- Créer les dossiers tooling/ si absents.
- Temps max : 45 minutes pour les 4 versions.
- Sauvegarder le rapport final dans :
  clients/AUDIT_COMPARATIF_SOIC.md
- Sauvegarder les données brutes dans :
  clients/${VERSION}/tooling/soic-report.txt (pour chaque version)

## SIGNAL DE COMPLÉTION
Afficher UNIQUEMENT quand les 4 versions sont auditées :
```
══════════════════════════════════════
✅ AUDIT SOIC COMPARATIF — TERMINÉ
══════════════════════════════════════
Versions auditées : X/4
Meilleur μ        : [VERSION] (μ=X.XX)
Gates BLOQUANTES  : X/17 PASS
Recommandation    : [VERSION] comme base
══════════════════════════════════════
```
