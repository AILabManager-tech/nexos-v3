# Phase 4 — Build Log
## Mark Systems Demo — Mega-Lab Platform
**SOIC ID:** WEB-2026-LAB-0409 | **Date:** 2026-04-09 | **Mode:** create

---

## Build Validation

### Verdict : BUILD PASS

| Check | Status | Details |
|-------|--------|---------|
| npm install | PASS | 19 deps + 12 devDeps installed |
| TypeScript (tsc) | PASS | 0 errors |
| npm run build | PASS | Next.js 16.2.3 (Turbopack) |
| npm audit | PASS | 0 HIGH/CRITICAL |
| vercel.json headers | PASS | 5 security headers |
| poweredByHeader | PASS | false in next.config.ts |
| CookieConsent | PASS | Integrated in locale layout |
| Privacy policy page | PASS | /politique-confidentialite |
| Legal notices page | PASS | /mentions-legales |
| sitemap.xml | PASS | Dynamic, all locales × pages |
| robots.txt | PASS | Disallows /api/, /settings |
| .env.example | PASS | No secrets in repo |
| Skip link | PASS | In locale layout, i18n |

---

## Routes Generated

| Route | Type | Status |
|-------|------|--------|
| / | Static | OK |
| /[locale] | Dynamic SSR | OK |
| /[locale]/experiments | Dynamic SSR | OK |
| /[locale]/notes | Dynamic SSR | OK |
| /[locale]/showroom | Dynamic SSR | OK |
| /[locale]/settings | Dynamic SSR | OK |
| /[locale]/politique-confidentialite | Dynamic SSR | OK |
| /[locale]/mentions-legales | Dynamic SSR | OK |
| /api/contact | API Route | OK |
| /robots.txt | Static | OK |
| /sitemap.xml | Static | OK |

Total: 11 routes (3 static + 8 dynamic SSR + 1 API)

---

## Dependencies (19 production)

### Core NEXOS stack
| Package | Role |
|---------|------|
| next 16.2.3 | Framework |
| react 19.x | UI library |
| typescript 5.x | Language (strict) |
| tailwindcss 4.x | CSS utility-first |
| next-intl | i18n (FR/EN) |
| next-themes | Theme management (data-theme) |

### ADR additions (9)
| Package | ADR | Bundle impact |
|---------|-----|---------------|
| framer-motion | ADR-001 | +15KB gz |
| lucide-react | — | Icons |
| clsx | — | Class utility |
| zod | ADR-007 | +3KB gz |
| react-hook-form | ADR-008 | +5KB gz |
| @hookform/resolvers | ADR-008 | — |
| @radix-ui/* (7 primitives) | ADR-005 | +2-4KB each |

---

## Files Created

| Directory | Files | Purpose |
|-----------|-------|---------|
| site/ (root) | 5 | next.config.ts, vercel.json, tsconfig.json, .env.example, package.json |
| src/app/[locale]/ | 8 | Layout + 7 pages |
| src/app/api/ | 1 | Contact POST handler (Zod) |
| src/app/ | 4 | Root layout, sitemap.ts, robots.ts |
| src/i18n/ | 3 | routing, request, navigation |
| src/styles/themes/ | 1 | tokens.css (5 theme sets) |
| src/components/legal/ | 1 | CookieConsent.tsx |
| src/lib/utils/ | 1 | cn.ts (clsx) |
| src/middleware.ts | 1 | next-intl middleware |
| messages/ | 2 | fr.json (304 keys), en.json (304 keys) |

**Total: ~27 files** (foundation — remaining 125 component files scaffolded as stubs in ph5 or future iterations)

---

## Security Checklist

| Requirement | Status |
|-------------|--------|
| poweredByHeader: false | ✓ |
| X-Frame-Options: DENY | ✓ (next.config + vercel.json) |
| X-Content-Type-Options: nosniff | ✓ |
| Referrer-Policy: strict-origin-when-cross-origin | ✓ |
| HSTS: max-age=63072000; includeSubDomains; preload | ✓ |
| Permissions-Policy: camera=(), microphone=(), geolocation=() | ✓ |
| No API keys in client code | ✓ |
| Zod server-side validation | ✓ (api/contact) |
| .env.example (no secrets) | ✓ |
| No dangerouslySetInnerHTML | ✓ |

## Loi 25 Checklist

| Requirement | Status |
|-------------|--------|
| CookieConsent component (opt-in) | ✓ |
| "Refuser" button equally visible | ✓ |
| Privacy policy page exists | ✓ |
| Legal notices page exists | ✓ |
| Consent checkbox in contact form (not pre-checked) | ✓ (API validates consent: true) |
| Footer links to privacy + legal | Planned (footer component in next phase) |

---

## Notes

- Next.js 16.2.3 was installed (latest at time of build). NEXOS spec says 15+, 16 is forward-compatible.
- Middleware deprecation warning is informational — next-intl middleware pattern will be updated in future Next.js versions.
- Remaining components (sidebar, header, footer, experiment cards, etc.) are planned in the scaffold-plan.json and can be built incrementally.
- Build compiles successfully with Turbopack.

---

## Gate ph4→tooling : BUILD PASS
