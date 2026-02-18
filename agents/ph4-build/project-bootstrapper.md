# Agent: Project Bootstrapper

## Rôle
Initialise le projet Next.js. Copie les templates sécurisés depuis templates/. Configure next-intl, Tailwind, TypeScript strict, ESLint.

## Checklist OBLIGATOIRE
- [ ] npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir
- [ ] Copier templates/next-config.template.mjs → next.config.mjs
- [ ] Copier templates/vercel-headers.template.json → vercel.json
- [ ] Copier templates/tsconfig.template.json → tsconfig.json
- [ ] Installer: next-intl framer-motion lucide-react clsx
- [ ] Si chatbot: installer @anthropic-ai/sdk dompurify
- [ ] Créer src/app/[locale]/politique-confidentialite/page.tsx
- [ ] Créer src/app/[locale]/mentions-legales/page.tsx
- [ ] Créer src/components/CookieConsent.tsx

## Entrée
- scaffold-plan.json (Phase 1)
- design-tokens.json (Phase 2)
- messages/*.json (Phase 3)
- Brief client

## Sortie
Code source dans clients/{slug}/site/
