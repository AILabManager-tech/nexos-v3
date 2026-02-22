# Guide — Cookies, collecte de données et consentement

> Document de référence Mark Systems / NEXOS
> Dernière mise à jour : 2026-02-21

---

## Table des matières

1. [C'est quoi un cookie?](#1-cest-quoi-un-cookie)
2. [La bannière de consentement — pourquoi ça existe](#2-la-bannière-de-consentement--pourquoi-ça-existe)
3. [La Loi 25 du Québec — ce qu'elle exige](#3-la-loi-25-du-québec--ce-quelle-exige)
4. [Quand la bannière est nécessaire vs inutile](#4-quand-la-bannière-est-nécessaire-vs-inutile)
5. [Les 3 catégories de cookies](#5-les-3-catégories-de-cookies)
6. [Quelles données collecter et pourquoi](#6-quelles-données-collecter-et-pourquoi)
7. [Feuille de route — quand ajouter quoi](#7-feuille-de-route--quand-ajouter-quoi)
8. [Impact SEO](#8-impact-seo)
9. [Implémentation technique NEXOS](#9-implémentation-technique-nexos)
10. [Décision prise pour USINE_RH_industrielle](#10-décision-prise-pour-usine_rh_industrielle)

---

## 1. C'est quoi un cookie?

Un cookie est un petit fichier texte stocké dans le navigateur du visiteur. Il permet au site de "se rappeler" de certaines choses.

### Exemples concrets

| Cookie | Rôle | Exemple |
|--------|------|---------|
| Langue | Se souvenir que le visiteur préfère le français | `locale=fr` |
| Session | Garder l'utilisateur connecté | `session_id=abc123` |
| Analytics | Compter les visites, pages vues, durée | `_ga=GA1.2.xxxxx` |
| Marketing | Suivre le visiteur pour lui montrer des pubs ciblées | `_fbp=fb.1.xxxxx` |

Les deux premiers sont **essentiels** (le site ne fonctionne pas bien sans). Les deux derniers sont du **tracking** — c'est là que la loi intervient.

---

## 2. La bannière de consentement — pourquoi ça existe

La bannière de cookies (aussi appelée "bandeau de consentement") est un popup qui apparaît à la première visite pour demander au visiteur s'il accepte que le site collecte des données via cookies.

### Le principe fondamental : opt-in

```
AVANT la loi :  Le site collecte tout par défaut, le visiteur peut refuser (opt-out)
APRÈS la loi :  Le site ne collecte rien par défaut, le visiteur doit accepter (opt-in)
```

### Ce que la bannière doit inclure

- Un bouton **"Accepter"** — active les cookies non-essentiels
- Un bouton **"Refuser"** — aussi visible que "Accepter" (pas caché en petit)
- Le détail des **catégories** (essentiels, analytics, marketing)
- Un lien vers la **politique de confidentialité**

### Ce qui est interdit

- Cases pré-cochées (le consentement doit être un geste actif)
- "Cookie walls" qui bloquent l'accès au site si on refuse
- Bouton "Refuser" caché, grisé ou plus petit que "Accepter"
- Continuer la navigation = consentement (non, ça ne compte pas)

---

## 3. La Loi 25 du Québec — ce qu'elle exige

La **Loi modernisant des dispositions législatives en matière de protection des renseignements personnels** (Loi 25) est entrée en vigueur progressivement depuis septembre 2022.

### Obligations principales

| Obligation | Description | Depuis |
|------------|-------------|--------|
| Responsable (RPP) | Nommer un responsable de la protection des renseignements personnels | Sept 2022 |
| Incidents | Signaler tout incident de confidentialité à la CAI | Sept 2022 |
| Consentement | Obtenir le consentement pour collecter des données | Sept 2023 |
| Politique de confidentialité | Page dédiée avec : types de données, finalités, durée de conservation, droits | Sept 2023 |
| Transparence | Informer clairement de l'utilisation des données | Sept 2023 |
| Droit d'accès | Permettre aux individus d'accéder, rectifier ou supprimer leurs données | Sept 2024 |

### Amendes possibles

- **Personne physique** : 5 000$ à 100 000$
- **Entreprise** : 15 000$ à 25 000 000$ (ou 4% du chiffre d'affaires mondial)

### Qui est concerné?

Toute entreprise québécoise OU toute entreprise qui collecte des données de résidents québécois. Même un site vitrine d'une consultante solo.

---

## 4. Quand la bannière est nécessaire vs inutile

### La bannière EST nécessaire si le site :

- Utilise Google Analytics, Matomo, ou tout outil de mesure d'audience
- Intègre le pixel Facebook, LinkedIn Insight Tag, ou autre tracker publicitaire
- Utilise des cookies tiers (chat en direct externe, vidéos YouTube embarquées, widgets sociaux)
- Collecte des données personnelles via formulaires envoyés à un CRM/base de données
- Utilise Hotjar, Clarity, ou tout outil d'enregistrement de session

### La bannière est INUTILE si le site :

- N'utilise aucun outil d'analytics
- N'a aucun tracker publicitaire
- Ne stocke que des cookies strictement nécessaires (langue, thème)
- Les formulaires envoient un simple email (sans stocker dans une base)

### Exemple réel — USINE_RH_industrielle

```
Google Analytics ?    NON
Facebook Pixel ?      NON
Hotjar ?              NON
CRM ?                 NON
Cookies utilisés ?    Aucun (sauf cookie-consent lui-même, qui est paradoxal)

Verdict : bannière RETIRÉE — elle demandait un consentement pour une collecte inexistante.
```

---

## 5. Les 3 catégories de cookies

Le composant NEXOS `CookieConsent` organise les cookies en 3 catégories standard :

### Essentiels (toujours actifs)

- Fonctionnement de base du site
- Pas besoin de consentement
- Exemples : préférence de langue, token CSRF, identifiant de session

### Analytics (désactivés par défaut)

- Mesure d'audience et comportement
- Nécessitent le consentement
- Exemples : Google Analytics (`_ga`, `_gid`), Matomo, Plausible

### Marketing (désactivés par défaut)

- Publicité ciblée et remarketing
- Nécessitent le consentement
- Exemples : Facebook Pixel (`_fbp`), Google Ads (`_gcl_au`), LinkedIn Insight

### Principe technique

```
Visiteur arrive → seuls les cookies essentiels sont actifs
Visiteur clique "Accepter analytics" → script GA se charge dynamiquement
Visiteur refuse tout → aucun script de tracking ne se charge jamais
```

---

## 6. Quelles données collecter et pourquoi

### Tableau décisionnel

| Donnée | Outil | Ce que ça révèle | Utile quand? |
|--------|-------|-------------------|--------------|
| Pages visitées, durée, parcours | Google Analytics | Quelles pages intéressent, où les gens quittent | +200 visiteurs/mois |
| Ville/région du visiteur | Google Analytics | D'où viennent les prospects | Marché multi-régional |
| Source du trafic | Google Analytics | Google, Facebook, LinkedIn, direct? | Investissement en pub |
| Clics sur les CTA | Google Analytics (events) | Est-ce que "Parlons-en" est cliqué ou ignoré? | Optimisation conversion |
| Soumissions formulaire | Formulaire → CRM | Qui contacte, quand, pour quoi | Pipeline de vente structuré |
| Score au quiz diagnostic | Custom event | Niveau de maturité RH des prospects | Segmentation prospects |
| Conversions pub | Google Ads / Meta Pixel | Retour sur investissement publicitaire | Budget pub actif |

### La règle d'or

> **Ne collecte que ce que tu vas réellement analyser et utiliser pour prendre des décisions.**
> Collecter des données "au cas où" c'est du bruit, pas de l'information.

### Exemple — collecte inutile vs utile

```
INUTILE : "J'ai Google Analytics mais je ne regarde jamais le dashboard"
→ Tu collectes des données personnelles sans raison = risque légal pour rien

UTILE : "Je paie 500$/mois en pub Google, je veux savoir quelles pages convertissent"
→ Tu as un besoin clair, les données guident une décision budgétaire
```

---

## 7. Feuille de route — quand ajouter quoi

### Phase 1 — Lancement (maintenant)

**Collecte : aucune**

- Le site est une carte de visite en ligne
- Les clients viennent par réseau, LinkedIn, références
- Le formulaire contact suffit
- Priorité : avoir un site crédible qui inspire confiance

### Phase 2 — Trafic organique (~3-6 mois)

**Ajouter : Google Search Console (gratuit, aucun cookie)**

- C'est côté serveur Google, pas côté visiteur
- Aucune bannière nécessaire
- Données disponibles : recherches Google qui mènent au site, clics, position moyenne
- Permet de valider si le SEO fonctionne

```
Coût : 0$
Impact vie privée : aucun
Bannière cookies : non requise
Temps d'installation : 15 minutes (vérification DNS)
```

### Phase 3 — Investissement en visibilité (~6-12 mois)

**Ajouter : Google Analytics 4 + bannière cookies**

Déclencheurs :
- La cliente paie de la pub (Google Ads, LinkedIn Ads)
- Elle publie du contenu régulier (articles, guides RH)
- Le trafic dépasse ~200 visiteurs/mois

Ce que ça permet :
- Mesurer le ROI des pubs
- Identifier les pages qui convertissent
- Comprendre le parcours visiteur → prospect

```
Coût : 0$ (GA4 est gratuit)
Impact vie privée : moyen (cookies tiers)
Bannière cookies : OBLIGATOIRE
Temps d'installation : 30 minutes (réactiver CookieConsent + ajouter GA4)
```

### Phase 4 — Scaling (~12-24 mois)

**Ajouter : CRM + automatisation**

- Soumissions du quiz diagnostic → pipeline de prospects automatisé
- Score quiz "bas" → email automatique avec guide RH gratuit
- Score quiz "haut" → notification directe pour un appel
- Suivi conversion complète : visite → quiz → contact → contrat

```
Coût : ~30-100$/mois (CRM type HubSpot Free, Brevo, etc.)
Impact vie privée : élevé (données personnelles stockées)
Bannière cookies : OBLIGATOIRE + politique de confidentialité mise à jour
```

---

## 8. Impact SEO

### La bannière de cookies affecte-t-elle le SEO?

**Non. Google ne donne aucun point SEO pour une bannière de cookies.**

Ce que Lighthouse SEO mesure :
- Balises meta (title, description)
- Attribut `lang` sur `<html>`
- URLs canoniques
- Alt text sur les images
- robots.txt et sitemap
- Mobile-friendly

Ce que Google Search ne vérifie jamais :
- Présence/absence d'une bannière cookies
- Type de consentement
- Cookies installés

### Effet indirect (positif) de retirer la bannière

- **Moins de JavaScript** chargé = meilleur score Performance
- **Pas de Layout Shift** causé par le popup = meilleur CLS (Core Web Vital)
- **Meilleure UX** = le visiteur voit le contenu immédiatement

---

## 9. Implémentation technique NEXOS

Le pipeline NEXOS inclut un composant `CookieConsent` prêt à l'emploi.

### Fichiers concernés

```
src/components/legal/CookieConsent.tsx    → Composant bannière (3 catégories)
src/components/layout/ClientWidgets.tsx   → Chargement lazy (dynamic import)
src/app/[locale]/confidentialite/page.tsx → Page politique de confidentialité
src/app/[locale]/mentions-legales/page.tsx → Page mentions légales
messages/fr.json → Clés i18n "cookies.*"
messages/en.json → Clés i18n "cookies.*"
```

### Pour réactiver la bannière (30 minutes)

1. Dans `ClientWidgets.tsx`, remettre l'import dynamique :
```tsx
const CookieConsent = dynamic(
  () => import("@/components/legal/CookieConsent").then((m) => ({
    default: m.CookieConsent,
  })),
  { ssr: false, loading: () => null }
);
```

2. Ajouter `<CookieConsent />` dans le JSX

3. Conditionner le chargement de GA4 au consentement :
```tsx
// Ne charger GA que si l'utilisateur a accepté "analytics"
if (cookieConsent.analytics) {
  loadGoogleAnalytics("G-XXXXXXXXXX");
}
```

### Pages légales (toujours présentes)

Même sans bannière, les pages `/confidentialite` et `/mentions-legales` restent en place. Elles sont obligatoires dès qu'un formulaire de contact existe (même s'il envoie juste un email).

---

## 10. Décision prise pour USINE_RH_industrielle

**Date** : 2026-02-21

**Décision** : Bannière de cookies **retirée**

**Raison** : Le site ne collecte aucune donnée personnelle via cookies. Aucun analytics, aucun tracker, aucun pixel publicitaire. La bannière demandait un consentement pour une collecte inexistante.

**Ce qui reste en place** :
- Page `/confidentialite` (politique de confidentialité)
- Page `/mentions-legales` (mentions légales)
- Composant `CookieConsent.tsx` (conservé dans le code, non chargé)

**Condition de réactivation** : Dès qu'un outil de collecte est ajouté (GA4, pixel, CRM), réactiver la bannière en suivant la procédure section 9.

---

*Document généré par Mark Systems / NEXOS — Ne pas redistribuer sans autorisation.*
