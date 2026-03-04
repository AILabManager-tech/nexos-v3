---
id: project-bootstrapper
phase: ph4-build
tags: [architecture, scaffold, D1]
stack: [nextjs]
site_types: [vitrine, ecommerce, portfolio, blog, application]
required: true
priority: 0
---
# Agent: Project Bootstrapper

## Rôle
Initialise le projet Next.js. Copie les templates sécurisés depuis templates/. Configure next-intl, Tailwind, TypeScript strict, ESLint. Applique les best practices performance et SEO dès le bootstrap.

## Checklist OBLIGATOIRE

### Infrastructure de base
- [ ] npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir
- [ ] Copier templates/next-config.template.mjs → next.config.mjs
- [ ] Copier templates/vercel-headers.template.json → vercel.json
- [ ] Copier templates/tsconfig.template.json → tsconfig.json
- [ ] Installer: next-intl framer-motion lucide-react clsx

### Performance — Fonts & Imports
- [ ] Utiliser `next/font/google` pour TOUTES les polices (JAMAIS de `<link>` Google Fonts)
  ```tsx
  import { Inter } from "next/font/google";
  const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
  // Dans <html>: className={inter.variable}
  ```
- [ ] Configurer Tailwind fontFamily avec la CSS variable : `"var(--font-inter)"`
- [ ] Utiliser `next/dynamic` pour les composants below-the-fold :
  ```tsx
  const FAQ = dynamic(() => import("@/components/FAQ"), {
    loading: () => <div className="py-20" />,
  });
  ```
- [ ] Composants lourds (formulaires, cartes interactives) = dynamic import systématique

### Sécurité — Error Sanitization
- [ ] Créer un helper `safeError(e: unknown): string` pour les composants client
  - Ne JAMAIS exposer stack traces, chemins serveur, ou messages techniques à l'utilisateur
  - Mapper les codes HTTP courants vers des messages génériques localisés
  - Pattern :
  ```tsx
  const safeError = (e: unknown): string => {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Failed to fetch")) return t.errors.network;
    if (msg.includes("413")) return t.errors.file_too_large;
    if (msg.includes("429")) return t.errors.rate_limit;
    return t.errors.generic;
  };
  ```

### Conformité Loi 25
- [ ] Si chatbot: installer @anthropic-ai/sdk dompurify
- [ ] Créer src/app/[locale]/politique-confidentialite/page.tsx
- [ ] Créer src/app/[locale]/mentions-legales/page.tsx
- [ ] Créer src/components/CookieConsent.tsx (depuis templates/cookie-consent-component.tsx)

### Monétisation (si activée dans le brief)
- [ ] Copier templates/ad-unit-component.tsx → src/components/AdUnit.tsx
- [ ] Ajouter le script AdSense dans [locale]/layout.tsx `<head>`
- [ ] Ajouter le script AdSense dans app/page.tsx (page root) pour vérification bot
- [ ] Configurer `NEXT_PUBLIC_ADSENSE_ID` dans `.env.local`
- [ ] Mettre à jour la CSP dans next.config / vercel.json avec domaines AdSense

### Page root (redirect)
- [ ] app/page.tsx DOIT être une page HTML complète (pas un `redirect()`)
  - Utiliser `<meta httpEquiv="refresh" content="0;url=/{{PRIMARY_LOCALE}}" />`
  - Inclure le script AdSense si monétisation active
  - Raison : les bots (AdSense, crawlers) ne suivent pas les redirects 3xx

## Entrée
- scaffold-plan.json (Phase 1)
- design-tokens.json (Phase 2)
- messages/*.json (Phase 3)
- Brief client

## Sortie
Code source dans clients/{slug}/site/
