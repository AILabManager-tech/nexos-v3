# Mark Systems Demo -- Phase 0 Content Architecture

SOIC: WEB-2026-LAB-0409 | Mode B: NEW SITE | Generated: 2026-04-09

---

## 1. Content Inventory

### 1.1 Application Pages

| Page | URL | Sections | Words | Content Type | Priority |
|------|-----|----------|-------|-------------|----------|
| Dashboard | `/` | Hero metrics, recent experiments, quick actions, agent status panel | ~120 | UI labels + generated summaries | HIGH |
| Experiments Index | `/experiments` | Category grid, search/filter bar, sorting controls, experiment cards | ~80 | UI labels + dynamic metadata | HIGH |
| Experiment Detail | `/experiments/[cat]/[feat]` | Feature demo, props playground, code preview, auto-docs panel, pricing badge | ~200 per page | Auto-generated + technical docs | HIGH |
| Notes | `/notes` | Notes sidebar, MDX editor (Tiptap), tag/category system, search | ~60 (chrome) | User-generated (MDX) | HIGH |
| Showroom | `/showroom` | Client-facing gallery, theme selector, live previews, CTA per experiment | ~300 | Marketing copy + generated | HIGH |
| Settings | `/settings` | Theme picker, language toggle, agent config, profile, export | ~90 | UI labels | MEDIUM |
| Privacy Policy | `/politique-confidentialite` | Full Loi 25 privacy policy | ~1800 | Legal (templated) | HIGH |
| Legal Notices | `/mentions-legales` | Company info, hosting, intellectual property, liability | ~1200 | Legal (templated) | HIGH |

### 1.2 Shared Components / Overlays

| Component | Sections | Words | Content Type | Priority |
|-----------|----------|-------|-------------|----------|
| Cookie Consent Banner | Consent text, accept/refuse/customize buttons | ~60 | Legal (Loi 25) | HIGH |
| Contact Form Modal | Labels, validation messages, success/error states | ~40 | UI labels | MEDIUM |
| Navigation / Sidebar | Menu items, tooltips | ~30 | UI labels | HIGH |
| Agent Chat Panels | System prompts, placeholder text, response formatting | ~80 | System + generated | HIGH |
| Toasts / Notifications | Success, error, warning, info messages | ~100 (all variants) | UI labels | MEDIUM |
| Empty States | No experiments, no notes, no results illustrations | ~60 | UI labels | LOW |
| Onboarding Tour | Step descriptions for first-time users | ~150 | Marketing / UX copy | LOW |

### 1.3 Estimated Totals

- **Static authored content**: ~4,400 words
- **Per-experiment auto-docs**: ~200 words x N experiments
- **User-generated content**: Unlimited (notes)

---

## 2. Content Types Taxonomy

### T1 -- Marketing Copy (Showroom)
- Experiment landing page previews: headline, value prop, CTA
- Showroom intro/hero section
- Pricing badges and tier descriptions
- **Tone**: Concise, confident, technical-yet-accessible
- **Owner**: Business-Strategist Agent drafts, human reviews

### T2 -- Technical Documentation (Auto-generated)
- Component props tables (extracted from TypeScript interfaces)
- Usage examples (pulled from Storybook stories)
- Dependency graphs, bundle size
- **Format**: Structured JSON -> rendered MDX
- **Owner**: DevOps Agent generates, auto-documentation pipeline renders

### T3 -- User-Generated Content
- Notes (MDX + Tiptap): freeform technical notes, experiment journals
- Experiment metadata: title, description, tags, status
- **Format**: MDX stored locally, frontmatter-driven
- **Owner**: Platform user

### T4 -- System UI
- Navigation labels, button text, form labels, validation messages
- Toast notifications (success/error/warning/info)
- Empty states, loading states, tooltips
- **Format**: i18n JSON dictionaries
- **Owner**: Dev team, translated

### T5 -- Legal Content (Loi 25)
- Privacy policy (from `privacy-policy-template.md`)
- Legal notices (from `legal-mentions-template.md`)
- Cookie consent banner text
- Incident notification templates
- **Format**: MDX rendered from NEXOS legal templates, populated with `brief-client.json` variables
- **Owner**: Generated from templates, lawyer-reviewed

---

## 3. i18n Content Plan

### 3.1 Full FR/EN Translation Required

| Category | Estimated Strings | Notes |
|----------|-------------------|-------|
| System UI (nav, buttons, labels) | ~180 | JSON dictionaries under `/messages/` |
| Toasts and notifications | ~40 | Keyed by event type |
| Empty states and onboarding | ~25 | Short paragraphs |
| Legal pages | 2 full pages | ~3,000 words each language |
| Cookie consent | ~8 | Banner + preferences modal |
| Showroom marketing copy | ~60 | Per-experiment headlines + CTAs |
| Agent UI chrome | ~30 | Panel labels, placeholders |
| Settings page | ~20 | Preferences labels |
| **Total** | **~363 translatable string keys** | |

### 3.2 Code-Only (No Translation)

- Component prop names and TypeScript types
- Code examples in Storybook
- CSS variable/token names
- API endpoints and route slugs
- Agent internal system prompts (English only, not user-facing)
- Git metadata, file paths

### 3.3 Implementation

- **Library**: `next-intl` (App Router compatible)
- **Structure**: `/messages/fr.json`, `/messages/en.json`
- **Default locale**: `fr` (Quebec market primary)
- **Fallback**: `en`
- **Dynamic content** (notes, experiment descriptions): stored with locale tag, user writes in their language

---

## 4. Content for Internal Agents

### 4.1 DevOps Agent

**System prompt** (~300 words): Role definition as infrastructure/CI/CD specialist for the Mega-Lab. Constraints: max 250 lines per file, module isolation, Vercel-first deployment.

**User-facing content needed**:
- Agent card: name, avatar, 1-line description ("Infrastructure and deployment automation")
- Capability list: 5-7 bullet points (deploy, monitor, optimize, scaffold, lint)
- Input placeholders: "Describe the infrastructure task..."
- Output templates: deployment status, build report, config diff

**Outputs it generates**:
- Vercel deployment configs, CI pipeline suggestions
- File scaffolding (following feature-wrapper-template)
- Performance and bundle analysis reports

### 4.2 UI-Generator Agent

**System prompt** (~400 words): Role as component designer using Tailwind CSS 4 + Framer Motion. Knows all 4 themes (bento, glassmorphism, minimalist, cyberpunk). Outputs code respecting 250-line max.

**User-facing content needed**:
- Agent card: "Visual component generator"
- Theme selector integration: labels for each theme
- Input placeholders: "Describe the component you want..."
- Preview panel labels: "Generated Preview", "Copy Code", "Send to Storybook"

**Outputs it generates**:
- React component code (TSX)
- Tailwind class suggestions per theme
- Storybook story files
- Props interface documentation

### 4.3 Business-Strategist Agent

**System prompt** (~350 words): Role as product/market analyst. Evaluates experiments for commercial viability. Generates pricing suggestions, competitive positioning, go-to-market briefs.

**User-facing content needed**:
- Agent card: "Product strategy and monetization advisor"
- Input placeholders: "Paste your experiment URL or describe your micro-product..."
- Output section labels: "Market Analysis", "Pricing Recommendation", "Launch Checklist"

**Outputs it generates**:
- Micro-product pricing tiers (free/pro/enterprise)
- One-page business case per experiment
- Showroom copy drafts (headline, value prop, CTA)
- Competitive differentiation notes

---

## 5. Auto-Documentation Spec

### 5.1 What Gets Auto-Documented

| Source | Extracted Data | Trigger |
|--------|---------------|---------|
| TypeScript interfaces | Props table: name, type, default, required, description | On build / file save |
| Storybook stories | Usage examples, variant screenshots | Storybook build |
| `package.json` per experiment | Dependencies, version, bundle size | On build |
| Frontmatter in experiment files | Title, category, status, author, created date | On build |
| Pricing config (`pricing.json`) | Tiers, features per tier, price points | On change |

### 5.2 Auto-Doc Template Structure

```
---
title: {{ experiment.title }}
category: {{ experiment.category }}
status: {{ draft | beta | stable | deprecated }}
created: {{ date }}
bundle_size: {{ kb }}
theme_support: {{ themes[] }}
---

## Overview
{{ experiment.description }}

## Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
{{ for prop in props }}

## Usage
\`\`\`tsx
{{ storybook.defaultStory }}
\`\`\`

## Variants
{{ for variant in storybook.stories }}

## Pricing
{{ if pricing }}
| Tier | Price | Includes |
|------|-------|----------|
{{ for tier in pricing.tiers }}
{{ endif }}

## Dependencies
{{ dependency list with versions }}
```

### 5.3 Output Locations

- **In-app**: Rendered in the experiment detail page auto-docs panel
- **Storybook**: Docs addon page per component
- **Exportable**: JSON + MDX for external consumption

---

## 6. Content Gaps vs. Similar Platforms

### What exists on competitors (Vercel Templates, Shadcn, Storybook showcases)

- Component API docs
- Basic usage examples
- Theme previews

### What Mark Systems should add to differentiate

| Gap | Differentiator | Priority |
|-----|---------------|----------|
| No pricing on component libraries | **Per-experiment pricing and tiers** -- each experiment is a sellable micro-product | HIGH |
| No business context | **Integrated business case** per experiment (via Business-Strategist Agent) | HIGH |
| Static docs only | **Live playground + auto-docs** that update on every commit | HIGH |
| No AI assistance in showcases | **3-agent panel** embedded in the platform (build, design, strategize) | HIGH |
| English-only platforms | **Native FR/EN** with Quebec Loi 25 compliance built-in | MEDIUM |
| No note-taking alongside experiments | **Integrated wiki/notes** (MDX + Tiptap) linked to experiments | MEDIUM |
| Generic theming | **4 curated theme modes** with instant visual switching in showroom | MEDIUM |
| No client-facing mode | **Showroom mode** -- dedicated read-only client view with CTAs | HIGH |
| No export/handoff | **One-click export** of experiment + docs + pricing as deliverable package | LOW |

### Recommended Unique Content Pieces

1. **"Experiment Business Card"** -- A one-page generated summary per experiment combining: live preview, props doc, pricing, and a Business-Strategist-written value proposition. No other platform does this.
2. **"Lab Journal"** -- Public or private notes timeline tied to experiments, showing the build process. Positions Mark Systems as transparent and educational.
3. **"Theme Showdown"** -- Side-by-side comparison of the same component across all 4 themes. Visual differentiation from single-theme competitors.

---

## Summary Metrics

| Metric | Value |
|--------|-------|
| Total pages | 8 (+ N experiment detail pages) |
| Translatable string keys | ~363 |
| Legal pages | 2 (templated from NEXOS) |
| Agent system prompts | 3 (~1,050 words total) |
| Auto-doc template fields | 7 sections |
| Content types | 5 (marketing, tech docs, user-generated, system UI, legal) |
| Estimated Phase 1 copywriting effort | ~4,400 words static + templates |
