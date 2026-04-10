# Phase 1 — Strategy Report
## Mark Systems Demo — Mega-Lab Platform
**SOIC ID:** WEB-2026-LAB-0409 | **Date:** 2026-04-09 | **Mode:** create

---

## 1. Positionnement & voix de marque

**Fichier source :** `brand-identity.json`

### Positionnement
- **UVP primaire (12 mots) :** "Le seul labo web ou chaque experimentation est un micro-produit."
- **UVP secondaires :**
  1. Fin de la fragmentation d'outils (Storybook + Notion + portfolio = 1 plateforme)
  2. Notes bi-directionnelles liees aux experimentations (backlinks code<->docs)
  3. 4 themes dynamiques pour demonstrer instantanement a un client
- **Differenciateur cle :** Aucune plateforme ne combine lab + notes + showroom + incubation SaaS avec pricing par experimentation
- **Persona principal :** Dev-entrepreneur, 28-42 ans, Quebec, bilingue, stack Next.js/Tailwind, utilise Linear/Notion/Figma quotidiennement

### Voix de marque
- **Ton :** Technique-accessible, pair-a-pair
- **Formalite :** Niveau 2/5 (direct, conversationnel, pas corporate)
- **Pronom :** "tu" par defaut, "vous" uniquement pages legales
- **Anglicismes :** Termes techniques sans equivalent FR acceptes (deploy, token, scaffold)
- **Lexique encourage :** experimentation, micro-produit, labo, token, scaffold, deploy, showroom, atomique, playground, preview
- **Lexique banni :** synergie, disruption, solution, best-in-class, robuste, revolutionnaire

### Systeme de couleurs — Palette Minimalist (baseline)
| Role | HEX | Contraste sur #0A0A0F |
|------|------|----------------------|
| Primary | #6366F1 | 3.54:1 (large text/decoration) |
| Secondary | #4F46E5 | 2.82:1 (hover states) |
| Accent | #A5B4FC | 7.32:1 (AA pass) |
| Background | #0A0A0F | — |
| Surface | #111118 | — |
| Surface-alt | #1C1C27 | — |
| Text primary | #F1F5F9 | 17.4:1 (AAA pass) |
| Text secondary | #64748B | 4.10:1 (large text AA) |
| Error | #EF4444 | 4.63:1 (AA pass) |
| Success | #10B981 | 5.87:1 (AA pass) |
| Warning | #F59E0B | 8.14:1 (AA pass) |

**Overrides par theme :**
- **Bento :** Surfaces plus chaudes, borders 1.5px proeminents
- **Glassmorphism :** rgba() avec solid fallbacks, glow chromatique indigo, backdrop-blur
- **Cyberpunk :** Neon cyan #00F5FF, violet #BF5AF2, vert #39FF14, dark-only (pas de light mode)

### Typographie
| Role | Font | Weight | Size | Line-height |
|------|------|--------|------|-------------|
| Display/H1 | Geist Sans | 600 | 2.441rem (34.2px) | 1.1 |
| H2 | Geist Sans | 600 | 1.953rem (27.3px) | 1.2 |
| H3 | Geist Sans | 500 | 1.563rem (21.9px) | 1.3 |
| H4 | Geist Sans | 500 | 1.25rem (17.5px) | 1.3 |
| Body | Inter | 400 | 0.875rem (14px) | 1.571 |
| Body large | Inter | 400 | 1rem (16px) | 1.625 |
| Code | JetBrains Mono | 400 | 0.875rem | 1.6 |
| Caption | Inter | 500 | 0.75rem | 1.4 |

Ratio : 1.25 (Major Third) depuis 14px base. Charge via `next/font`, zero layout shift.

---

## 2. Architecture de l'information

**Fichier source :** `site-map-logic.json`

### Routes (11 routes)
| Route FR | Route EN | Template | Profondeur | Priorite |
|----------|----------|----------|------------|----------|
| `/` | `/` | dashboard | 0 | high |
| `/experiments` | `/experiments` | experiments-index | 1 | high |
| `/experiments/[cat]/[feat]` | `/experiments/[cat]/[feat]` | experiment-detail | 2 | high |
| `/notes` | `/notes` | notes-index | 1 | high |
| `/notes/[slug]` | `/notes/[slug]` | note-detail | 2 | medium |
| `/showroom` | `/showroom` | showroom | 1 | high |
| `/settings` | `/settings` | settings | 1 | low |
| `/politique-confidentialite` | `/privacy-policy` | legal | 1 | high (legal) |
| `/mentions-legales` | `/legal-notices` | legal | 1 | high (legal) |
| `/404` | `/404` | error | — | — |
| `/error` | `/error` | error | — | — |

**Profondeur max : 2** (3 clics max depuis home). Toutes routes mappees FR/EN via next-intl.

### Navigation
- **Main nav (5 items) :** Dashboard (LayoutDashboard), Experiments (FlaskConical), Notes (NotebookPen), Showroom (Presentation), Settings (Settings)
- **Sidebar :** Rail 64px (icones) + panneau contextuel 200px (collapsible)
- **Footer :** 3 colonnes (Platform, Resources, Legal)
- **Breadcrumbs :** Affiches a profondeur 2+ uniquement
- **CMD+K :** Recherche globale (pages, experiments, notes, actions, agents, themes)

### Data flow
- **Formulaire contact :** 4 champs + checkbox consentement Loi 25 explicite (texte FR/EN)
  - Retention : 24 mois
  - Handler : Server Action avec rate limiting (3/15min)
- **Cookie consent :** Opt-in, 2 categories (essentiel requis + analytics optionnel)
- **7 tracking points :** Tous conditionnes au consentement analytics

### Maillage interne
- **4 hub pages :** Dashboard (primaire), Experiments index, Notes index, Showroom
- **9 relations de liens** bidirectionnelles
- **Orphan check :** Script CI qui fail le build si route sans lien entrant

---

## 3. Plan SEO

**Fichier source :** seo-strategy (agent output)

### Strategie globale
- **Keyword primaire :** "component showroom"
- **Keywords secondaires :** design system playground, SaaS incubator, web laboratory, micro-product platform, interactive component library
- **Long-tail (5+) :** headless component library with theming, dynamic theming engine for React, MDX notes engine for developers, Next.js component incubator platform, Tailwind CSS component browser
- **Intent :** Informational + commercial (devs evaluant des outils)
- **Focus geo :** Amerique du Nord, Quebec secondaire

### SEO par page
| Page | Primary KW | Title FR (<60) | Index |
|------|-----------|----------------|-------|
| /experiments | web laboratory experiments | Experiences et Composants - Mark Systems | oui |
| /experiments/[c]/[f] | [feature] component playground | [Feature] - Playground Interactif \| Mark Systems | oui |
| /showroom | component showroom | Galerie Complete - Component Showroom \| Mark Systems | oui (priorite 0.95) |
| /notes | technical notes wiki | Notes Techniques & Journal - Mark Systems | conditionnel |
| / (dashboard) | — | — | noindex |
| /settings | — | — | noindex |
| Legal pages | — | — | noindex,follow |

### Structured Data
- **Site-wide :** Organization, WebSite (SearchAction), BreadcrumbList
- **Experiments :** CreativeWork + SoftwareApplication + FAQPage (auto-generee depuis props)
- **Showroom :** WebPage + CollectionPage + LocalBusiness
- **Notes publiques :** Article

### Sitemap
- 3 sitemaps secondaires : static, experiments (dynamique/ISR), notes (publiques)
- Hreflang FR/EN + x-default (FR)
- Generation via Next.js `sitemap.ts`

### Technical SEO
- robots.txt : Allow /experiments, /showroom, /notes. Disallow /api/*, /settings
- Canonical self-referencing sur chaque page
- OG images dynamiques par experimentation
- Twitter card : summary_large_image

---

## 4. Stack technique (justifie)

**Fichier source :** `stack-decision.json`

### Stack core NEXOS (non-negotiable)
| Composant | Version | Justification |
|-----------|---------|---------------|
| Next.js | 15.x App Router | SSR/ISR, React 19 Server Components |
| TypeScript | 5.x strict | noUncheckedIndexedAccess, strictNullChecks |
| Tailwind CSS | 4.x | CSS-first @theme, tokens natifs |
| next-intl | v4 | App Router natif, FR default |
| Vitest | latest | + @testing-library/react + Playwright |
| ESLint | next + jsx-a11y | Qualite + accessibilite |
| Vercel | edge | CI/CD natif, preview deploys |

### Additions optionnelles (9 ADRs)
| ADR | Lib | Bundle | Decision |
|-----|-----|--------|----------|
| ADR-001 | Framer Motion 12 | +15KB gz | include — layout animations, stagger, AnimatePresence |
| ADR-002 | Vercel AI SDK 4 | +12KB gz (server) | include — 3 agents, streaming, structured output |
| ADR-003 | Tiptap 2 + ext | +45KB gz (dynamic) | include — slash commands, inline toolbar, code blocks |
| ADR-004 | @next/mdx + remote | +8KB gz | include — notes, auto-docs, legal templates |
| ADR-005 | Radix UI (11 primitives) | +2-4KB each | include — accessible base for 4 themes |
| ADR-006 | Storybook 8 | 0KB prod | include — dev-only, component docs |
| ADR-007 | Zod 3 | +3KB gz | include — runtime validation AI outputs + forms |
| ADR-008 | React Hook Form 7 | +5KB gz | include — contact, settings, metadata forms |
| ADR-009 | next-themes 0.4 | +1KB gz | include — data-theme, cookie, FOWT prevention |

**Budget bundle :** < 150KB gzipped first load JS. Tiptap + MDX charges dynamiquement sur /notes uniquement.

### Rejete explicitement
jQuery, styled-components, Pages Router, CSS-in-JS runtime, Chakra UI, MUI, GSAP, Prisma/Drizzle, Redux/Zustand, tRPC — chacun avec raison documentee.

### Securite
- `poweredByHeader: false`
- 6 headers : X-Frame-Options DENY, HSTS preload, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy
- CSP nonce-based via middleware
- 3 cookies types (theme, locale, consent) — SameSite/Secure

---

## 5. Scaffold (arbre de fichiers)

**Fichier source :** `scaffold-plan.json`

### Vue d'ensemble
**152 fichiers** organises en architecture atomique :

```
mark-systems-demo/
├── .storybook/               (3)   Config Storybook 8 + 4-theme decorator
├── app/
│   ├── [locale]/             (19)  Pages: dashboard, experiments, notes, showroom, settings, legal
│   └── api/                  (3)   Agent streaming, contact handler, experiments API
├── components/
│   ├── ui/                   (18)  Button, Card, Input, Dialog, Tabs, Toast, Badge, Skeleton...
│   ├── layout/               (8)   Sidebar, Header, Footer, CommandPalette, Breadcrumbs, MobileNav
│   ├── experiments/          (10)  ExperimentCard, Grid, PropsPlayground, AutoDocsPanel, CodePreview
│   ├── notes/                (9)   TiptapEditor, MDXViewer, NoteSidebar, SlashCommandMenu
│   ├── showroom/             (8)   ShowroomCard, LivePreview, ThemeShowdown, PresentationMode
│   ├── agents/               (6)   ChatPanel, AgentCard, MessageBubble, StreamingIndicator
│   └── legal/                (3)   CookieConsent, ConsentPreferences
├── config/
│   ├── themes/               (5)   bento.css, cyberpunk.css, glassmorphism.css, minimalist.css, tokens.css
│   └── agents/               (4)   devops.ts, ui-generator.ts, business-strategist.ts, index.ts
├── experiments/_template/    (4)   component.tsx, stories, test, metadata.json
├── hooks/                    (7)   useTheme, useAgent, useExperiments, useAutosave, useCommandPalette
├── lib/
│   ├── ai/                   (3)   create-agent, rate-limiter, structured-output
│   ├── mdx/                  (3)   compile, component-registry, frontmatter
│   ├── utils/                (4)   cn, format-date, debounce, generate-nonce
│   └── validations/          (4)   experiment, note, contact, agent (Zod)
├── i18n/                     (3)   request.ts, routing.ts, navigation.ts
├── messages/                 (2)   fr.json (~363 keys), en.json
├── types/                    (6)   experiment, note, agent, theme, i18n, navigation
└── [config root]             (10)  next.config.mjs, tsconfig, package.json, middleware.ts...
```

### Section manifest
**38 sections** (S-001 a S-038) couvrant toutes les pages + composants globaux. Chaque section a : component_name, i18n_namespace, dimensions SOIC, priorite, timestamps lifecycle.

---

## Score global: 8.5/10

**Justification par dimension :**
| Dimension | Score | Notes |
|-----------|-------|-------|
| D1 Architecture | 9/10 | 152 fichiers scaffoldes, monorepo atomique, 250 lignes max enforce |
| D2 TypeScript | 9/10 | Strict mode complet, Zod runtime, types dedies par domaine |
| D3 Performance | 8/10 | Budget <150KB, dynamic imports Tiptap/MDX, ADRs avec impact bundle |
| D4 Securite | 9/10 | 6 headers, CSP nonce, poweredByHeader false, cookie config |
| D5 i18n | 8/10 | 363 cles FR/EN, next-intl v4, hreflang, routes bilingues |
| D6 Accessibilite | 8/10 | Radix UI primitives, jsx-a11y, contrastes valides, focus ring |
| D7 SEO | 9/10 | Structured data par page, sitemap dynamique, OG images, keyword plan |
| D8 Legal | 8/10 | Loi 25 : consent opt-in, retention 24 mois, RPP, templates legaux |
| D9 Qualite | 9/10 | 9 ADRs documentes, JSON valides, scaffold complet |

**Gate ph1→ph2 : mu = 8.5 >= 8.0 → PASS**
