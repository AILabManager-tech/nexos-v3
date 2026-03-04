---
id: post-deploy-setup
phase: ph5-qa
tags: [deployment, post-deploy]
stack: [nextjs, nuxt, generic]
site_types: [vitrine, ecommerce, portfolio, blog, application]
required: false
priority: 2
---
# Agent: Post-Deploy Setup

## Rôle
Guide et automatise les configurations post-déploiement : Google Search Console,
Google AdSense, Google Analytics, et vérification DNS. Cet agent est exécuté
APRÈS le deploy-master une fois le site live en production.

## Prérequis
- Site déployé et accessible (URL de production confirmée)
- Domaine configuré (DNS propagé, HTTPS actif)
- brief-client.json avec les données de monétisation/analytics

## Workflow

### 1. Google Search Console (GSC)

#### 1.1 Vérification de propriété
- Méthode recommandée : balise `<meta name="google-site-verification">`
- Injecter dans `[locale]/layout.tsx` dans le `<head>` :
  ```html
  <meta name="google-site-verification" content="{{GSC_VERIFICATION_CODE}}" />
  ```
- Alternative : fichier HTML à la racine `public/google{{CODE}}.html`
- Stocker le code dans `.env` : `NEXT_PUBLIC_GOOGLE_VERIFICATION`

#### 1.2 Soumission du sitemap
- Soumettre `{{BASE_URL}}/sitemap.xml` dans GSC → Sitemaps
- Vérifier que toutes les pages sont indexées (4+ URLs typiquement)

#### 1.3 Vérifications
- [ ] Propriété du site validée dans GSC
- [ ] Sitemap soumis et accepté
- [ ] Aucune erreur d'exploration signalée
- [ ] Couverture : toutes les pages indexées

### 2. Google AdSense (si monétisation activée dans le brief)

#### 2.1 Prérequis AdSense
- Domaine de premier niveau requis (PAS de sous-domaine Vercel)
- Le site doit avoir du contenu substantiel (pas de placeholder)
- Le script AdSense doit être dans le HTML serveur (pas en lazy-load)

#### 2.2 Intégration
- Ajouter le script dans `[locale]/layout.tsx` `<head>` :
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_ID}}" crossOrigin="anonymous" />
  ```
- **CRITIQUE** : Le script doit aussi être dans `app/page.tsx` (page root)
  car la racine `/` fait souvent un redirect, et le bot AdSense ne suit pas les 3xx
- Utiliser le composant `templates/ad-unit-component.tsx`
- Variable : `NEXT_PUBLIC_ADSENSE_ID` dans `.env`

#### 2.3 Page root (piège courant)
Si la page root `app/page.tsx` utilise `redirect("/fr")`, la remplacer par :
```tsx
<html><head>
  <meta httpEquiv="refresh" content="0;url=/fr" />
  <script async src="...adsbygoogle.js?client={{ADSENSE_ID}}" />
</head><body>
  <p>Redirecting...</p>
</body></html>
```
Cela garantit que le bot AdSense voit le script avant le redirect.

#### 2.4 CSP pour AdSense
Vérifier que la Content-Security-Policy inclut :
- `script-src`: pagead2.googlesyndication.com, adservice.google.com, googletagservices.com, tpc.googlesyndication.com
- `img-src`: pagead2.googlesyndication.com, *.google.com, *.doubleclick.net
- `frame-src`: googleads.g.doubleclick.net, tpc.googlesyndication.com
- `connect-src`: pagead2.googlesyndication.com, *.google.com

#### 2.5 Message de consentement (CMP)
- Configurer le CMP dans AdSense → Confidentialité et messages
- Option recommandée : 2 choix ("Autoriser" + "Gérer les options")
- Le bandeau cookie-consent du site (Loi 25) est distinct du CMP AdSense

#### 2.6 Vérifications
- [ ] Script AdSense dans le `<head>` du layout ET de la page root
- [ ] NEXT_PUBLIC_ADSENSE_ID configuré dans Vercel env vars
- [ ] CSP mise à jour avec domaines AdSense
- [ ] Vérification AdSense passée (propriété du site validée)
- [ ] CMP configuré

### 3. Google Analytics (si analytics activé dans le brief)

#### 3.1 Intégration
- Utiliser `next/script` avec `strategy="afterInteractive"` :
  ```tsx
  <Script src="https://www.googletagmanager.com/gtag/js?id={{GA_ID}}" strategy="afterInteractive" />
  ```
- Variable : `NEXT_PUBLIC_GA_ID` dans `.env`
- Ne PAS activer avant d'avoir le consentement cookies (Loi 25)

#### 3.2 Vérifications
- [ ] Script GA injecté conditionnellement (après consentement)
- [ ] GA_ID configuré dans Vercel env vars
- [ ] Données reçues dans GA dashboard

### 4. DNS & Performance

#### 4.1 Vérifications DNS
- [ ] A record `@` → IP Vercel (76.76.21.21)
- [ ] CNAME `www` → cname.vercel-dns.com
- [ ] HTTPS actif (certificat Vercel auto-provisionné)
- [ ] Redirect www → non-www (ou inverse, selon brief)

#### 4.2 Performance post-deploy
- Exécuter Lighthouse en production
- Vérifier Core Web Vitals : LCP < 2.5s, FID < 100ms, CLS < 0.1
- Vérifier que les headers de cache sont actifs (assets statiques)

## Output
Fichier : `post-deploy-checklist.md` dans `clients/{slug}/` contenant :
- Statut de chaque vérification (PASS/FAIL/SKIP)
- URLs des dashboards configurés (GSC, AdSense, GA)
- Actions restantes pour le client (ex: attendre approbation AdSense)

## Catégorie
QA — Post-déploiement (contribue à D7 SEO + D5 Performance)
