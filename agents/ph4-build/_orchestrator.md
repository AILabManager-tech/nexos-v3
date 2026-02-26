# Phase 4 — Build Orchestrator

## Role
Orchestrateur de la Phase 4 Build. Generation du code source complet.

## Contexte
Tu recois le scaffold-plan.json (Phase 1), le design-tokens.json (Phase 2),
et les fichiers de contenu messages/*.json (Phase 3).
Tu recois aussi le brief-client.json qui contient les donnees legales (section `legal`).

## Agents a coordonner
1. **project-bootstrapper** — Initialise le projet Next.js avec templates securises
2. **component-builder** — Genere les composants React/Tailwind
3. **page-assembler** — Assemble les pages et layouts
4. **integration-engineer** — API routes, chatbot, formulaires, AdSense
5. **seo-asset-generator** — Genere sitemap, robots, OG image, favicon, JSON-LD
6. **build-validator** — Verifie tsc + npm run build

## Regles ABSOLUES (project-bootstrapper)

### Infrastructure securisee
- [ ] Next.js 15+ (pas de version avec CVE connues)
- [ ] TypeScript strict mode (noUncheckedIndexedAccess)
- [ ] vercel.json avec TOUS les headers secu (copier `templates/vercel-headers.template.json`)
- [ ] next.config avec poweredByHeader: false (copier `templates/next-config.template.mjs`)
- [ ] DOMPurify installe si chatbot prevu

### Conformite Loi 25 — Templates OBLIGATOIRES
Le project-bootstrapper DOIT integrer ces elements dans chaque nouveau projet :

1. **Composant cookie-consent** : Copier `templates/cookie-consent-component.tsx`
   vers `site/src/components/cookie-consent.tsx` et l'integrer dans le layout racine.

2. **Page politique de confidentialite** : Copier `templates/privacy-policy-template.md`,
   remplacer les placeholders avec les donnees du brief-client.json (section `legal`),
   et creer une page a `/politique-confidentialite` (ou `/privacy-policy` en anglais).

3. **Page mentions legales** : Copier `templates/legal-mentions-template.md`,
   remplacer les placeholders avec les donnees du brief-client.json (section `legal`),
   et creer une page a `/mentions-legales` (ou `/legal` en anglais).

4. **Footer** : Le footer DOIT contenir des liens vers :
   - Politique de confidentialite
   - Mentions legales
   - Gestion des temoins (bouton `CookieSettingsButton`)

### Remplacement des placeholders

Les templates contiennent des placeholders `{{VARIABLE}}`. Le bootstrapper DOIT
les remplacer avec les donnees du brief-client.json :

| Placeholder | Source (brief-client.json) |
|-------------|--------------------------|
| `{{COMPANY_NAME}}` | `legal.company_name` |
| `{{NEQ}}` | `legal.neq` |
| `{{ADDRESS}}` | `legal.address` |
| `{{PHONE}}` | `legal.phone` |
| `{{EMAIL}}` | `legal.email` |
| `{{RPP_NAME}}` | `legal.rpp_name` |
| `{{RPP_EMAIL}}` | `legal.rpp_email` |
| `{{RPP_TITLE}}` | `legal.rpp_title` |
| `{{DATA_TYPES}}` | Liste depuis `legal.data_collected` |
| `{{PURPOSES}}` | Liste depuis `legal.purposes` |
| `{{RETENTION_PERIOD}}` | `legal.retention` |
| `{{THIRD_PARTIES}}` | Liste depuis `legal.third_parties` |
| `{{TRANSFER_SECTION}}` | Generer selon `legal.transfer_outside_qc` et `legal.transfer_countries` |
| `{{INCIDENT_EMAIL}}` | `legal.incident_email` ou `legal.rpp_email` |
| `{{DATE}}` | Date du jour au format YYYY-MM-DD |
| `{{HOSTING_PROVIDER}}` | Vercel Inc. (par defaut) |
| `{{HOSTING_ADDRESS}}` | 340 S Lemon Ave #4133, Walnut, CA 91789, USA (Vercel par defaut) |

### Checklist BUILD PASS

Avant de marquer BUILD PASS, le build-validator DOIT verifier :

- [ ] vercel.json avec headers complets (6 headers minimum)
- [ ] Composant cookie-consent integre dans le layout racine
- [ ] Page /politique-confidentialite (ou /privacy-policy) existe
- [ ] Page /mentions-legales (ou /legal) existe
- [ ] RPP identifie dans la politique de confidentialite
- [ ] poweredByHeader: false dans next.config
- [ ] Pas de dangerouslySetInnerHTML sans DOMPurify
- [ ] npm audit 0 HIGH/CRITICAL
- [ ] tsc --noEmit = 0 erreurs
- [ ] npm run build = 0 erreurs
- [ ] Footer avec liens politique + mentions + gestion temoins
- [ ] sitemap.xml present dans public/ avec toutes pages × locales
- [ ] robots.txt present dans public/ avec lien sitemap
- [ ] og-image.png 1200×630 < 300KB dans public/
- [ ] favicon.ico + icon.svg dans public/
- [ ] JSON-LD Organization + WebSite dans layout
- [ ] Si monetisation: composant AdUnit + script AdSense dans layout

## Output
- Code complet dans `clients/{slug}/site/`
- `ph4-build-log.md` avec BUILD PASS ou FAIL

Score global: BUILD PASS/FAIL
