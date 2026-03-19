# NEXOS CLI — Guide complet des commandes

> Référence complète pour `nexos_cli.py` (thin wrapper → `orchestrator.py`)

---

## Options globales (disponibles sur la plupart des modes pipeline)

| Option | Description |
|--------|-------------|
| `--client-dir PATH` | Dossier client existant (ex: `clients/usine-rh`) |
| `--url URL` | URL du site (pour audit/preflight) |
| `--brief PATH` | Chemin vers un `brief-client.json` existant |
| `-i, --interactive` | Lancer le wizard interactif pour générer le brief |
| `--stack STACK` | Stack technique : `nextjs`, `nuxt`, `astro`, `fastapi`, `generic` |
| `--profile PROFIL` | Profil SOIC explicite (ex: `web-nextjs`, `api-fastapi`) |
| `--colors ROLE=#HEX...` | Palette couleurs imposée (ex: `primary=#1A2B3C accent=#FFD700`) |

### Mapping `--stack` → profil SOIC

| Stack | Profil résolu |
|-------|---------------|
| `nextjs` | `web-nextjs` |
| `nuxt` | `web-generic` |
| `astro` | `web-generic` |
| `fastapi` | `api-fastapi` |
| `generic` | `web-generic` |

---

## 1. `nexos create` — Création complète d'un site

Lance le pipeline complet en 6 phases (ph0→ph5), de la découverte client jusqu'au QA final. Chaque phase est séparée par un quality gate SOIC — si le score est trop bas, la phase suivante est bloquée.

**Phases exécutées :** ph0-discovery → ph1-strategy → ph2-design → ph3-content → ph4-build → ph5-qa

### Exemples

```bash
# Créer un site Next.js à partir d'un brief existant
nexos create --brief clients/usine-rh/brief-client.json --stack nextjs

# Créer un site avec le wizard interactif (brief généré automatiquement)
nexos create -i --stack nextjs

# Créer avec une palette de couleurs imposée
nexos create --brief mon-brief.json --stack nextjs --colors primary=#1A2B3C accent=#FFD700 secondary=#B2B2B2

# Créer un site Nuxt (profil SOIC résolu auto → web-generic)
nexos create --brief brief.json --stack nuxt

# Forcer un profil SOIC spécifique
nexos create --brief brief.json --profile api-fastapi
```

### Mises en situation

**Premier contrat avec un nouveau client :**
Tu viens de signer un contrat avec une clinique dentaire de Laval. Tu as pris des notes pendant la rencontre (nom, services, couleurs du logo, textes voulus). Tu ouvres le terminal et tu lances `nexos create -i --stack nextjs`. Le wizard te guide question par question : nom de l'entreprise, services offerts, langues, RPP pour la Loi 25, etc. 45 minutes plus tard, le pipeline a généré un site complet avec pages, contenu bilingue, bandeau cookies, politique de confidentialité. Tu n'as touché à rien.

**Le client arrive avec un brief PDF déjà rempli :**
Une firme comptable t'envoie un brief détaillé en PDF. Tu convertis les infos en `brief-client.json` (ou tu les as déjà dans le bon format), puis tu lances `nexos create --brief clients/cabinet-tremblay/brief-client.json --stack nextjs`. Pas besoin du wizard interactif — le pipeline part directement.

**Le client a des couleurs de marque strictes :**
L'agence de branding du client t'a envoyé un guide de marque avec des hex codes précis. Tu les imposes dès le départ : `nexos create -i --stack nextjs --colors primary=#003366 accent=#E8A838 secondary=#F5F5F5`. NEXOS respectera ces couleurs à travers toutes les phases — pas de surprise à la livraison.

**Tu veux un site Astro au lieu de Next.js :**
Un client a un site vitrine simple, pas besoin de React côté serveur. Tu lances `nexos create -i --stack astro` — NEXOS résout automatiquement le profil SOIC `web-generic` et utilise les templates Astro au lieu de Next.js.

### Quality gates

| Transition | Seuil μ |
|------------|---------|
| ph0 → ph1 | ≥ 7.0 |
| ph1 → ph2 | ≥ 8.0 |
| ph2 → ph3 | ≥ 8.0 |
| ph3 → ph4 | ≥ 8.0 |
| ph4 → tooling | BUILD PASS |
| ph5 → deploy | ≥ 8.5 |

---

## 2. `nexos audit` — Audit d'un site existant

Évalue un site web déjà en ligne. Lance le tooling réel (Lighthouse, pa11y, headers, SSL, npm audit) puis la phase QA (ph5). Produit un rapport avec score SOIC sur 9 dimensions.

**Phases exécutées :** ph5-qa (avec preflight tooling)

### Exemples

```bash
# Auditer un site client via son URL
nexos audit --client-dir clients/emilie-poirier --url https://winterpulse.club

# Auditer avec un profil SOIC spécifique
nexos audit --client-dir clients/mon-api --url https://api.example.com --profile api-fastapi
```

### Mises en situation

**Un prospect veut savoir si son site actuel est "correct" :**
Un entrepreneur te contacte : "Mon site a été fait par mon neveu il y a 2 ans, est-ce qu'il est encore bon?" Tu lances `nexos audit --client-dir clients/boulangerie-dupont --url https://boulangerie-dupont.ca`. En 5 minutes, tu reçois un score SOIC sur 9 dimensions. Tu peux lui montrer noir sur blanc : performance 45/100, aucun header de sécurité, zéro conformité Loi 25. C'est ton outil de vente — le rapport justifie le mandat.

**Vérifier le travail d'un autre développeur :**
Un client arrive avec un site fait par un freelance qui a disparu. Avant d'accepter de le maintenir, tu veux savoir dans quoi tu t'embarques : `nexos audit --client-dir clients/reprise-xyz --url https://xyz.ca`. Le rapport te montre 4 CVE HIGH, du XSS dans un widget, et pas de politique de confidentialité. Tu sais exactement ce que ça va coûter à corriger — tu peux chiffrer ta soumission.

**Audit pré-livraison pour te protéger :**
Tu viens de finir un site et tu veux être sûr à 100% avant de livrer. Tu lances l'audit sur ta staging URL : `nexos audit --client-dir clients/mon-client --url https://staging.mon-client.vercel.app`. Si le score est ≥ 8.5, tu livres en confiance. Sinon, tu corriges avant que le client voie quoi que ce soit.

**Audit d'une API FastAPI :**
Un client SaaS veut que tu audites son backend. Tu utilises le profil adapté : `nexos audit --client-dir clients/saas-client --url https://api.saas-client.com --profile api-fastapi`. Les dimensions D5 (performance), D6 (accessibilité), D7 (SEO) sont pondérées différemment car c'est une API, pas un site web.

### 9 dimensions SOIC évaluées

| Dim | Domaine |
|-----|---------|
| D1 | Architecture |
| D2 | Documentation |
| D3 | Tests |
| D4 | Sécurité |
| D5 | Performance |
| D6 | Accessibilité |
| D7 | SEO |
| D8 | Conformité (Loi 25) — poids ×1.1 |
| D9 | Code Quality |

---

## 3. `nexos modify` — Modification ciblée

Modifie des sections spécifiques d'un site existant sans relancer tout le pipeline. Utilise le `section-manifest.json` généré en Ph1 pour cibler par identifiant.

**Phases exécutées :** site-update

### Options spécifiques

| Option | Description |
|--------|-------------|
| `--section S-NNN [S-NNN...]` | Identifiants des sections à modifier |

### Exemples

```bash
# Modifier une section spécifique
nexos modify --client-dir clients/usine-rh --section S-003

# Modifier plusieurs sections
nexos modify --client-dir clients/usine-rh --section S-001 S-003 S-007

# Modifier avec nouvelle palette de couleurs
nexos modify --client-dir clients/usine-rh --section S-005 --colors accent=#FF5500
```

### Mises en situation

**Retour de rencontre client — changements demandés :**
Tu sors d'un call avec ta cliente RH. Elle veut : changer le texte de la section "Services" et refaire le CTA final avec un nouveau numéro de téléphone. Tu ouvres `section-manifest.json` pour trouver les IDs (S-003 et S-007), puis : `nexos modify --client-dir clients/usine-rh --section S-003 S-007`. En 10 minutes c'est fait, sans risquer de casser le reste du site.

**Le client a changé son branding :**
Le client revient 3 mois après la livraison : "On a refait notre logo, les couleurs changent." Tu modifies le hero et le footer avec les nouvelles couleurs : `nexos modify --client-dir clients/cabinet-tremblay --section S-001 S-012 --colors primary=#2B4C7E accent=#C9A84C`. Seules les sections ciblées sont touchées.

**Ajout d'une nouvelle section :**
"On voudrait ajouter une section témoignages clients." Tu crées la section via modify — NEXOS l'intègre dans le site existant en respectant le design system déjà en place : `nexos modify --client-dir clients/boulangerie-dupont --section S-NEW-testimonials`.

**Correction rapide après feedback du client :**
Le client voit le site en staging et dit : "La section prix est pas claire, je veux reformuler." Tu cibles juste cette section : `nexos modify --client-dir clients/mon-client --section S-005`. 5 minutes au lieu de relancer le pipeline complet.

---

## 4. `nexos content` — Rédaction / traduction

Exécute uniquement la phase 3 (content) — rédaction des textes et traductions. Utile pour rafraîchir le contenu sans toucher au code ni au design.

**Phases exécutées :** ph3-content

### Exemples

```bash
# Rédiger/traduire le contenu d'un client
nexos content --client-dir clients/usine-rh --stack nextjs
```

### Mises en situation

**Le client veut rafraîchir ses textes :**
Le site est en ligne depuis 6 mois. La cliente appelle : "Mes services ont évolué, je veux mettre à jour tous les textes du site." Tu lances `nexos content --client-dir clients/clinique-laval --stack nextjs`. Les agents rédactionnels repassent sur tout le contenu — zéro impact sur le code, le design reste intact.

**Traduction pour un nouveau marché :**
Un client francophone veut maintenant cibler le marché anglophone. Le site est déjà live en français. `nexos content` relance la phase traduction et génère les versions anglaises de chaque page en respectant le contexte métier du client (pas du Google Translate).

**Refonte de ton copywriting après un pivot business :**
Le client était "coaching sportif", il est maintenant "coaching holistique bien-être". Le positionnement change, donc tous les textes doivent changer. `nexos content --client-dir clients/coaching-pivot --stack nextjs` — le pipeline content adapte le ton, les mots-clés SEO, et le messaging complet sans toucher à la structure.

---

## 5. `nexos converge` — Boucle de convergence autonome

Boucle automatique : évalue le score SOIC → identifie les faiblesses → génère un feedback correctif → relance Claude CLI pour corriger → réévalue. Répète jusqu'au score cible ou épuisement des itérations.

**Boucle :** GateEngine → Converger.decide() → FeedbackRouter → Claude CLI → RunStore → (répéter)

### Options spécifiques

| Option | Description | Défaut |
|--------|-------------|--------|
| `client_dir` | Dossier client (positionnel, requis) | — |
| `--target FLOAT` | Score μ cible | 8.5 |
| `--max-iter INT` | Nombre max d'itérations | 4 |
| `--timeout INT` | Timeout global en minutes | 15 |
| `--dry-run` | Évaluer sans corriger | false |

### Exemples

```bash
# Converger vers μ=8.5 (défaut)
nexos converge clients/usine-rh

# Cible plus haute, plus d'itérations
nexos converge clients/usine-rh --target 9.0 --max-iter 6 --timeout 30

# Dry-run : évaluation seule sans correction
nexos converge clients/usine-rh --dry-run

# Avec preflight sur URL live
nexos converge clients/usine-rh --url https://usinerh.ca --target 8.5
```

### Mises en situation

**Le site est "presque prêt" mais le score bloque :**
Tu viens de finir un `nexos create` et le score final est μ=7.8 — pas assez pour déployer (seuil = 8.5). Au lieu de chercher toi-même ce qui cloche, tu lances `nexos converge clients/clinique-laval`. NEXOS identifie que D4 (sécurité) et D6 (accessibilité) sont faibles, corrige automatiquement, réévalue. En 3 itérations → μ=9.2 PASS. Tu déploies.

**Vérification rapide sans rien toucher :**
Le client te demande "où on en est?" et tu veux juste un état des lieux. Tu lances `nexos converge clients/usine-rh --dry-run`. Tu reçois le score et la liste des points faibles, sans qu'aucun fichier ne soit modifié. Parfait pour préparer un devis de correction ou un email au client.

**Tu vises l'excellence pour un client premium :**
C'est un gros contrat, tu veux un site irréprochable. Tu montes le seuil : `nexos converge clients/firme-avocats --target 9.5 --max-iter 6 --timeout 30`. NEXOS pousse la qualité au max — 6 itérations si nécessaire, 30 minutes de budget.

**Convergence après un audit avec URL live :**
Tu as audité le site du client, les scans Lighthouse et pa11y ont remonté des problèmes réels. Tu lances la convergence avec l'URL pour que le preflight vérifie en live : `nexos converge clients/emilie-poirier --url https://winterpulse.club --target 8.5`.

---

## 6. `nexos doctor` — Diagnostic système

Vérifie que l'environnement est prêt : outils CLI installés (node ≥20, npm, lighthouse, pa11y...), templates présents, engine SOIC fonctionnel, état des clients.

### Exemples

```bash
nexos doctor
```

### Mises en situation

**Lundi matin, rien ne marche :**
Tu ouvres ton terminal, tu lances un `nexos create` et ça plante. Avant de paniquer, `nexos doctor`. Résultat : Node.js a été mis à jour ce weekend et lighthouse n'est plus installé globalement. Tu fais `npm i -g lighthouse`, tu relances doctor → tout est vert.

**Tu viens de configurer un nouveau laptop :**
Tu as migré sur une nouvelle machine. Avant de commencer ton premier projet client, `nexos doctor` te confirme que tout est en place : node ≥20, npm, claude CLI, templates, SOIC engine. Pas de mauvaise surprise en plein milieu d'un pipeline.

**Avant un gros rush de projets :**
Tu as 3 sites à livrer cette semaine. Tu commences par `nexos doctor` pour être sûr que l'environnement est stable — tu ne veux pas perdre 30 minutes à debugger un outil manquant en plein milieu d'un create.

### Outils vérifiés

- **Critiques** (erreur si absent) : `node` ≥20, `npm`, `claude`
- **Optionnels** (warning) : `lighthouse`, `pa11y`

---

## 7. `nexos fix` — Auto-correction D4/D8 standalone

Applique 6 corrections automatiques ciblant la sécurité (D4) et la conformité Loi 25 (D8), sans lancer le pipeline complet.

### Corrections appliquées

1. Injection du bandeau cookie consent (opt-in, granulaire)
2. `npm audit fix` (vulnérabilités connues)
3. Headers sécurité dans `vercel.json` (CSP, HSTS, X-Frame-Options...)
4. Patch `next.config` (`poweredByHeader: false`)
5. Page politique-confidentialité (depuis template)
6. Page mentions-légales (depuis template)

### Options spécifiques

| Option | Description |
|--------|-------------|
| `client_dir` | Dossier client (positionnel, requis) |
| `--dry-run` | Analyser sans appliquer les corrections |

### Exemples

```bash
# Corriger un client
nexos fix clients/emilie-poirier

# Voir ce qui serait corrigé SANS appliquer
nexos fix clients/emilie-poirier --dry-run
```

### Mises en situation

**Le client a reçu une mise en demeure Loi 25 :**
Ta cliente t'appelle stressée : "J'ai reçu un avis de la Commission d'accès à l'information, mon site n'est pas conforme." Tu lances immédiatement `nexos fix clients/emilie-poirier`. En 2 minutes : bandeau cookies injecté, politique de confidentialité générée, mentions légales ajoutées. Tu redéploies et elle est conforme.

**Dry-run avant de toucher au site en production :**
Le site est live, le client a du trafic. Tu ne veux pas casser quelque chose. `nexos fix clients/cabinet-tremblay --dry-run` te montre exactement ce qui serait modifié : "Cookie consent absent → copierait template", "3 headers manquants dans vercel.json", "Page mentions-légales absente". Tu valides la liste, puis tu lances sans `--dry-run`.

**Fix rapide après un audit :**
Tu viens de faire un `nexos audit` et le rapport montre D4=4.2 (sécurité) et D8=2.0 (Loi 25). Avant de lancer un `converge` complet, tu fais d'abord `nexos fix` pour corriger le plus gros en 2 minutes. Ensuite le `converge` part d'une meilleure base et converge plus vite.

**Batch de corrections sur plusieurs clients :**
Tu réalises que 3 de tes anciens clients n'ont pas de bandeau cookies. Tu fais un dry-run sur chacun pour confirmer, puis tu fixes les 3 en série :
```bash
nexos fix clients/client-a --dry-run
nexos fix clients/client-b --dry-run
nexos fix clients/client-c --dry-run
# Tout semble bon, on applique
nexos fix clients/client-a
nexos fix clients/client-b
nexos fix clients/client-c
```

### Pattern validate → fix → re-validate

```
1. validate_build(site_dir)      → état AVANT
2. auto_fix(site_dir, ...)       → corrections
3. validate_build(site_dir)      → état APRES
4. Résumé des corrections
```

---

## 8. `nexos report` — Rapport agrégé

Affiche un tableau de bord complet d'un client : phases complétées, scores SOIC à chaque gate, résultats tooling, état du site, brief, et changelog.

### Exemples

```bash
nexos report clients/usine-rh
```

### Sections du rapport

1. **Phases** — liste des rapports générés (ph0→ph5) avec taille
2. **SOIC Gates** — score μ, nombre d'itérations, décision (ACCEPT/FAIL) par phase
3. **Tooling** — fichiers de résultats (lighthouse.json, headers.json, etc.)
4. **Site** — fichiers critiques présents/absents, headers vercel.json
5. **Brief** — nom entreprise, RPP (responsable protection des données)
6. **Changelog** — nombre d'événements, période, auto-fixes appliqués

### Mises en situation

**Préparer une rencontre de suivi :**
Le client veut un point d'avancement demain matin. Tu lances `nexos report clients/usine-rh` la veille — en 2 secondes tu as l'état des lieux : ph0→ph4 complétées, μ=8.2 au dernier gate, 3 auto-fixes appliqués, headers OK. Tu copies les infos pertinentes dans ton email de suivi.

**Justifier ta facture :**
Le client demande "vous avez fait quoi exactement ce mois-ci?" Tu lances `nexos report` — le changelog montre 12 événements : 3 phases complétées, 4 auto-fixes, 2 convergences. Preuve de travail documentée automatiquement.

**Diagnostiquer pourquoi un site n'a pas été déployé :**
Un site traîne depuis 2 semaines. `nexos report clients/projet-bloque` te montre que ph3→ph4 a FAIL au gate (μ=6.8) et que personne n'a relancé de convergence. Tu sais exactement où reprendre.

**Comparer l'état de plusieurs clients :**
Tu gères 5 clients actifs et tu veux un portrait global :
```bash
nexos report clients/client-a
nexos report clients/client-b
nexos report clients/client-c
```
En 10 secondes tu sais lequel est prêt à livrer, lequel est bloqué, et lequel a besoin d'attention.

---

## 9. `nexos knowledge` — Agents cognitifs

Exécute un agent knowledge hors pipeline web (résumé, analyse, synthèse de contenu).

### Options spécifiques

| Option | Description | Défaut |
|--------|-------------|--------|
| `agent` | ID de l'agent (ex: `hexabrief`) | requis |
| `--source TEXT` | Texte source ou "Titre — Auteur" | requis |
| `--type TYPE` | Type de contenu (`technique`, etc.) | `technique` |
| `--objectif OBJ` | Objectif de lecture (`appliquer`, etc.) | `appliquer` |
| `--niveau NIV` | Profondeur du résumé (`complet`, etc.) | `complet` |
| `--score-only PATH` | Évaluer un résumé existant (path .md) | — |

### Exemples

```bash
# Résumé technique d'un livre
nexos knowledge hexabrief --source "Clean Code — Robert C. Martin" --type technique --objectif appliquer --niveau complet

# Évaluer un résumé existant
nexos knowledge hexabrief --source "Clean Code" --score-only resume.md
```

---

## Scénarios de vie réelle — Quel flux utiliser?

### Scénario 1 : Nouveau client, premier contrat

> Tu signes un contrat de 5K$ pour un site vitrine Next.js pour un plombier de Longueuil.

```bash
nexos doctor                                        # Vérifier que tout est prêt
nexos create -i --stack nextjs                      # Wizard interactif → pipeline complet
nexos converge clients/plomberie-leblanc --target 8.5  # Pousser le score si nécessaire
nexos report clients/plomberie-leblanc              # Rapport final avant livraison
```

**Temps estimé :** Le pipeline tourne seul. Tu lances et tu fais autre chose.

---

### Scénario 2 : Retour de rencontre client — des changements à faire

> Ta cliente RH t'a envoyé un email après votre call : "Change le texte des services, ajoute un témoignage, et mets le nouveau numéro de téléphone dans le footer."

```bash
# 1. Consulter le manifest pour identifier les sections
cat clients/usine-rh/section-manifest.json

# 2. Modifier les sections ciblées
nexos modify --client-dir clients/usine-rh --section S-003 S-009 S-012

# 3. Vérifier que les modifs n'ont rien cassé
nexos converge clients/usine-rh --dry-run

# 4. Si le score a baissé, corriger
nexos converge clients/usine-rh --target 8.5
```

**Règle d'or :** Après une rencontre client, c'est presque toujours `modify`. Tu ne recrées jamais le site au complet pour des changements ponctuels.

---

### Scénario 3 : Un prospect veut une soumission — tu dois évaluer son site actuel

> Un restaurant te contacte : "Notre site est lent et on sait pas s'il est conforme." Tu veux un diagnostic rapide pour chiffrer ta soumission.

```bash
# 1. Audit complet
nexos audit --client-dir clients/resto-prospect --url https://resto-chez-paul.ca

# 2. Voir ce que le fix automatique pourrait corriger
nexos fix clients/resto-prospect --dry-run

# 3. Générer le rapport pour ta soumission
nexos report clients/resto-prospect
```

**Le rapport te donne :** Score SOIC global, failles de sécurité, conformité Loi 25, performance Lighthouse. Tu peux chiffrer : "Correction urgente Loi 25 = 800$, optimisation performance = 1500$, refonte complète = 8K$."

---

### Scénario 4 : Urgence Loi 25 — le client panique

> Ton client reçoit un courriel de la Commission d'accès à l'information du Québec. Il veut être conforme MAINTENANT.

```bash
# 1. Diagnostic rapide
nexos fix clients/mon-client --dry-run

# 2. Appliquer les corrections D4/D8
nexos fix clients/mon-client

# 3. Vérifier le résultat
nexos converge clients/mon-client --dry-run
```

**En 5 minutes :** Bandeau cookies injecté, politique de confidentialité générée, mentions légales ajoutées, headers de sécurité patchés. Tu redéploies et c'est réglé.

---

### Scénario 5 : Le client veut changer ses textes mais garder le design

> "J'ai changé mes services, mes prix ont augmenté, et je veux un nouveau slogan. Mais touche pas au design, je l'aime."

```bash
nexos content --client-dir clients/coaching-marie --stack nextjs
```

**Une seule commande.** Les agents rédactionnels repassent sur tout le contenu textuel (FR/EN). Le code, le design, les composants — rien n'est touché.

---

### Scénario 6 : Refonte complète — le client veut tout changer

> "On a pivoté. Nouveau nom, nouveau branding, nouvelle offre. On repart de zéro."

```bash
# Créer un nouveau projet (pas modifier l'ancien)
nexos create -i --stack nextjs --colors primary=#1B1B3A accent=#00D4AA

# L'ancien site reste intact dans son dossier client au cas où
```

**Quand utiliser `create` vs `modify` :** Si plus de 60-70% du site change, c'est plus rapide et plus propre de repartir avec `create`.

---

### Scénario 7 : Tu gères 5 clients actifs et tu veux un portrait global

> C'est vendredi, tu planifies ta semaine prochaine. Qui a besoin d'attention?

```bash
nexos report clients/plomberie-leblanc    # μ=9.1 PASS → prêt à livrer
nexos report clients/clinique-laval       # μ=7.4 FAIL → besoin de converge
nexos report clients/cabinet-tremblay     # ph3 bloquée → contenu manquant
nexos report clients/resto-chez-paul      # audit seulement → soumission à envoyer
nexos report clients/coaching-marie       # μ=8.8 PASS → en attente feedback client
```

**En 30 secondes** tu sais : livrer Leblanc lundi, converger Laval mardi, relancer Tremblay pour le contenu, envoyer la soumission du resto, attendre Marie.

---

### Scénario 8 : Un site est live depuis 6 mois — check-up périodique

> Tu offres un forfait maintenance annuel. Tous les 3 mois, tu fais un check.

```bash
# 1. Re-auditer le site live
nexos audit --client-dir clients/client-maintenance --url https://client.ca

# 2. Corriger les dégradations (nouvelles vulnérabilités npm, etc.)
nexos fix clients/client-maintenance

# 3. Rapport pour le client
nexos report clients/client-maintenance
```

**Valeur ajoutée :** Tu montres au client que son site reste sécurisé et conforme dans le temps. Ça justifie le forfait maintenance mensuel.

---

### Scénario 9 : Tu veux impressionner dans un pitch commercial

> Tu es en appel avec un prospect. Il hésite entre toi et une autre agence. Tu veux démontrer ta rigueur en live.

```bash
# Pendant l'appel, tu partages ton écran :
nexos audit --client-dir clients/demo-prospect --url https://son-site-actuel.ca

# Le score SOIC s'affiche en temps réel — 9 dimensions, failles identifiées
# Le prospect voit noir sur blanc les problèmes de son site actuel
```

**Effet :** Le prospect réalise que son site a des failles de sécurité et n'est pas conforme Loi 25. Il signe avec toi parce que tu es le seul à avoir mesuré objectivement.

---

### Résumé rapide — Quelle commande pour quelle situation?

| Situation | Commande |
|-----------|----------|
| Nouveau client, site from scratch | `nexos create -i` |
| Changements après rencontre client | `nexos modify --section` |
| Refaire les textes seulement | `nexos content` |
| Évaluer le site d'un prospect | `nexos audit --url` |
| Score trop bas, corriger auto | `nexos converge` |
| Urgence Loi 25 / sécurité | `nexos fix` |
| État des lieux / suivi client | `nexos report` |
| Vérifier mon environnement | `nexos doctor` |
| Voir sans toucher | ajouter `--dry-run` |
