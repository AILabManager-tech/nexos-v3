# Phase 0 — Discovery Report

Date: 2026-03-13
Client: La villa du sous-marin
Type: site vitrine bilingue FR/EN
Stack cible: Next.js

Note de cadrage: le `brief-client.json` ne donne ni secteur explicite ni domaine public. Le secteur retenu ici est une inference forte basee sur le site existant public `https://restaurantlavilla.ca` et son contenu observable: restauration rapide locale, avec offre centree sur pizza, sous-marins, livraison et pour emporter a Longueuil.

## 1. Analyse sectorielle

Le marche de reference n’est pas celui d’un restaurant premium. C’est un marche local, transactionnel, fortement oriente intention immediate:

- commander vite
- voir le menu sans friction
- trouver telephone, heures et adresse en quelques secondes
- confirmer la livraison ou le pour-emporter

Les attentes dominantes du secteur:

- proposition de valeur locale et concrete
- CTA de commande visible sans scroll
- menu lisible sur mobile
- promos ou combos mis en avant
- telephone cliquable
- bilingualisme FR/EN exploitable

Mots-cles sectoriels recurrents observes:

`pizza longueuil`, `sous-marins longueuil`, `livraison longueuil`, `commande en ligne`, `pour emporter`, `pizza saint-hubert`, `promotions pizza`, `menu pizza`, `poutine`, `restaurant familial`

## 2. Benchmark concurrence (5 sites)

Concurrents retenus: sites officiels accessibles et comparables en zone Longueuil / Saint-Hubert.

### Jacques Cartier Pizza

- URL: https://www.jacquescartierpizza.com/
- Positionnement observable: chaine familiale, “La pizza, une affaire familiale de quatre generations”
- Points forts:
- ancrage heritage clair
- navigation utile: succursales, histoire, emplois, commande
- commande en ligne exposee tot
- Points faibles:
- home tres orientee promo/transaction, peu de differenciation editoriale
- pages standard attendues (`/menu`, `/contact`) non resolues en direct
- preuve sociale peu visible sur la page d’accueil
- Sources:
- https://www.jacquescartierpizza.com/

### Georges Le Roi du Sous-Marin

- URL: https://georgesleroi.com/
- Positionnement observable: pizza, burger, poutine, sous-marins; livraison et emporter
- Points forts:
- nom de marque tres memorable
- largeur d’offre visible immediatement
- menu et emplacements accessibles depuis le header
- Points faibles:
- structure visuelle ancienne
- page contact retour 403 en fetch direct public
- peu de contenus de confiance visibles au-dessus de la ligne de flottaison
- Sources:
- https://georgesleroi.com/
- https://georgesleroi.com/menu/

### Pacini Longueuil

- URL: https://pacini.com/restaurant-italien-longueuil/
- Positionnement observable: restaurant italien plus etabli, avec reservation et informations de restaurant
- Points forts:
- niveau de finition de marque superieur
- contenu plus riche sur menus, allergenes, carriere, fondation
- signaux de confiance plus forts qu’une pizzeria locale standard
- Points faibles:
- moins directement comparable sur l’univers “sous-marins / livraison rapide”
- parcours plus corporate que transactionnel
- CTA de commande moins agressif que chez les acteurs livraison
- Sources:
- https://pacini.com/restaurant-italien-longueuil/

### Milan Pizzeria

- URL: https://milanpizzeria.ca/
- Positionnement observable: restaurant familial, pizza traditionnelle, commande en ligne, livraison gratuite
- Points forts:
- message commercial simple et utile
- telephone et commande visibles immediatement
- promesse familiale lisible
- Points faibles:
- execution editoriale tres legere
- peu de profondeur de contenu
- pages secondaires standards peu exploitables en direct
- Sources:
- https://milanpizzeria.ca/

### Pizza Avenue Saint-Hubert / Longueuil

- URL: https://www.pizzaavenue.ca/en/saint-hubert
- Positionnement observable: commande en ligne, offres, coupons, appli mobile, point de vente local
- Points forts:
- conversion tres claire
- promos et offers bien exposees
- adresse et telephone visibles
- Points faibles:
- masse promotionnelle elevee
- home centree vente plus que desirabilite de marque
- architecture de contenu faible hors transaction
- Sources:
- https://www.pizzaavenue.ca/en/saint-hubert

### Gaps de marche

- peu de concurrents combinent identite de marque forte et conversion locale nette
- quasi absence de FAQ utile
- quasi absence de contenu SEO local travaille
- execution legale et confiance utilisateur faibles ou invisibles
- peu de sites racontent clairement ce qui rend leur pizza ou leurs sous-marins differents

## 3. Stack techniques detectees

Detection basee sur headers HTTP, source HTML et scripts publics.

| Site | Stack detectee | Indices publics | Perf. homepage | Securite visible |
|---|---|---|---:|---|
| Jacques Cartier Pizza | WordPress + Elementor + WooCommerce + Swiper + GTM | `wp-json`, `wp-content`, `elementor`, `woocommerce`, `googletagmanager` | ~334 ms / 120 KB HTML / 145 refs | Cloudflare, pas de CSP/HSTS visible dans le fetch teste |
| Georges Le Roi | WordPress + Elementor + WooCommerce | `wp-json`, `wp-content`, `elementor`, `woocommerce`; `server: nginx` | ~359 ms / 309 KB HTML / 204 refs | `x-content-type-options` present, peu d’autres headers visibles |
| Pacini Longueuil | WordPress + Elementor + WooCommerce + GTM | `wp-json`, `wp-content`, `elementor`, `woocommerce`, GTM | ~156 ms / 130 KB HTML / 156 refs | HSTS, CSP upgrade, `x-frame-options`, `x-content-type-options` |
| Milan Pizzeria | WordPress + Bootstrap | `wp-json`, `wp-content`, `server: nginx`, `x-powered-by: PHP/8.1.34` | ~971 ms / 36 KB HTML / 49 refs | peu de headers securite visibles |
| Pizza Avenue Saint-Hubert | Wix + GA + GTM | `server: Pepyaka`, `static.parastorage.com`, `x-wix-request-id`, `gtag/js` | ~256 ms / 1728 KB HTML / 98 refs | HSTS, `x-content-type-options` |

Constats transversaux:

- stack dominante: WordPress ou constructeur SaaS
- analytics frequents, gouvernance consentement rarement visible
- performances HTML correctes a moyennes, mais certaines pages restent lourdes ou riches en dependances
- securite heterogene; Pacini ressort au-dessus du lot sur les headers publics

Avantage NEXOS / Next.js:

- architecture bilingue plus propre
- pages locales SEO plus maitrisables
- meilleure gouvernance metadata et legal
- performance mobile plus previsible qu’un WordPress charge ou qu’un site constructeur riche

## 4. Patterns UX dominants

Patterns dominants observes:

- CTA de commande dans le header ou hero: 5/5
- mise en avant livraison / emporter: 5/5
- telephone visible tres tot: 4/5
- promos, coupons ou offres: 3/5
- bilingue FR/EN complet ou partiel: 4/5
- vraie narration de marque: 1/5

Conventions UX du secteur:

- header simple
- hero tres court
- acces rapide au menu
- footer utilitaire avec contact et horaires
- mobile prioritaire dans l’intention

Anti-patterns UX:

- homepages trop transactionnelles, sans message distinctif
- surcharge promotionnelle qui ecrase la hierarchie
- pages contact ou menu parfois mal resolues ou peu robustes
- accessibilite peu visible: contrastes, structure de titres, navigation clavier, consentement explicite

Opportunites de differenciation:

- une homepage qui combine desir de marque et conversion
- un CTA sticky mobile “Appeler” / “Commander”
- une page menu mieux structuree par categories et produits vedettes
- une FAQ courte orientee zones desservies, heures, livraison, allergenes

## 5. Contenu existant (si applicable)

Mode retenu: migration.
Site observe: https://restaurantlavilla.ca

### Inventaire principal

| URL | Titre | Mots approx. | Qualite | SEO | Decision | Observations |
|---|---|---:|---:|---:|---|---|
| https://restaurantlavilla.ca/fr/home | La Villa \| Accueil | 25 | 2/10 | 3/10 | rewrite | Hero ultra court, aucune UVP locale claire, pas de preuve sociale |
| https://restaurantlavilla.ca/fr/menu | La Villa \| Menu | 1280 | 5/10 | 4/10 | rewrite | Menu utile mais dense, peu structure, mix FR/EN, aucun contenu de contexte |
| https://restaurantlavilla.ca/fr/contact | La Villa \| Contact | 47 | 4/10 | 2/10 | rewrite | adresse, telephone, heures presents; meta description absente |
| https://restaurantlavilla.ca/en/home | La Villa \| Home | 23 | 2/10 | 3/10 | rewrite | meme probleme que FR, tres peu de substance |
| https://restaurantlavilla.ca/en/menu | La Villa \| Menu | 1279 | 5/10 | 4/10 | rewrite | utile pour migration du catalogue, mais pas pour SEO ni conversion qualitative |
| https://restaurantlavilla.ca/en/contact | La Villa \| Contact | 47 | 4/10 | 2/10 | rewrite | page serviceable mais minimale |

### Evaluation globale contenu

- tone of voice: incoherent et tres faible
- proposition de valeur: absente
- social proof: absente
- brand story: absente
- bilingualisme: oui, mais execution editoriale basique
- Loi 25: non conforme dans le site observe

Signaux de non-conformite / manques legaux:

- aucune politique de confidentialite visible depuis la navigation observee
- aucun mecanisme de consentement cookies visible alors que GA est charge
- aucune mention claire des usages analytics ou des transferts hors Quebec

### Contenus a preserver

- coordonnees
- horaires
- structure brute du menu
- categories produits et prix
- parcours de commande externe

### Gaps de contenu a creer

- page Accueil reecrite
- page A propos
- page Zones desservies
- page FAQ
- page Politique de confidentialite
- page Mentions legales

## 6. Design trends du secteur

Tendances design observees:

- palette dominante: rouge, blanc, noir, parfois beige ou dore
- imagerie dominante: gros plans de pizzas, burgers, sous-marins, fonds sombres
- typographies: sans-serif grasses ou condensees; parfois couple display + corps simple
- layouts: hero image plein ecran ou bandeau promo + sections courtes
- animations: peu subtiles; sliders et effets de survol simples

Lecture sectorielle:

- le rouge reste associe a l’appetit, la vitesse et la promo
- les meilleurs sites utilisent un contraste fort et des CTA immediats
- beaucoup de concurrents paraissent dated parce qu’ils empilent promos + widgets + assets hetereogenes

Direction recommandee pour se differencier:

- conserver des codes restauration rapide, mais avec une execution plus premium
- rouge profond ou brique en primaire, creme chaud en fond, noir carbone pour l’assise
- typographie display expressive pour les titres et sans-serif nette pour le contenu
- photos produit reelles, pas de banque d’images generique
- sections plus respirees que la moyenne du secteur

Anti-patterns design a eviter:

- slider hero automatique
- texte blanc sur image sans overlay suffisant
- accumulation de badges, promos et CTA concurrents
- look “template WordPress resto” trop evident

## 7. Recommandations pour Phase 1

Priorites:

1. Repositionner la marque comme pizzeria locale memorisable, pas seulement comme carte-menu en ligne.
2. Construire une architecture vitrine courte mais dense: Accueil, Menu, A propos, Contact, FAQ, pages legales.
3. Garder la commande externe, mais faire du site principal un meilleur outil de desir, confiance et SEO local.
4. Assurer un bilinguisme reel FR/EN avec metadata, URLs et contenus propres.
5. Integrer la conformite Loi 25 des le depart: consentement analytics, politique de confidentialite, responsable des renseignements personnels.

Hypothese de structure homepage:

- hero avec UVP locale claire
- specialites / categories phares
- preuves de confiance
- zones desservies + horaires
- bloc CTA double: appeler / commander
- FAQ courte

Positionnement recommande:

“La Villa” doit sortir du modele site-menu minimaliste. Le bon angle est une marque de quartier fiable, rapide et memorisable, avec une execution plus propre que la moyenne locale, sans perdre la conversion immediate attendue dans la categorie.

Score global: 6.8/10
