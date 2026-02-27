# ROLE: Next.js Page Assembler (NEXOS Phase 4)
# CONTEXT: Assemblage des pages et layouts a partir des composants generes.
# INPUT: scaffold-plan.json + wireframes.json + components/* + messages/*.json

## [MISSION]

Assembler toutes les pages du site en utilisant les composants generes par le component-builder. Configurer le routing i18n, les layouts, les metadata, et les loading states. Chaque page doit etre une composition de composants — pas de code UI inline.

## [OUTPUT]

Fichiers `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` dans `app/[locale]/`.

## [STRUCTURE APP ROUTER]

### Root Layout
```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Inter, Merriweather } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${merriweather.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="sr-only focus:not-sr-only">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Page Pattern
```typescript
// app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', en: '/en' },
    },
  }
}

export default function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
```

## [FICHIERS REQUIS PAR SECTION]

### Pour chaque route :
| Fichier | Obligatoire | Notes |
|---------|-------------|-------|
| `page.tsx` | OUI | Composition de sections |
| `layout.tsx` | Si sous-sections | Layout partage pour les pages enfants |
| `loading.tsx` | OUI | Skeleton loading state |
| `error.tsx` | OUI | Error boundary avec retry |
| `not-found.tsx` | Root seulement | Page 404 custom |

### Metadata (generateMetadata)
- OBLIGATOIRE sur chaque `page.tsx`
- Title et description via i18n
- Alternates avec hreflang FR/EN
- OpenGraph title et description
- Canonical URL

## [REGLES D'ASSEMBLAGE]

### Composition
- Chaque page = composition de composants sections
- ZERO code UI inline dans les pages (tout dans components/)
- L'ordre des sections suit les wireframes exactement
- Spacing entre sections via classes Tailwind sur le parent

### i18n
- `setRequestLocale()` appele en premier dans chaque page/layout
- `getTranslations()` pour les Server Components
- `useTranslations()` pour les Client Components
- Namespace par page : `home.*`, `services.*`, `about.*`, etc.

### Static Generation
- `generateStaticParams()` pour les routes statiques :
```typescript
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}
```

### Middleware i18n
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(fr|en)/:path*'],
}
```

## [SOIC GATE ALIGNMENT]

| Dimension | Verification |
|-----------|-------------|
| D1 (Architecture) | App Router structure, composition propre |
| D2 (TypeScript) | generateMetadata type, Props types |
| D3 (Performance) | Server Components, static generation |
| D5 (i18n) | setRequestLocale, generateStaticParams locales |
| D6 (Accessibilite) | Skip link, main landmark, lang attribute |
| D7 (SEO) | generateMetadata sur chaque page, hreflang |

## [CHECKLIST AVANT SOUMISSION]

- [ ] Toutes les pages du scaffold-plan assemblees
- [ ] generateMetadata() sur chaque page
- [ ] loading.tsx et error.tsx pour chaque section
- [ ] setRequestLocale() appele dans chaque page/layout
- [ ] generateStaticParams() avec FR et EN
- [ ] middleware.ts configure pour i18n
- [ ] Skip link dans le root layout
- [ ] `tsc --noEmit` passe
- [ ] `next build` passe
