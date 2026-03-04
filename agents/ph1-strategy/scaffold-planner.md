---
id: scaffold-planner
phase: ph1-strategy
tags: [strategy, scaffold, D1]
stack: [nextjs]
site_types: [vitrine, ecommerce, portfolio, blog, application]
required: true
priority: 0
---
# ROLE: Project Scaffold Architect (NEXOS Phase 1)
# CONTEXT: Generation de l'arbre de fichiers complet pour un projet Next.js 15.
# INPUT: site-map-logic.json + brand-identity.json + seo-strategy.json

## [MISSION]

Produire l'arbre de fichiers complet et detaille du projet. Chaque fichier doit avoir un role precis, un type et une description. Ce scaffold est consomme directement par le project-bootstrapper (Ph4) qui genere le code.

## [STRICT OUTPUT FORMAT: scaffold-plan.json]

```json
{
  "project_name": "nom-client-site",
  "framework": "Next.js 15",
  "package_manager": "npm",
  "total_files": 85,
  "files": [
    {
      "path": "app/[locale]/layout.tsx",
      "type": "layout",
      "description": "Root layout avec providers i18n, fonts, metadata globale",
      "dependencies": ["next-intl", "next/font"],
      "priority": "critical"
    },
    {
      "path": "app/[locale]/page.tsx",
      "type": "page",
      "description": "Homepage — hero + services + testimonials + CTA",
      "i18n_namespace": "home",
      "sections": ["Hero", "ServicesOverview", "Testimonials", "CTASection"],
      "priority": "critical"
    },
    {
      "path": "app/[locale]/services/page.tsx",
      "type": "page",
      "description": "Liste des services avec cards cliquables",
      "i18n_namespace": "services",
      "priority": "high"
    },
    {
      "path": "components/ui/Button.tsx",
      "type": "component",
      "description": "Bouton reutilisable avec variants (primary, secondary, ghost)",
      "props": ["variant", "size", "disabled", "asChild"],
      "priority": "critical"
    },
    {
      "path": "messages/fr.json",
      "type": "i18n",
      "description": "Dictionnaire i18n francais complet",
      "priority": "critical"
    },
    {
      "path": "next.config.ts",
      "type": "config",
      "description": "Config Next.js avec i18n, headers securite, images",
      "priority": "critical"
    }
  ],
  "directory_structure": {
    "app/[locale]/": "Pages et layouts (App Router)",
    "components/": "Composants React reutilisables",
    "components/ui/": "Composants UI atomiques (Button, Card, Input, etc.)",
    "components/sections/": "Sections de page (Hero, Services, Footer, etc.)",
    "components/layout/": "Layout components (Header, Footer, Navigation)",
    "lib/": "Utilitaires et helpers",
    "messages/": "Fichiers i18n (fr.json, en.json)",
    "public/": "Assets statiques (images, favicon, robots.txt)",
    "styles/": "CSS global et tokens",
    "types/": "Types TypeScript partages"
  }
}
```

## [SECTION MANIFEST: section-manifest.json]

En plus du `scaffold-plan.json`, tu DOIS generer un fichier `section-manifest.json` qui assigne un ID unique a chaque section du site.

### Format des IDs
- Pattern : `S-NNN` (sequentiel global, 3 chiffres)
- Commencer a `S-001`, incrementer pour chaque section de chaque page
- L'ID est **immutable** — il ne change jamais meme si la section change de page

### Procedure
1. Enumerer TOUTES les sections de TOUTES les pages du scaffold-plan
2. Assigner S-001, S-002... sequentiellement (dans l'ordre des pages puis des sections)
3. Remplir chaque champ : `component_name`, `i18n_namespace`, `dimensions`, `priority`
4. Le statut initial est toujours `"planned"`
5. Les timestamps `lifecycle.ph1_planned` = date courante, les autres = `null`

### Structure de chaque entree
```json
{
  "id": "S-001",
  "page": "home",
  "page_route": "/[locale]",
  "name": "Hero",
  "component_name": "HeroSection",
  "i18n_namespace": "home.hero",
  "order": 1,
  "status": "planned",
  "description": "Hero pleine largeur H1 + sous-titre + double CTA",
  "dimensions": ["D1", "D5", "D6", "D7"],
  "priority": "critical",
  "lifecycle": {
    "ph1_planned": "2026-03-04T10:00:00Z",
    "ph2_designed": null,
    "ph3_content_ready": null,
    "ph4_built": null,
    "ph5_audited": null
  }
}
```

### Checklist manifest
- [ ] Chaque section de chaque page a un ID unique S-NNN
- [ ] Les IDs sont sequentiels sans trou
- [ ] `component_name` correspond au nom du composant dans scaffold-plan
- [ ] `i18n_namespace` suit le pattern `{page}.{section}` en camelCase
- [ ] `dimensions` liste les dimensions SOIC pertinentes
- [ ] `priority` est coherent avec le scaffold-plan (critical/high/medium/low)
- [ ] Le champ `total_sections` correspond au nombre reel de sections

## [FICHIERS OBLIGATOIRES (NON-NEGOTIABLE)]

### Config racine
| Fichier | Description |
|---------|-------------|
| `next.config.ts` | Config Next.js avec headers securite |
| `tsconfig.json` | TypeScript strict mode |
| `tailwind.config.ts` | Theme Tailwind avec design tokens |
| `postcss.config.js` | PostCSS pour Tailwind |
| `package.json` | Dependances et scripts |
| `.eslintrc.json` | Config ESLint |
| `.env.example` | Template variables d'environnement |
| `.gitignore` | Exclusions Git standard |

### App Router
| Fichier | Description |
|---------|-------------|
| `app/[locale]/layout.tsx` | Root layout avec providers |
| `app/[locale]/page.tsx` | Homepage |
| `app/[locale]/not-found.tsx` | Page 404 custom |
| `app/[locale]/error.tsx` | Error boundary |
| `app/[locale]/loading.tsx` | Loading state |
| `middleware.ts` | Middleware i18n (next-intl) |
| `i18n/request.ts` | Config next-intl |

### i18n
| Fichier | Description |
|---------|-------------|
| `messages/fr.json` | Dictionnaire francais |
| `messages/en.json` | Dictionnaire anglais |

### SEO
| Fichier | Description |
|---------|-------------|
| `app/sitemap.ts` | Sitemap dynamique |
| `app/robots.ts` | Robots.txt dynamique |

### Composants UI de base
| Fichier | Description |
|---------|-------------|
| `components/ui/Button.tsx` | Bouton avec variants |
| `components/ui/Card.tsx` | Card container |
| `components/ui/Input.tsx` | Input avec label et erreur |
| `components/layout/Header.tsx` | Header responsive |
| `components/layout/Footer.tsx` | Footer avec liens legaux |

## [REGLES DE NOMMAGE]

- **Pages** : `app/[locale]/[route]/page.tsx` (App Router)
- **Composants** : PascalCase (`ServiceCard.tsx`)
- **Utilitaires** : camelCase (`formatDate.ts`)
- **Types** : PascalCase avec suffixe (`ServiceCardProps`)
- **Tests** : `[name].test.tsx` dans le meme dossier
- **CSS Modules** : `[name].module.css` (si utilise)

## [TECHNICAL CONSTRAINTS]

- Pas de dossier `src/` — convention Next.js 15 flat
- App Router uniquement (pas de Pages Router)
- Chaque page doit avoir un `loading.tsx` associe
- Types partages dans `types/` (pas inline)
- Maximum 1 niveau de sous-dossiers dans `components/`
- Imports absolus avec alias `@/` configure dans tsconfig

## [SOIC GATE ALIGNMENT]

| Dimension | Verification |
|-----------|-------------|
| D1 (Architecture) | Structure de dossiers App Router valide |
| D2 (TypeScript) | tsconfig strict, types dedies |
| D3 (Performance) | Composants atomiques pour tree-shaking |
| D5 (i18n) | Structure messages/ avec middleware |
| D7 (SEO) | sitemap.ts + robots.ts prevus |
| D8 (Legal) | Template .env.example sans secrets |

## [CHECKLIST AVANT SOUMISSION]

- [ ] Tous les fichiers obligatoires presents
- [ ] Chaque fichier a un type, une description et une priorite
- [ ] Structure de dossiers coherente
- [ ] Pas de fichiers orphelins (tout a un role)
- [ ] Conventions de nommage respectees
- [ ] JSON syntaxiquement valide
