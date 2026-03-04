# Phase 1 — Strategy Report
## Client : Électro-Maître | Slug : electro-maitre-industriel
## Date : 2026-03-03 | Pipeline : NEXOS v4.0 create

---

## 1. Positionnement & voix de marque

### Positionnement
**Énoncé** : Électro-Maître est le partenaire de confiance en automation industrielle, maintenance électrique haute tension et thermographie infrarouge pour les entreprises manufacturières du Grand Montréal et de la Montérégie. Disponible 24/7, l'équipe garantit la continuité de vos opérations.

### Proposition de valeur unique (UVP)
> "Vos opérations ne s'arrêtent jamais. Nous non plus."

### Piliers de marque
| Pilier | Manifestation |
|--------|---------------|
| **Fiabilité** | Urgence 24/7, temps de réponse garanti, certifications |
| **Expertise technique** | 3 spécialisations (automation, HT, thermographie), équipe certifiée |
| **Proximité** | Basé à Boucherville, couverture Grand Montréal / Montérégie |
| **Sécurité** | Zéro compromis sur la sécurité électrique, conformité CSA/RBQ |

### Voix de marque
| Attribut | Description | Exemple |
|----------|-------------|---------|
| **Ton** | Professionnel, direct, rassurant | "Nos techniciens interviennent en moins de 2 heures." |
| **Registre** | Technique mais accessible | "Thermographie infrarouge : détectez les défaillances avant la panne." |
| **Éviter** | Jargon excessif, superlatifs vides, humour | ~~"Les meilleurs électriciens du Québec !"~~ |
| **Persona** | L'ingénieur-chef fiable | Factuel, précis, orienté solution |

### Palette confirmée
| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-primary` | `#1A2B3C` | Backgrounds principaux, headers, texte titres |
| `--color-secondary` | `#B2B2B2` | Texte secondaire, bordures, icônes inactives |
| `--color-accent` | `#FFD700` | CTAs, bouton urgence, hover states, highlights |
| `--color-bg-light` | `#F8F9FA` | Sections alternées, cards |
| `--color-bg-dark` | `#0F1923` | Hero section, footer, navbar |
| `--color-text-light` | `#FFFFFF` | Texte sur fond sombre |
| `--color-text-body` | `#374151` | Corps de texte sur fond clair |
| `--color-success` | `#22C55E` | Confirmations, status actif |
| `--color-error` | `#EF4444` | Erreurs de validation, alertes |
| `--color-urgence` | `#FF6B35` | Badge urgence 24/7 (orange vif, distinct du jaune accent) |

### Typographie
| Rôle | Police | Poids | Taille |
|------|--------|-------|--------|
| H1 | Montserrat | ExtraBold (800) | 48px / 3rem |
| H2 | Montserrat | Bold (700) | 36px / 2.25rem |
| H3 | Montserrat | SemiBold (600) | 24px / 1.5rem |
| Body | Inter | Regular (400) | 16px / 1rem |
| Body small | Inter | Regular (400) | 14px / 0.875rem |
| CTA | Montserrat | Bold (700) | 16px / 1rem |
| Nav | Inter | Medium (500) | 15px / 0.9375rem |

---

## 2. Architecture de l'information

### Sitemap hiérarchique

```
electromaitre.ca
│
├── / ─── Accueil
│   ├── Hero (UVP + CTA soumission + CTA urgence)
│   ├── Section 3 piliers services (cards linkées)
│   ├── Chiffres clés (compteurs animés)
│   ├── Projets récents (3 featured)
│   ├── Certifications & partenaires (logo bar)
│   ├── Témoignage client (quote)
│   └── CTA final (soumission + urgence)
│
├── /services ─── Services (landing)
│   ├── /services/automation ─── Automation industrielle
│   │   ├── Description détaillée
│   │   ├── Sous-services (PLC, SCADA, intégration)
│   │   ├── Secteurs desservis
│   │   └── CTA soumission
│   ├── /services/maintenance ─── Maintenance électrique HT
│   │   ├── Préventive vs corrective
│   │   ├── Équipements couverts
│   │   ├── Programme d'entretien
│   │   └── CTA soumission
│   └── /services/thermographie ─── Thermographie infrarouge
│       ├── Processus et technologie
│       ├── Avantages (détection sans arrêt)
│       ├── Rapport type (exemple)
│       └── CTA soumission
│
├── /projets ─── Projets réalisés
│   ├── Grid filtrable (automation | maintenance | thermographie)
│   ├── Cards : image + titre + secteur + résumé
│   └── Page détail projet (optionnel Phase 2)
│
├── /carriere ─── Carrière
│   ├── Culture d'entreprise
│   ├── Avantages
│   ├── Postes ouverts (liste dynamique ou statique)
│   └── Formulaire candidature simplifié
│
├── /contact ─── Contact
│   ├── Formulaire de demande de soumission
│   │   ├── Champs : nom, entreprise, courriel, tél, type de service, message
│   │   └── Upload PDF (plans techniques)
│   ├── Coordonnées complètes
│   ├── Google Maps (zone de service)
│   └── Horaires
│
├── /urgence ─── Urgence 24/7
│   ├── Numéro direct (gros, visible)
│   ├── Formulaire urgence simplifié (nom, tél, description)
│   ├── Temps de réponse garanti
│   └── Procédure d'intervention
│
├── /politique-confidentialite ─── Politique de confidentialité (Loi 25)
├── /mentions-legales ─── Mentions légales (Loi 25)
└── /plan-du-site ─── Sitemap HTML (SEO)
```

### Navigation principale (header)
```
[Logo] ── Services ▼ ── Projets ── Carrière ── Contact ── [Urgence 24/7 🔴]
              │
              ├── Automation industrielle
              ├── Maintenance électrique
              └── Thermographie infrarouge
```

### Navigation footer
```
Services | Projets | Carrière | Contact | Politique de confidentialité | Mentions légales
Adresse | Téléphone | Courriel | © 2026 Les Services Électriques Électro-Maître Inc.
```

### Parcours utilisateur prioritaires
| Persona | Parcours | Objectif |
|---------|----------|----------|
| Directeur maintenance | Accueil → Services → Soumission | Obtenir un devis |
| Gestionnaire usine (urgence) | Accueil → Urgence 24/7 → Appel | Intervention rapide |
| Promoteur immobilier | Accueil → Projets → Contact | Évaluer l'expertise |
| Candidat | Accueil → Carrière → Candidature | Postuler |

---

## 3. Plan SEO

### Mots-clés cibles

#### Principaux (volume moyen, intention commerciale)
| Mot-clé | Page cible | Difficulté estimée |
|---------|------------|-------------------|
| automation industrielle Québec | /services/automation | Moyenne |
| maintenance électrique haute tension | /services/maintenance | Faible |
| thermographie infrarouge industrielle | /services/thermographie | Faible |
| électricien industriel Montérégie | / (accueil) | Moyenne |
| services électriques usine Montréal | / (accueil) | Moyenne |

#### Locaux (longue traîne, forte intention)
| Mot-clé | Page cible |
|---------|------------|
| urgence électrique 24/7 Montréal | /urgence |
| maintenance préventive électrique usine | /services/maintenance |
| programmation PLC Québec | /services/automation |
| inspection thermographique Montérégie | /services/thermographie |
| soumission électricien industriel | /contact |

### Meta tags par page
| Page | Title | Description (max 155 chars) |
|------|-------|-----------------------------|
| Accueil | Électro-Maître — Automation industrielle & maintenance électrique HT | Services d'automation, maintenance haute tension et thermographie infrarouge pour l'industrie au Québec. Urgence 24/7. |
| Automation | Automation industrielle — PLC, SCADA, intégration \| Électro-Maître | Programmation PLC, systèmes SCADA et intégration industrielle. Solutions clé en main pour usines du Grand Montréal. |
| Maintenance | Maintenance électrique haute tension \| Électro-Maître | Maintenance préventive et corrective haute tension. Programme d'entretien sur mesure. Intervention 24/7 en Montérégie. |
| Thermographie | Thermographie infrarouge industrielle \| Électro-Maître | Inspection thermographique sans interruption de production. Détectez les défaillances avant la panne. |
| Projets | Projets réalisés — Automation & électricité industrielle \| Électro-Maître | Découvrez nos réalisations en automation, maintenance HT et thermographie dans les usines du Québec. |
| Carrière | Carrière chez Électro-Maître — Rejoignez notre équipe | Postes en électricité industrielle et automation. Environnement stimulant, formation continue, avantages compétitifs. |
| Contact | Demande de soumission — Électro-Maître | Obtenez une soumission gratuite pour vos besoins en automation, maintenance ou thermographie industrielle. |
| Urgence | Urgence électrique 24/7 — Électro-Maître | Panne électrique industrielle? Notre équipe intervient en moins de 2 heures, 24h/24, 7j/7. Appelez maintenant. |

### Structured Data (JSON-LD)
- **LocalBusiness** : sur toutes les pages (nom, adresse, téléphone, horaires, zone)
- **Service** : sur chaque page service (nom, description, provider, areaServed)
- **BreadcrumbList** : navigation hiérarchique
- **FAQPage** : sur les pages services (questions fréquentes)
- **Organization** : logo, sameAs (réseaux sociaux si applicable)

### Performance SEO cible
| Métrique | Cible |
|----------|-------|
| Lighthouse SEO | ≥ 95 |
| Lighthouse Performance | ≥ 90 |
| Core Web Vitals LCP | < 2.5s |
| Core Web Vitals FID | < 100ms |
| Core Web Vitals CLS | < 0.1 |
| Sitemap XML | multilingue (fr/en) |
| robots.txt | crawlers IA autorisés |

---

## 4. Stack technique (justifié)

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| **Next.js** | 15+ | App Router, SSG/ISR, performance SEO native, image optimization |
| **TypeScript** | 5.x strict | Robustesse, autocompletion, détection erreurs compile-time |
| **Tailwind CSS** | 4 | Design tokens cohérents, purge CSS, responsive-first |
| **next-intl** | latest | i18n FR/EN, routage localisé, SEO multilingue |
| **Framer Motion** | latest | Animations performantes, prefers-reduced-motion natif |
| **Lucide React** | latest | Icônes SVG légères, tree-shakeable |
| **next/font** | built-in | Montserrat + Inter via Google Fonts, self-hosted, zero CLS |
| **next/image** | built-in | Optimisation images automatique, WebP/AVIF, lazy loading |

### Intégrations
| Service | Usage | Note sécurité |
|---------|-------|---------------|
| **Google Maps** | Carte zone de service | API key restreinte server-side |
| **Google Analytics GA4** | Analytics trafic | Chargé APRÈS consentement cookies (Loi 25) |
| **HubSpot** | CRM formulaire soumission | Webhook server-side, pas de script client |
| **Resend** ou **Nodemailer** | Emails confirmation | API route Next.js, clés en env server |

### Hébergement
| Composant | Choix | Justification |
|-----------|-------|---------------|
| **Hosting** | Vercel | CDN global, edge functions, CI/CD Git, SSL auto |
| **Domaine** | electromaitre.ca | DNS pointé vers Vercel |
| **Email** | Google Workspace (existant) | Pas de migration nécessaire |

### Sécurité (D4)
- Headers HTTP dans `vercel.json` : CSP, X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy
- `poweredByHeader: false` dans `next.config.mjs`
- Upload PDF : validation MIME type côté serveur, limite 10 MB, pas de stockage client
- API keys : exclusivement en `env` server-side (jamais `NEXT_PUBLIC_`)
- Rate limiting sur API routes (formulaire soumission)

### Conformité Loi 25 (D8)
- Bandeau cookies opt-in (template NEXOS `cookie-consent-component.tsx`)
- Page `/politique-confidentialite` (template NEXOS `privacy-policy-template.md`)
- Page `/mentions-legales` (template NEXOS `legal-mentions-template.md`)
- RPP : Jean-François Fortin identifié
- Trackers (GA4, Maps) chargés uniquement après consentement explicite

---

## 5. Scaffold (arbre de fichiers)

```
electro-maitre-industriel/site/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-light.svg
│   │   ├── og-image.jpg (1200×630)
│   │   └── projects/ (photos projets)
│   ├── favicon.ico
│   ├── sitemap.xml (généré)
│   └── robots.txt
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx (root layout + fonts + metadata)
│   │   │   ├── page.tsx (accueil)
│   │   │   ├── services/
│   │   │   │   ├── page.tsx (landing services)
│   │   │   │   ├── automation/page.tsx
│   │   │   │   ├── maintenance/page.tsx
│   │   │   │   └── thermographie/page.tsx
│   │   │   ├── projets/page.tsx
│   │   │   ├── carriere/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── urgence/page.tsx
│   │   │   ├── politique-confidentialite/page.tsx
│   │   │   ├── mentions-legales/page.tsx
│   │   │   └── plan-du-site/page.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts (formulaire soumission + upload)
│   │   │   └── urgence/route.ts (formulaire urgence)
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx (navbar sticky + dropdown services)
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx (hamburger menu)
│   │   │   └── Breadcrumbs.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Counter.tsx (compteur animé)
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── FileUpload.tsx (upload PDF)
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── ServicesGrid.tsx (3 piliers)
│   │   │   ├── StatsCounter.tsx (chiffres clés)
│   │   │   ├── FeaturedProjects.tsx
│   │   │   ├── Certifications.tsx (logo bar)
│   │   │   ├── Testimonial.tsx
│   │   │   └── CtaBanner.tsx
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx (soumission + upload)
│   │   │   └── UrgencyForm.tsx (simplifié)
│   │   ├── maps/
│   │   │   └── ServiceAreaMap.tsx (Google Maps)
│   │   ├── legal/
│   │   │   └── CookieConsent.tsx (Loi 25 opt-in)
│   │   └── common/
│   │       ├── UrgencyButton.tsx (sticky, click-to-call)
│   │       └── LanguageSwitcher.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts (cn, formatPhone, etc.)
│   │   ├── constants.ts (coordonnées, liens, config)
│   │   └── validations.ts (schemas Zod formulaires)
│   │
│   ├── i18n/
│   │   ├── request.ts (next-intl config)
│   │   └── routing.ts (locales config)
│   │
│   └── messages/
│       ├── fr.json
│       └── en.json
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json (headers sécurité)
├── package.json
├── .env.local.example
└── .eslintrc.json
```

---

## Score global Phase 1 : 8.8/10

**Points forts** : Architecture d'information claire et alignée avec les parcours utilisateurs. SEO strategy solide avec mots-clés locaux et structured data. Stack technique moderne et justifié. Scaffold détaillé couvrant tous les composants. Loi 25 et sécurité intégrés dès la conception.

**Points à améliorer** : Wireframes détaillés en Phase 2. Spécification exacte du flow upload PDF (taille max, types acceptés, stockage temporaire). Définition des animations Framer Motion.

---

*Généré par NEXOS v4.0 — Phase 1 Strategy | 2026-03-03*
