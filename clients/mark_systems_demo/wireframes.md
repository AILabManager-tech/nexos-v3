# Phase 2 — Wireframes (Desktop Resolution)
## Mark Systems Demo — Mega-Lab Platform
**SOIC ID:** WEB-2026-LAB-0409 | **Date:** 2026-04-09 | **Phase:** ph2-design

All wireframes target desktop resolution (>= 1024px) with full sidebar (264px).
Grid notation: `fr` = fractional unit, `px` = fixed pixels.

---

## 1. Dashboard (`/`)

**Layout:** Sidebar (264px) + Main content area (1fr, max 1400px)

```
+------------------------------------------------------------------+
| SIDEBAR (264px)  |  MAIN CONTENT (1fr, max 1400px, px-8)        |
|                  |                                                |
| [Rail 64px]      |  HEADER BAR                                   |
| +----------+     |  +------------------------------------------+ |
| | MS Logo  |     |  | "Dashboard"          [CMD+K] [Theme] [FR]| |
| |          |     |  +------------------------------------------+ |
| | Dashboard*     |                                                |
| | Experiments    |  STAT STRIP (grid-cols-4, gap-6)              |
| | Notes    |     |  +--------+ +--------+ +--------+ +--------+ |
| | Showroom |     |  |Experi- | |Notes   | |Agent   | |Show-   | |
| | Settings |     |  |ments   | |Created | |Calls   | |room    | |
| |          |     |  | [42]   | | [128]  | | [1.2k] | |Views   | |
| +----------+     |  |sparkln | |sparkln | |sparkln | | [856]  | |
| |Panel 200px     |  +--------+ +--------+ +--------+ +--------+ |
| |                |                                                |
| | Quick Actions  |  BENTO GRID (grid-cols-3, gap-6)             |
| | - New Exp.     |  +-------------------+ +--------+ +--------+ |
| | - New Note     |  |                   | |Recent  | |Recent  | |
| | - Open Showrm  |  | FEATURED EXP.     | |Exp #2  | |Exp #3  | |
| |                |  | (col-span-2,      | |        | |        | |
| | Recent Notes   |  |  row-span-2)      | |[Card]  | |[Card]  | |
| | - Note title   |  |                   | +--------+ +--------+ |
| | - Note title   |  | [Live Preview]    | +--------+ +--------+ |
| | - Note title   |  | [Title + Tags]    | |Recent  | |Recent  | |
| |                |  | [View ->]         | |Exp #4  | |Exp #5  | |
| | Agent Status   |  +-------------------+ +--------+ +--------+ |
| | @ DevOps: idle |                                                |
| | @ UI-Gen: idle |  AGENT STATUS ROW (grid-cols-3, gap-6)       |
| | @ Biz: active  |  +------------+ +------------+ +------------+ |
| |                |  | DevOps     | | UI Generator| | Business  | |
| +----------+     |  | Agent      | | Agent       | | Strategist| |
|                  |  | [idle]     | | [idle]      | | [active]  | |
|                  |  | Last: 2h   | | Last: 30m   | | Running...| |
|                  |  +------------+ +------------+ +------------+ |
|                  |                                                |
|                  |  ACTIVITY FEED (full-width list)               |
|                  |  +------------------------------------------+ |
|                  |  | 14:32  Experiment "Bento Grid" updated    | |
|                  |  | 14:15  Note "CSS Layers" auto-saved       | |
|                  |  | 13:58  Agent: Business strategy generated | |
|                  |  | 13:40  Showroom: 3 new views              | |
|                  |  | [Show more...]                            | |
|                  |  +------------------------------------------+ |
+------------------------------------------------------------------+
```

**Key measurements:**
- Sidebar: 64px rail + 200px panel = 264px fixed
- Stat cards: equal width (1fr each), 80px height
- Featured card: col-span-2, row-span-2 (~380px height)
- Standard cards: ~180px height
- Activity feed: max-h-[300px] with scroll

---

## 2. Experiments Index (`/experiments`)

**Layout:** Sidebar (264px) + Main content (1fr, max 1400px)

```
+------------------------------------------------------------------+
| SIDEBAR (264px)  |  MAIN CONTENT                                 |
|                  |                                                |
| [Rail + Panel]   |  HEADER BAR                                   |
|                  |  +------------------------------------------+ |
| Dashboard        |  | "Experiments"      [CMD+K] [Theme] [FR]  | |
| Experiments*     |  +------------------------------------------+ |
| > All            |                                                |
| > UI Components  |  SEARCH + FILTERS (single row)                |
| > Animations     |  +------------------------------------------+ |
| > Data Viz       |  | [Search icon] Search experiments...       | |
| > Layout         |  | [Sort: Recent v]  [View: Grid|List]      | |
| Notes            |  +------------------------------------------+ |
| Showroom         |                                                |
| Settings         |  CATEGORY CHIPS (horizontal row)               |
|                  |  +------------------------------------------+ |
|                  |  | [All*] [UI Components] [Animations]       | |
|                  |  | [Data Viz] [Layout] [Forms] [Navigation] | |
|                  |  +------------------------------------------+ |
|                  |                                                |
|                  |  CARD GRID (grid-cols-3, gap-6)               |
|                  |  +----------+ +----------+ +----------+       |
|                  |  |[Preview] | |[Preview] | |[Preview] |       |
|                  |  | 16:9     | | 16:9     | | 16:9     |       |
|                  |  |          | |          | |          |       |
|                  |  |----------| |----------| |----------|       |
|                  |  |Title     | |Title     | |Title     |       |
|                  |  |Category  | |Category  | |Category  |       |
|                  |  |[Badge]   | |[Badge]   | |[Badge]   |       |
|                  |  |Updated 2d| |Updated 1w| |Updated 3d|       |
|                  |  +----------+ +----------+ +----------+       |
|                  |  +----------+ +----------+ +----------+       |
|                  |  |[Preview] | |[Preview] | |[Preview] |       |
|                  |  | 16:9     | | 16:9     | | 16:9     |       |
|                  |  |          | |          | |          |       |
|                  |  |----------| |----------| |----------|       |
|                  |  |Title     | |Title     | |Title     |       |
|                  |  |Category  | |Category  | |Category  |       |
|                  |  |[Badge]   | |[Badge]   | |[Badge]   |       |
|                  |  |Updated 5d| |Updated 1d| |Updated 2w|       |
|                  |  +----------+ +----------+ +----------+       |
|                  |                                                |
|                  |  PAGINATION / LOAD MORE                        |
|                  |  +------------------------------------------+ |
|                  |  |     [<] Page 1 of 4 [>]    [Load more]   | |
|                  |  +------------------------------------------+ |
+------------------------------------------------------------------+
```

**Key measurements:**
- Card width: ~33% of content area (1fr in 3-col grid)
- Card thumbnail: 16:9 aspect ratio
- Card body: ~80px (title, category badge, timestamp)
- Total card height: ~260px
- Category chips: 32px height, horizontal scroll if overflow
- Search bar: 48px height (touch target compliant)

---

## 3. Experiment Detail (`/experiments/[cat]/[feat]`)

**Layout:** Sidebar (264px) + Split pane: Left (1fr) + Right (380px)

```
+------------------------------------------------------------------+
| SIDEBAR (264px)  |  MAIN CONTENT (split pane)                    |
|                  |                                                |
| [Rail + Panel]   |  BREADCRUMBS                                  |
|                  |  Experiments > UI Components > Bento Grid      |
| Dashboard        |                                                |
| Experiments*     |  TITLE BAR                                     |
| > UI Components* |  +------------------------------------------+ |
|   > Bento Grid*  |  | "Bento Grid Component"    [Fullscreen]   | |
|   > Carousel     |  | [UI Components] [v2.1] [Published]       | |
|   > Dialog       |  +------------------------------------------+ |
| Notes            |                                                |
| Showroom         |  LEFT PANE (1fr)           | RIGHT (380px)    |
| Settings         |  +------------------------+|+--------------+  |
|                  |  | LIVE PREVIEW            || AUTO-DOCS    |  |
|                  |  |                         ||              |  |
|                  |  | +--------------------+  || Overview     |  |
|                  |  | |                    |  || ------------ |  |
|                  |  | | [Component         |  || A responsive |  |
|                  |  | |  renders here      |  || bento grid   |  |
|                  |  | |  in iframe]        |  || component... |  |
|                  |  | |                    |  ||              |  |
|                  |  | +--------------------+  || Props (5)    |  |
|                  |  |                         || ------------ |  |
|                  |  | Viewport: [M] [T] [D]   || - cols: num  |  |
|                  |  | Theme:  [Min][Ben][Gl][Cy]| - gap: str  |  |
|                  |  +------------------------+|| - variant    |  |
|                  |  | CODE PANEL              ||              |  |
|                  |  | +--------------------+  || Usage        |  |
|                  |  | | import { BentoGrid }  || ------------ |  |
|                  |  | | from './bento-grid' |  || ```jsx       |  |
|                  |  | |                    |  || <BentoGrid   |  |
|                  |  | | export function    |  ||   cols={3}   |  |
|                  |  | |   BentoGrid({      |  || />           |  |
|                  |  | |     cols = 3,      |  || ```          |  |
|                  |  | |     gap = "md",    |  ||              |  |
|                  |  | |   }) {             |  |+--------------+  |
|                  |  | |   return (...)     || PROPS          |  |
|                  |  | | }                  || PLAYGROUND     |  |
|                  |  | +--------------------+  |+--------------+  |
|                  |  | [Copy] [Open in Editor] || cols: [3  v] |  |
|                  |  +------------------------+|| gap:  [md v] |  |
|                  |                            || variant:     |  |
|                  |                            ||  [default v] |  |
|                  |                            || animated:    |  |
|                  |                            ||  [x] enabled |  |
|                  |                            || [Apply]      |  |
|                  |                            |+--------------+  |
+------------------------------------------------------------------+
```

**Key measurements:**
- Left pane: flexible (min 400px)
- Right pane: 380px fixed
- Drag handle between panes: 4px wide
- Preview area: ~50% of left pane height
- Code panel: ~50% of left pane height, max-h with scroll
- Viewport toggles: 3 icon buttons (375/768/1280)
- Theme toggles: 4 compact swatch buttons

---

## 4. Notes (`/notes` or `/notes/[slug]`)

**Layout:** Sidebar (264px) + Note sidebar (260px) + Editor (1fr, max 720px centered)

```
+------------------------------------------------------------------+
| SIDEBAR (264px)  | NOTE SIDEBAR   | EDITOR AREA                  |
|                  | (260px)        | (1fr, content max 720px)     |
| [Rail + Panel]   |                |                              |
|                  | [Search notes] | FLOATING TOOLBAR (on select)  |
| Dashboard        |                | +--[B][I][`][Link][H][-]--+ |
| Experiments      | + New Note     |                              |
| Notes*           |                | # Building a Bento Grid      |
| > All            | TODAY           |   System with CSS Grid       |
| > Favorites      | +------------+ |                              |
| > Tagged: CSS    | |Bento Grid  | | Published: Apr 8, 2026       |
| > Tagged: React  | |System*     | | Tags: [CSS] [Grid] [Layout] |
| Showroom         | |Apr 8, 14:32| | Linked: [Bento Grid Exp ->]  |
| Settings         | |CSS, Grid   | |                              |
|                  | +------------+ | ---                          |
|                  | +------------+ |                              |
|                  | |CSS Layers  | | CSS Grid has evolved into    |
|                  | |Deep Dive   | | one of the most powerful     |
|                  | |Apr 7, 09:15| | layout tools available...    |
|                  | +------------+ |                              |
|                  |                | ## The Problem               |
|                  | YESTERDAY      |                              |
|                  | +------------+ | Traditional grid layouts     |
|                  | |React 19    | | force equal-sized cells.     |
|                  | |Server Comp | | Bento grids break this       |
|                  | |Apr 6, 16:44| | pattern by allowing...       |
|                  | +------------+ |                              |
|                  | +------------+ | ```tsx                       |
|                  | |Framer      | | const BentoGrid = ({         |
|                  | |Motion Tips | |   children,                  |
|                  | |Apr 5, 11:20| |   cols = 3                   |
|                  | +------------+ | }) => (                      |
|                  |                |   <div className={cn(        |
|                  | EARLIER        |     "grid gap-4",            |
|                  | +------------+ |     `grid-cols-${cols}`      |
|                  | |Tailwind v4 | |   )}>                       |
|                  | |Migration   | |     {children}               |
|                  | |Apr 2       | |   </div>                    |
|                  | +------------+ | )                            |
|                  |                | ```                          |
|                  |                |                              |
|                  |                | /  <-- slash command cursor   |
|                  |                | +------------------------+   |
|                  |                | | Heading 1              |   |
|                  |                | | Heading 2              |   |
|                  |                | | Bullet List            |   |
|                  |                | | Code Block             |   |
|                  |                | | Image                  |   |
|                  |                | | Callout                |   |
|                  |                | +------------------------+   |
|                  |                |                              |
|                  |                | AUTOSAVE INDICATOR (top-right)|
|                  |                |            [check] Saved     |
+------------------------------------------------------------------+
```

**Key measurements:**
- Note sidebar: 260px fixed, scrollable list
- Editor content: max-width 720px centered in remaining space
- Note cards in sidebar: ~72px height (title + date + tags)
- Slash command menu: 240px wide, max 8 visible items
- Floating toolbar: appears above text selection, ~280px wide
- Autosave indicator: 12px icon + text, top-right corner

---

## 5. Showroom (`/showroom`)

**Layout:** Sidebar (264px) + Gallery area (1fr) + Preview panel (400px)

```
+------------------------------------------------------------------+
| SIDEBAR (264px)  |  GALLERY + PREVIEW                            |
|                  |                                                |
| [Rail + Panel]   |  HEADER BAR                                   |
|                  |  +------------------------------------------+ |
| Dashboard        |  | "Showroom"   [Presentation] [CMD+K] [FR] | |
| Experiments      |  +------------------------------------------+ |
| Notes            |                                                |
| Showroom*        |  THEME SELECTOR (4 visual swatches)            |
| > All            |  +--------+ +--------+ +--------+ +--------+ |
| > UI Components  |  |Minimal-| | Bento  | |Glass-  | |Cyber-  | |
| > Featured       |  | ist*   | |        | |morph.  | | punk   | |
| Settings         |  |[swatch]| |[swatch]| |[swatch]| |[swatch]| |
|                  |  +--------+ +--------+ +--------+ +--------+ |
|                  |                                                |
|                  |  GALLERY (2-col)         | PREVIEW (400px)    |
|                  |  +----------+----------+ | +--------------+   |
|                  |  |[Preview] |[Preview] | | |LIVE PREVIEW  |   |
|                  |  | 16:9     | 16:9     | | |              |   |
|                  |  |----------+----------| | | +----------+ |   |
|                  |  |Title     |Title     | | | |            | |   |
|                  |  |[Cat]     |[Cat]     | | | | [Selected  | |   |
|                  |  +----------+----------+ | | |  component | |   |
|                  |  |[Preview] |[Preview] | | | |  renders]  | |   |
|                  |  | 16:9     | 16:9     | | | |            | |   |
|                  |  |----------+----------| | | +----------+ |   |
|                  |  |Title     |Title     | | |              |   |
|                  |  |[Cat]     |[Cat]     | | | Viewport:    |   |
|                  |  +----------+----------+ | | [M] [T] [D]  |   |
|                  |  |[Preview] |[Preview] | | |              |   |
|                  |  | 16:9     | 16:9     | | +--------------+   |
|                  |  |----------+----------| | |DETAILS       |   |
|                  |  |Title     |Title     | | |              |   |
|                  |  |[Cat]     |[Cat]     | | | Bento Grid   |   |
|                  |  +----------+----------+ | | Component    |   |
|                  |                          | |              |   |
|                  |                          | | Category:    |   |
|                  |                          | | UI Components|   |
|                  |                          | |              |   |
|                  |                          | | Themes: 4/4  |   |
|                  |                          | |              |   |
|                  |                          | | [Theme       |   |
|                  |                          | |  Showdown]   |   |
|                  |                          | |              |   |
|                  |                          | | ```tsx       |   |
|                  |                          | | <BentoGrid   |   |
|                  |                          | |   cols={3}   |   |
|                  |                          | | />           |   |
|                  |                          | | ```          |   |
|                  |                          | |              |   |
|                  |                          | | +----------+ |   |
|                  |                          | | | REQUEST   | |   |
|                  |                          | | | THIS      | |   |
|                  |                          | | | FEATURE   | |   |
|                  |                          | | +----------+ |   |
|                  |                          | +--------------+   |
+------------------------------------------------------------------+
```

**Key measurements:**
- Gallery area: flexible (1fr), 2-col grid within
- Preview panel: 400px fixed, sticky (max-h: calc(100vh - header))
- Theme selector cards: ~25% each in 4-col row, 64px height
- Gallery cards: ~50% of gallery area width each
- Card thumbnail: 16:9 aspect ratio
- CTA button: full-width within preview panel, 48px height
- Theme Showdown button: secondary style, opens 2x2 grid modal
- Presentation mode: full-screen overlay, triggered from header

---

## Component Sizing Reference

| Component | Width | Height | Notes |
|-----------|-------|--------|-------|
| Sidebar rail | 64px | 100vh | Fixed left |
| Sidebar panel | 200px | 100vh | Fixed, collapsible |
| Bottom nav (mobile) | 100vw | 64px | Fixed bottom |
| Command palette | 640px | max 480px | Centered overlay |
| Stat card | 1fr (4-col) | 80px | Dashboard only |
| Experiment card | 1fr (3-col) | ~260px | 16:9 thumb + 80px body |
| Note card (sidebar) | 260px | ~72px | Title + meta |
| Button (primary) | auto | 48px (min) | Touch target compliant |
| Input field | 100% | 48px | Touch target compliant |
| Floating toolbar | ~280px | 40px | Above text selection |
| Slash command menu | 240px | max 320px | Below cursor |
| Toast notification | 360px | auto | Bottom-right |
| Breadcrumb bar | 100% | 32px | Below header |

---

## Spacing Scale (Tailwind v4, 4px base)

| Token | Value | Usage |
|-------|-------|-------|
| gap-2 | 8px | Between inline elements, icon+label |
| gap-3 | 12px | Between list items |
| gap-4 | 16px | Card grid gap (mobile), inner card padding |
| gap-5 | 20px | Card grid gap (tablet) |
| gap-6 | 24px | Card grid gap (desktop), section inner padding |
| gap-8 | 32px | Between major sections (mobile) |
| gap-10 | 40px | Between major sections (tablet) |
| gap-12 | 48px | Between major sections (desktop) |
| px-4 | 16px | Container padding (mobile) |
| px-6 | 24px | Container padding (tablet) |
| px-8 | 32px | Container padding (desktop) |
