# Agent: SEO Asset Generator

## Rôle
Génère tous les assets SEO statiques du projet pendant la Phase 4 Build.
Cet agent est exécuté APRÈS le project-bootstrapper et AVANT le build-validator.

## Assets générés

### 1. sitemap.xml
- Template source : `templates/sitemap.template.xml`
- Remplacer `{{BASE_URL}}` avec le domaine du brief
- Générer un bloc `<url>` par page × locale
- Inclure les balises `xhtml:link` hreflang pour chaque locale + `x-default`
- `x-default` pointe vers la locale principale (brief `primary_locale`, défaut: `fr`)
- Priorité : page d'accueil = 1.0, autres = 0.8
- Destination : `site/public/sitemap.xml`

### 2. robots.txt
- Template source : `templates/robots.template.txt`
- Remplacer `{{BASE_URL}}` et `{{SITEMAP_URL}}`
- Autoriser : Googlebot, Bingbot, GPTBot, ClaudeBot, Google-Extended
- Bloquer : /api/, /admin/ (si existants)
- Destination : `site/public/robots.txt`

### 3. OG Image (1200×630)
- Template source : `templates/og-image.template.svg`
- Remplacer les placeholders : `{{SITE_NAME}}`, `{{TAGLINE}}`, `{{PRIMARY_COLOR}}`, `{{ACCENT_COLOR}}`
- Convertir SVG → PNG via : `npx sharp-cli -i og-image.svg -o og-image.png`
  (fallback : `convert og-image.svg og-image.png` via ImageMagick)
- Destination : `site/public/og-image.png` + conserver `og-image.svg`

### 4. Favicon
- Générer `icon.svg` à partir du logo client ou du nom (initiales, couleur brand)
- Convertir en `favicon.ico` (multi-résolution 16×16, 32×32, 48×48)
- Destination : `site/public/favicon.ico`, `site/public/icon.svg`

### 5. JSON-LD (Structured Data)
Injecter dans le layout `[locale]/layout.tsx` via `<script type="application/ld+json">` :

| Type de site | Schemas requis |
|-------------|---------------|
| Vitrine | Organization, WebSite, BreadcrumbList |
| Services | + Service, FAQPage |
| Blog | + Article, BlogPosting |
| E-commerce | + Product, Offer |
| Portfolio | + CreativeWork |

Données tirées du brief-client.json :
- `name` → `legal.company_name`
- `url` → domaine cible
- `logo` → `/icon.svg`
- `address` → `legal.address`
- `telephone` → `legal.phone`
- `email` → `legal.email`

## Entrée
- brief-client.json (domaine, locales, type de site, legal)
- design-tokens.json (couleurs pour OG image)
- scaffold-plan.json (liste des pages)

## Checklist OBLIGATOIRE
- [ ] sitemap.xml généré avec toutes les pages × locales
- [ ] robots.txt avec lien vers sitemap
- [ ] og-image.png 1200×630 < 300KB
- [ ] favicon.ico multi-résolution
- [ ] icon.svg présent
- [ ] JSON-LD Organization + WebSite au minimum
- [ ] JSON-LD valide (pas de champs vides, URLs absolues)

## Catégorie
Build — SEO Assets (contribue à D7 SEO)
