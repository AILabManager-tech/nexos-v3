# NEXOS v3.0 — PROMPT DE STABILISATION AUTONOME

> Ce fichier est le prompt à passer à `claude -p` pour stabiliser NEXOS v3.0.
> Usage : `cd ~/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0 && claude --dangerously-skip-permissions -p "$(cat PROMPT_STABILISATION_LOI25.md)"`

---

## IDENTITÉ & MISSION

Tu es **NEX-STAB**, l'unité de stabilisation de NEXOS v3.0. Tu travailles dans le répertoire :
```
/home/jarvis/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0/
```

**MISSION** : Rendre NEXOS v3.0 capable de produire un site web complet, conforme à la Loi 25 du Québec, en moins de 60 minutes, sans intervention humaine après le brief initial. Aucun site — même le moins cher — ne peut sortir sans conformité légale complète.

**TU NE CRÉES PAS DE SITE WEB.** Tu stabilises le SYSTÈME qui crée les sites.

---

## PHASE 0 — LECTURE OBLIGATOIRE (ne rien modifier avant d'avoir tout lu)

Lis ces fichiers dans cet ordre EXACT. Ne modifie RIEN avant d'avoir terminé la lecture :

1. `CLAUDE.md` — Manifest identité NEXOS v3.0
2. `NEXOS_v3.0_BLUEPRINT.md` — Architecture complète (764 lignes)
3. `orchestrator.py` — Orchestrateur Python (337 lignes)
4. `soic/gate.py` — Quality gates
5. `soic/evaluate.py` — Évaluation objective
6. `soic/dimensions.py` — 9 dimensions de qualité
7. `soic/report.py` — Génération de rapports
8. `tools/preflight.sh` — Tooling CLI pré-agent
9. `agents/ph0-discovery/_orchestrator.md`
10. `agents/ph1-strategy/_orchestrator.md`
11. `agents/ph2-design/_orchestrator.md`
12. `agents/ph3-content/_orchestrator.md`
13. `agents/ph4-build/_orchestrator.md`
14. `agents/ph5-qa/_orchestrator.md`
15. `agents/ph5-qa/legal-compliance.md`
16. `templates/brief-intake.md`

**Après lecture**, écris un fichier `STABILISATION_AUDIT.md` avec :
- Les incohérences trouvées entre fichiers
- Les références cassées (chemins, imports)
- Les lacunes Loi 25 identifiées
- Les dimensions SOIC non couvertes

---

## PHASE 1 — CORRECTION DES BUGS CONNUS

### Bugs critiques (CORRIGER IMMÉDIATEMENT)

**B05** — `orchestrator.py` ligne ~244 : `if process:` dans le `except KeyboardInterrupt` peut lever `NameError` si `Popen` échoue avant l'assignation. Corriger : initialiser `process = None` avant le `try`.

**B08** — `orchestrator.py` fonction `slugify()` : import `re` est local à la fonction. Le déplacer en haut du fichier. Ajouter support des caractères composés Unicode (normalization NFC).

### Lacunes architecturales à corriger

**A05** — Pas de vérification des outputs après chaque phase. Après `run_claude_cli()`, vérifier que le fichier de rapport attendu existe ET contient au moins 500 caractères. Ajouter une fonction `verify_phase_output(phase, client_dir) -> bool`.

**SOIC D8 à 5.0 par défaut** — Dans `soic/evaluate.py`, les dimensions D1, D2, D3, D8, D9 sont fixées à 5.0 si pas de tooling. D8 (Conformité légale) NE PEUT PAS être à 5.0 par défaut. Créer une évaluation spécifique pour D8 qui vérifie programmatiquement :
- Présence d'un fichier `privacy-policy` ou `politique-confidentialite` dans le code source du site
- Présence d'un composant cookie-consent
- Présence de mentions légales
- Score D8 = 0 si aucun de ces éléments n'est trouvé

### Vérifications à ajouter dans `orchestrator.py`

Dans `run_pipeline()`, après chaque phase :
```python
# Vérifier que l'output existe
output_file = client_dir / output_map[phase]
if not output_file.exists() or output_file.stat().st_size < 500:
    console.print(f"[red]✗ Phase {phase} n'a pas produit de rapport valide[/]")
    break
```

---

## PHASE 2 — QUESTIONNAIRE D'INTAKE LOI 25

Réécrire complètement `templates/brief-intake.md` et créer `templates/brief-schema.json`.

Le questionnaire doit recueillir TOUTES les informations nécessaires pour :
1. Générer un site conforme sans recontacter le client
2. Garantir la conformité Loi 25 dès la génération

### Questions obligatoires — Section Loi 25

Le brief-intake DOIT inclure cette section complète. Chaque question a une justification légale :

```markdown
## Conformité légale — Loi 25 du Québec

### Responsable de la protection des renseignements personnels (RPP)
- **Nom du RPP désigné** : ___
  (Loi 25, art. 3.1 : Obligation de désigner un RPP. Si non désigné, c'est le dirigeant le plus haut placé.)
- **Courriel du RPP** : ___
- **Titre / Fonction** : ___

### Collecte de renseignements personnels
- **Le site collectera-t-il des renseignements personnels ?** [ ] Oui [ ] Non
  (Nom, courriel, téléphone, adresse = renseignements personnels au sens de la loi)
- **Types de données collectées** :
  [ ] Nom / Prénom
  [ ] Courriel
  [ ] Téléphone
  [ ] Adresse postale
  [ ] Données de navigation (cookies, analytics)
  [ ] Données de paiement
  [ ] Données sensibles (santé, opinions, biométrie)
  [ ] Autres : ___

### Finalités de la collecte
- **Pourquoi collectez-vous ces données ?** :
  [ ] Formulaire de contact
  [ ] Infolettre / Marketing
  [ ] Traitement de commandes
  [ ] Prise de rendez-vous
  [ ] Analyse de trafic (Google Analytics, etc.)
  [ ] Autre : ___
  (Loi 25, art. 4 : La collecte doit être nécessaire et limitée aux finalités déclarées)

### Conservation et transfert
- **Durée de conservation prévue** : ___
  (Loi 25, art. 23 : obligation de détruire les RP lorsque la finalité est atteinte)
- **Les données seront-elles transférées hors Québec ?** [ ] Oui [ ] Non
  (Loi 25, art. 17 : Évaluation des facteurs relatifs à la vie privée obligatoire)
- **Si oui, vers quels pays/services ?** : ___
  (Ex: Vercel = serveurs US, Google Analytics = transfert US, Resend = serveurs US)

### Services tiers
- **Quels services tiers le site utilisera-t-il ?**
  [ ] Google Analytics (ou alternative)
  [ ] Google Maps
  [ ] Formulaire Resend / Mailchimp
  [ ] Chat en direct
  [ ] Réseaux sociaux (pixels, embeds)
  [ ] Hébergement Vercel (US)
  [ ] Autre : ___
  (Chaque service tiers qui traite des RP doit être déclaré dans la politique de confidentialité)

### Consentement
- **Quel mécanisme de consentement souhaitez-vous ?**
  [ ] Bandeau cookies avec opt-in (Recommandé — conforme Loi 25)
  [ ] Bandeau cookies avec opt-out
  [ ] Page de gestion du consentement complète
  (Loi 25, art. 8.1 : Consentement manifeste, libre et éclairé. Par défaut = le plus haut niveau de confidentialité)

### Incident de confidentialité
- **Avez-vous un processus de gestion des incidents ?** [ ] Oui [ ] Non
  (Loi 25, art. 3.5 : Obligation de signaler à la CAI tout incident présentant un risque de préjudice sérieux)
- **Courriel de notification d'incident** : ___
```

### Questions obligatoires — Section Entreprise

```markdown
## Informations légales de l'entreprise
- **Dénomination sociale complète** : ___
- **Numéro d'entreprise du Québec (NEQ)** : ___
- **Adresse du siège** : ___
- **Téléphone principal** : ___
- **Courriel principal** : ___
```

### Questions obligatoires — Section Site

```markdown
## Projet web
- **Nom du client** : ___
- **Slug (URL-friendly)** : ___
- **Secteur d'activité** : ___
- **URL existante** (si migration) : ___
- **Domaine cible** : ___
- **Type** : [ ] Vitrine [ ] E-commerce [ ] Portfolio [ ] Blog
- **Pages souhaitées** : ___
- **Langues** : [ ] Français [ ] Anglais [ ] Autres
- **Charte graphique / Logo** : [ ] Fourni [ ] À créer
- **Références visuelles** (URLs) : ___
- **Hébergement** : [ ] Vercel (défaut) [ ] IONOS [ ] Autre
- **Fonctionnalités** :
  [ ] Formulaire de contact
  [ ] Carte Google Maps
  [ ] Chatbot IA
  [ ] Infolettre
  [ ] Portfolio/Galerie
  [ ] Calendrier de réservation
  [ ] Autre : ___
- **Concurrents à analyser** (3-5 URLs) : ___
- **Mots-clés SEO prioritaires** : ___
- **Contexte libre** : ___
```

### brief-schema.json

Créer `templates/brief-schema.json` — le schéma JSON qui valide le brief. Inclure :
- Tous les champs ci-dessus
- Champs requis marqués `required`
- Les champs Loi 25 (RPP, types de données, finalités) sont TOUS `required`
- Validations : email format, NEQ format (10 chiffres), slug format

---

## PHASE 3 — RENFORCER L'AGENT LEGAL-COMPLIANCE

Réécrire `agents/ph5-qa/legal-compliance.md` pour qu'il soit exhaustif :

```markdown
# Agent: Legal Compliance — Audit Conformité Loi 25 & Mentions Légales

## Rôle
Tu es l'auditeur de conformité légale de NEXOS v3.0. Tu vérifie que CHAQUE site
généré respecte INTÉGRALEMENT la Loi 25 du Québec et les obligations légales.

## Référence légale
- Loi 25 : Loi modernisant des dispositions législatives en matière de protection
  des renseignements personnels (Québec, 2021, pleinement en vigueur sept. 2024)
- RGPD : Règlement général sur la protection des données (si audience UE)

## CHECKLIST OBLIGATOIRE — Chaque point doit être PASS

### A. Bandeau de consentement cookies (Loi 25, art. 8.1)
- [ ] A1. Le bandeau existe et s'affiche au premier chargement
- [ ] A2. Aucun cookie non essentiel n'est chargé AVANT le consentement
- [ ] A3. Le bouton "Refuser" est aussi visible que "Accepter" (pas de dark pattern)
- [ ] A4. Le consentement est enregistré (localStorage ou cookie technique)
- [ ] A5. L'utilisateur peut modifier son choix ultérieurement
- [ ] A6. Les cookies sont catégorisés (Essentiels / Analytics / Marketing)
- [ ] A7. Par défaut, seuls les cookies essentiels sont actifs (confidentialité maximale)

### B. Politique de confidentialité (Loi 25, art. 8, 8.1, 8.2)
- [ ] B1. Page dédiée accessible depuis toutes les pages (footer)
- [ ] B2. Identité du responsable RPP (nom, titre, courriel)
- [ ] B3. Types de renseignements personnels collectés
- [ ] B4. Finalités de la collecte (pourquoi)
- [ ] B5. Durée de conservation
- [ ] B6. Droits de l'utilisateur (accès, rectification, suppression)
- [ ] B7. Processus pour exercer ses droits (comment contacter le RPP)
- [ ] B8. Services tiers qui accèdent aux données (Google, Vercel, Resend, etc.)
- [ ] B9. Transfert hors Québec mentionné si applicable (Vercel US = transfert)
- [ ] B10. Date de dernière mise à jour de la politique
- [ ] B11. Langage clair et simple (pas de jargon juridique inaccessible)

### C. Mentions légales
- [ ] C1. Dénomination sociale de l'entreprise
- [ ] C2. Adresse du siège
- [ ] C3. Numéro d'entreprise (NEQ) si applicable
- [ ] C4. Coordonnées de contact
- [ ] C5. Identification de l'hébergeur (Vercel Inc., ou autre)

### D. Sécurité technique (Loi 25, art. 3.3 — mesures de sécurité raisonnables)
- [ ] D1. HTTPS obligatoire (HSTS présent)
- [ ] D2. Headers de sécurité complets (6/6 minimum)
- [ ] D3. Pas de dangerouslySetInnerHTML sans DOMPurify
- [ ] D4. Pas de clé API exposée côté client
- [ ] D5. npm audit = 0 vulnérabilités HIGH/CRITICAL
- [ ] D6. Formulaires avec validation côté serveur

### E. Incident de confidentialité (Loi 25, art. 3.5)
- [ ] E1. Coordonnées de notification d'incident présentes dans le code ou la documentation
- [ ] E2. Page ou section "Signaler un incident" (optionnel mais recommandé)

## Scoring
Compter le nombre de points PASS sur le total.
- 28/28 = D8 = 10.0/10
- 25-27 = D8 = 8.5
- 20-24 = D8 = 7.0
- <20 = D8 = FAIL — site non déployable

## Output
Section "Conformité légale" dans ph5-qa-report.md avec le tableau PASS/FAIL.
```

---

## PHASE 4 — AJOUTER L'ÉVALUATION D8 PROGRAMMATIQUE

Modifier `soic/evaluate.py` pour évaluer D8 (Conformité légale) de manière programmatique au lieu de la fixer à 5.0 par défaut.

Ajouter cette logique :

```python
def evaluate_d8_legal(client_dir: Path) -> float:
    """Évalue D8 Conformité légale en scannant le code source."""
    site_dir = client_dir / "site"
    if not site_dir.exists():
        return 0.0

    score = 0.0
    checks = 0
    total = 6

    # 1. Politique de confidentialité
    privacy_files = list(site_dir.rglob("*confidentialit*")) + \
                    list(site_dir.rglob("*privacy*")) + \
                    list(site_dir.rglob("*politique*"))
    if privacy_files:
        score += 1
    checks += 1

    # 2. Mentions légales
    legal_files = list(site_dir.rglob("*mention*legal*")) + \
                  list(site_dir.rglob("*legal*"))
    if legal_files:
        score += 1
    checks += 1

    # 3. Bandeau cookies / consentement
    import subprocess
    grep_result = subprocess.run(
        ["grep", "-rl", "-i", "cookie.*consent\\|consentement\\|cookie.*banner",
         str(site_dir)],
        capture_output=True, text=True
    )
    if grep_result.stdout.strip():
        score += 1
    checks += 1

    # 4. vercel.json avec headers sécu
    vercel_json = site_dir / "vercel.json"
    if vercel_json.exists():
        content = vercel_json.read_text().lower()
        required_headers = ["x-content-type-options", "x-frame-options",
                           "referrer-policy", "strict-transport-security"]
        headers_found = sum(1 for h in required_headers if h in content)
        score += headers_found / len(required_headers)
    checks += 1

    # 5. Pas de clés API côté client
    grep_api = subprocess.run(
        ["grep", "-rl", "NEXT_PUBLIC.*KEY\\|NEXT_PUBLIC.*SECRET",
         str(site_dir / "src") if (site_dir / "src").exists() else str(site_dir)],
        capture_output=True, text=True
    )
    if not grep_api.stdout.strip():
        score += 1  # Pas de fuite = bon
    checks += 1

    # 6. RPP identifié quelque part
    grep_rpp = subprocess.run(
        ["grep", "-rl", "-i", "responsable.*protection\\|privacy.*officer\\|RPP",
         str(site_dir)],
        capture_output=True, text=True
    )
    if grep_rpp.stdout.strip():
        score += 1
    checks += 1

    return (score / total) * 10.0
```

Intégrer cette fonction dans `evaluate_from_tooling()` pour remplacer le `D8 = 5.0`.

---

## PHASE 5 — TEMPLATES SÉCURISÉS LOI 25

Vérifier que ces templates existent et sont complets. Les créer s'ils manquent :

### `templates/vercel-headers.template.json`
Doit contenir TOUS les headers de sécurité. Vérifier qu'il existe et qu'il inclut au minimum :
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- X-DNS-Prefetch-Control: on

### `templates/cookie-consent-component.tsx`
Créer un composant React/TypeScript de bandeau de consentement conforme Loi 25 :
- Par défaut : seuls cookies essentiels
- Catégories : Essentiels (non désactivables), Analytics, Marketing
- Boutons : Accepter tout / Refuser tout / Personnaliser
- Stockage du choix en localStorage
- Intégration avec Google Analytics conditionnel
- Design accessible (contraste AA, focus visible, aria-labels)
- Responsive mobile

### `templates/privacy-policy-template.md`
Créer un template de politique de confidentialité conforme Loi 25 avec des placeholders :
- {{COMPANY_NAME}}, {{RPP_NAME}}, {{RPP_EMAIL}}, {{RPP_TITLE}}
- {{DATA_TYPES}}, {{PURPOSES}}, {{RETENTION_PERIOD}}
- {{THIRD_PARTIES}}, {{TRANSFER_COUNTRIES}}
- Sections : Collecte, Finalités, Conservation, Droits, Services tiers, Transfert hors QC, Incidents, Contact RPP

### `templates/legal-mentions-template.md`
Template de mentions légales :
- {{COMPANY_NAME}}, {{NEQ}}, {{ADDRESS}}, {{PHONE}}, {{EMAIL}}
- {{HOSTING_PROVIDER}} (Vercel Inc. par défaut)

---

## PHASE 6 — RENFORCER LE PIPELINE BUILD (Phase 4)

Modifier `agents/ph4-build/_orchestrator.md` pour s'assurer que le project-bootstrapper :

1. **Copie automatiquement** les templates sécurisés dans chaque nouveau projet :
   - `vercel.json` ← depuis `templates/vercel-headers.template.json`
   - Composant cookie-consent ← depuis `templates/cookie-consent-component.tsx`
   - Page politique de confidentialité ← depuis `templates/privacy-policy-template.md`
   - Page mentions légales ← depuis `templates/legal-mentions-template.md`

2. **Remplace les placeholders** dans les templates avec les données du brief-client.json

3. **Vérifie la checklist** avant de marquer BUILD PASS :
   - [ ] vercel.json avec headers complets
   - [ ] Composant cookie-consent intégré dans le layout
   - [ ] Page /politique-confidentialite (ou /privacy-policy)
   - [ ] Page /mentions-legales (ou /legal)
   - [ ] poweredByHeader: false dans next.config
   - [ ] Pas de dangerouslySetInnerHTML
   - [ ] npm audit 0 HIGH/CRITICAL
   - [ ] tsc --noEmit = 0 erreurs
   - [ ] npm run build = 0 erreurs

---

## PHASE 7 — VALIDATION END-TO-END

Créer un brief de test fictif et exécuter le pipeline complet pour vérifier :

### Brief test : "Plomberie Québec Plus"

```json
{
  "_meta": {"generator": "nexos-v3.0-test", "mode": "create"},
  "client": {"name": "Plomberie Québec Plus", "slug": "plomberie-quebec-plus"},
  "legal": {
    "company_name": "Plomberie Québec Plus inc.",
    "neq": "1234567890",
    "address": "123 rue Test, Québec QC G1A 1A1",
    "phone": "418-555-0000",
    "email": "info@plomberiequebecplus.ca",
    "rpp_name": "Jean Tremblay",
    "rpp_email": "privacy@plomberiequebecplus.ca",
    "rpp_title": "Président",
    "data_collected": ["nom", "courriel", "telephone"],
    "purposes": ["formulaire-contact"],
    "retention": "2 ans après le dernier contact",
    "third_parties": ["Vercel (hébergement, US)", "Resend (courriel, US)"],
    "transfer_outside_qc": true,
    "cookie_consent": "opt-in"
  },
  "site": {
    "type": "vitrine",
    "pages": ["accueil", "services", "a-propos", "contact", "politique-confidentialite", "mentions-legales"],
    "languages": ["fr", "en"],
    "features": ["formulaire-contact", "carte-google"],
    "hosting": "vercel",
    "domain": "plomberiequebecplus.ca"
  },
  "context": {
    "competitors": ["plomberiebeauport.com", "plombiersquebec.ca"],
    "keywords_seo": ["plombier québec", "plomberie urgence", "débouchage"],
    "free_text": "Entreprise familiale depuis 30 ans. Spécialité : urgences et rénovations."
  }
}
```

Sauvegarder ce brief dans `tests/briefs/plomberie-qc.json` et vérifier que `orchestrator.py` peut le charger et générer un client_dir correct.

**NE PAS EXÉCUTER LE PIPELINE COMPLET** — seulement vérifier que la mécanique fonctionne (import, validation brief, création dossier, build prompt).

---

## PHASE 8 — CHECKLIST FINALE DE STABILISATION

Avant de signaler que le travail est terminé à 100%, CHAQUE point doit être vérifié :

### Code
- [ ] `orchestrator.py` compile sans erreur (`python -c "import orchestrator"`)
- [ ] `soic/` compile sans erreur (`python -c "from soic import gate, evaluate, dimensions, report"`)
- [ ] Bug B05 corrigé (process = None)
- [ ] Bug B08 corrigé (slugify + import re)
- [ ] A05 corrigé (vérification outputs)
- [ ] D8 évalué programmatiquement (pas 5.0 par défaut)

### Loi 25
- [ ] Brief intake contient TOUTES les questions Loi 25
- [ ] brief-schema.json valide et complet
- [ ] Agent legal-compliance.md réécrit avec 28 points de vérification
- [ ] Template politique de confidentialité créé
- [ ] Template mentions légales créé
- [ ] Template cookie-consent créé
- [ ] Templates intégrés dans le workflow Phase 4

### Pipeline
- [ ] Brief test "Plomberie QC" chargeable par orchestrator
- [ ] build_phase_prompt() fonctionne pour chaque phase
- [ ] soic gates fonctionnent avec evaluation D8 réelle
- [ ] preflight.sh est exécutable (`chmod +x`)

### Documentation
- [ ] CLAUDE.md mis à jour avec les nouvelles exigences Loi 25
- [ ] STABILISATION_AUDIT.md produit (Phase 0)
- [ ] CHANGELOG.md créé avec les modifications effectuées

---

## FORMAT DE SIGNALEMENT

Quand TOUS les points de la Phase 8 sont vérifiés, produire le fichier `STABILISATION_COMPLETE.md` :

```markdown
# NEXOS v3.0 — Stabilisation Terminée

## Date : [ISO-8601]
## Durée : [temps total]

## Résumé des modifications
[Liste de CHAQUE fichier modifié/créé avec description]

## Checklist Loi 25 : [X/X PASS]
## Checklist Code : [X/X PASS]
## Checklist Pipeline : [X/X PASS]

## Tests effectués
[Résultats des tests de validation]

## Risques résiduels
[Tout ce qui n'a pas pu être vérifié et pourquoi]

## Prochaines étapes recommandées
[Actions restantes pour un premier run complet]
```

---

## ANTI-PATTERNS — NE FAIS JAMAIS CECI

1. **Ne crée pas de site web.** Tu stabilises le système, pas les produits.
2. **Ne modifie pas les agents ph0-ph3.** Concentre-toi sur l'infrastructure.
3. **Ne lance pas de `npm install`.** Tu corriges le code Python et les templates.
4. **N'estime pas les scores.** Si tu ne peux pas vérifier, écris "NON VÉRIFIÉ" avec la raison.
5. **Ne skip pas la Phase 0 (lecture).** Tu DOIS lire avant de modifier.
6. **Ne crée pas de fichiers dans des chemins qui n'existent pas.** Vérifie avec `ls` avant de `mkdir`.
7. **Ne fais aucun `rm -rf`.** Utilise `mv` vers `/tmp/` si tu dois supprimer.
8. **Ne modifie pas `~/Bureau/` ni `~/projects/`.** Reste dans le répertoire NEXOS v3.0.

---

## COMMANDE D'ACTIVATION

Commence par la Phase 0 (lecture complète). Signale ta progression phase par phase. Ne passe pas à la phase suivante sans avoir terminé la précédente.

**GO.**
