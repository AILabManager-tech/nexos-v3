# SOIC-10 Tuteur IA — Benchmark Design EdTech / IA Tutorat

**Agent** : design-critic (NEXOS v3.0 Phase 0 Discovery)
**Date** : 2026-02-24
**Client** : Mark Systems (produit interne)
**Secteur** : EdTech / Intelligence Artificielle / Tutorat personnalise
**Audience** : Etudiants secondaire/cegep (14+), adultes autodidactes, parents
**Zone** : Quebec > Canada > International

---

## 1. Tendances Design EdTech 2025-2026

### 1.1 Palettes de couleurs dominantes

Le secteur EdTech converge autour de palettes qui communiquent **confiance**, **croissance** et **energie** :

| Fonction | Couleurs dominantes | Psychologie |
|----------|-------------------|-------------|
| **Primaire** | Bleu profond (#1E3A5F a #2563EB) | Confiance, stabilite, intelligence |
| **Secondaire** | Vert teal (#0D9488 a #14B8A6) | Croissance, succes, apprentissage |
| **Accent** | Violet (#7C3AED a #8B5CF6) | Creativite, innovation, IA |
| **Energie** | Orange/Ambre (#F59E0B a #FB923C) | Motivation, celebration, gamification |
| **Neutre** | Gris bleu (#64748B a #94A3B8) | Lisibilite, calme, professionnalisme |

**Tendance cle** : Les palettes "dopamine" (couleurs vives et saturees sur fonds sombres ou neutres) gagnent du terrain dans les apps educatives ciblant les adolescents et jeunes adultes. Elles activent les circuits de recompense visuelle sans verser dans l'infantile.

**Ratio recommande** : 60% couleur neutre/fond, 30% couleur primaire, 10% accent vif.

### 1.2 Typographies populaires

| Police | Categorie | Utilisateurs notables | Pertinence SOIC-10 |
|--------|-----------|----------------------|---------------------|
| **Inter** | Geometric sans-serif | Shadcn/ui, Vercel, tech moderne | Excellente lisibilite ecran, variable font |
| **Plus Jakarta Sans** | Geometric sans-serif | Apps modernes, SaaS | Hauteur de x elevee, clair et amical |
| **Lato** | Humanist sans-serif | Khan Academy | Accessible, chaud, professionnel |
| **CoFo Sans** | Neo-grotesque | Brilliant.org | Moderne, technique, premium |
| **Feather Bold** | Custom geometric | Duolingo | Ludique, audacieux (trop marque pour reutilisation) |
| **DM Sans** | Geometric sans-serif | Plateformes SaaS EdTech | Compact, professionnel |
| **Geist** | Neo-grotesque | Next.js / Vercel ecosystem | Optimise pour code + texte |

**Tendance** : Les polices geometriques sans-serif a hauteur de x elevee dominent. Elles offrent lisibilite maximale sur ecran, un ton moderne sans froideur, et fonctionnent en variable font pour performance web.

**Recommandation SOIC-10** : **Plus Jakarta Sans** en titres + **Inter** en corps. Alternative : **Geist** (mono + sans) pour coherence avec l'ecosysteme Next.js/Vercel.

### 1.3 Styles d'illustration

| Style | Tendance 2025-2026 | Exemples | Pertinence |
|-------|-------------------|----------|------------|
| **3D ludique** | En hausse forte | Apps education K-12, Duolingo | Engagement eleve, mais risque "enfantin" |
| **Flat geometrique** | Stable, mature | Khan Academy, plateformes SaaS | Professionnel, rapide a produire |
| **Semi-flat (2.5D)** | Tendance dominante | Brilliant.org, apps modernes | Equilibre ideal : profondeur sans lourdeur |
| **Hand-drawn** | Niche, authenticite | Notion, apps bien-etre | Chaleur, personnalite, mais non scalable |
| **Abstract geometrique** | En hausse | SaaS premium, apps IA | Moderne, intellectuel, polyvalent |
| **Tangram / Modulaire** | Emerging | Brilliant.org | Renforce identite "resolution de probleme" |

**Tendance cle** : Le **semi-flat avec touches de profondeur** (ombres douces, gradients subtils, formes geometriques) est le sweet spot pour une audience 14+ a adulte. Il evite l'infantilisme du full-3D tout en restant plus engageant que le flat pur.

**Recommandation SOIC-10** : Style **semi-flat geometrique** avec :
- Formes abstraites representant des concepts (neurones, connexions, graphes)
- Gradients subtils (bleu > violet) pour les elements visuels
- Illustrations vectorielles modulaires (pas de photos stock)

### 1.4 Dark mode vs Light mode

| Aspect | Light mode | Dark mode |
|--------|-----------|-----------|
| **Engagement educatif** | +15% vs dark en contexte apprentissage | Prefere pour sessions nocturnes |
| **Lisibilite texte long** | Superieure (contraste naturel) | Risque haloing chez utilisateurs astigmates |
| **Audience ados** | Percu comme "corporate" | Percu comme "cool" et moderne |
| **Audience adulte** | Prefere pour travail/etude | Prefere pour navigation detendue |
| **Accessibilite** | Plus inclusif par defaut | Necessaire pour photophobie/migraine |
| **Tendance 2025** | Defaut recommande pour EdTech | Obligatoire comme option |

**Consensus 2025-2026** : Le choix utilisateur est **non negociable**. La meilleure approche est :
- **Defaut** : Light mode (engagement educatif superieur)
- **Option** : Dark mode accessible (pas de noir pur #000, utiliser #0F172A ou #1E293B)
- **Detection** : Respecter `prefers-color-scheme` du systeme
- **Memoire** : Persister le choix de l'utilisateur

### 1.5 Micro-interactions et animations

| Pattern | Usage EdTech | Exemples |
|---------|-------------|----------|
| **Feedback reponse correcte** | Confetti subtil, checkmark anime, pulse vert | Duolingo, Brilliant |
| **Feedback reponse incorrecte** | Shake leger, highlight rouge doux, explication | Khan Academy |
| **Progression** | Barre de progression fluide, XP counter anime | Duolingo, Synthesis |
| **Streak / Serie** | Flamme animee, compteur jour, celebration milestone | Duolingo |
| **Loading / Streaming IA** | Typing indicator 3 dots, typewriter effect | ChatGPT, Claude |
| **Transition pages** | Fade + slide subtil, skeleton loading | Toutes les apps modernes |
| **Hover / Focus** | Scale 1.02, shadow elevation, border glow | Standard UI |
| **Celebration** | Confetti, star burst, level-up animation | Gamification apps |

**Principe directeur** : Chaque micro-interaction doit **informer** ou **recompenser**, jamais simplement decorer. Respecter `prefers-reduced-motion` obligatoirement (accessibilite + stack NEXOS).

---

## 2. Branding des Leaders

### 2.1 Khan Academy

| Element | Detail |
|---------|--------|
| **Mission** | Education gratuite, de classe mondiale, pour tous |
| **Couleurs primaires** | Khan Blue (#0A2A66), Teal (#148F96) |
| **Couleurs secondaires** | Vert (#9CB443), Gris fonce (#242F3A) |
| **Typographie** | Lato (corps), Chalky (display/annotations — custom) |
| **Design system** | Wonder Blocks (open-source) |
| **Ton** | Chaleureux, accessible, bienveillant, jamais condescendant |
| **Illustrations** | Flat geometrique, couleurs vives, personnages diversifies |
| **Forces** | Accessibilite exemplaire, design system mature, ton inclusif |
| **Faiblesses** | Visuellement "institutionnel", moins attractif pour ados |

**Lecon pour SOIC-10** : Le ton bienveillant et l'accessibilite de Khan Academy sont un modele. Mais le design est percu comme "scolaire" — SOIC-10 peut se differencier avec un look plus moderne et dynamique.

### 2.2 Duolingo

| Element | Detail |
|---------|--------|
| **Mission** | Rendre l'education amusante et accessible |
| **Couleur primaire** | Feather Green (#58CC02), Mask Green (#89E219) |
| **Accents** | Orange bec, Jaune bec, Bleu nuit (fond) |
| **Typographie** | Feather Bold (custom, geometric, chunky) |
| **Mascotte** | Duo (hibou vert) — icone culturelle virale |
| **Ton** | Ludique, provocateur, humoristique, parfois agressif (streak guilt) |
| **Illustrations** | Geometriques, construites a partir de cercles/carres/quarts |
| **Gamification** | Streaks, XP, ligues, leaderboards, coeurs, gemmes |
| **Forces** | Branding iconique, engagement massif, gamification ultime |
| **Faiblesses** | Trop ludique pour un tuteur serieux, "guilt tripping" controverse |

**Lecon pour SOIC-10** : Emprunter la gamification **moderee** (streaks, progression, celebration) sans l'aspect "guilt trip". Le style visuel est trop marque/ludique pour un tuteur IA serieux — ne pas copier, mais s'inspirer de l'engagement.

### 2.3 Synthesis (synthesis.com)

| Element | Detail |
|---------|--------|
| **Mission** | "The world's first superhuman math tutor" |
| **Positionnement** | Premium, innovation, origine SpaceX/Elon Musk |
| **Style** | Minimaliste, dark-leaning, haute technologie |
| **Cible** | Enfants 5-11 ans (K-5 math) |
| **Approche** | Multisensoriel, interactif, IA adaptative |
| **Gamification** | XP, progression, recompenses visuelles |
| **Forces** | Perception "elite", technologie de pointe, UX fluide |
| **Faiblesses** | Niche tres etroite (K-5 math), prix eleve, peu francophone |

**Lecon pour SOIC-10** : Le positionnement "superhuman tutor" est inspirant. SOIC-10 peut viser une esthetique premium similaire mais pour un public plus large (14+ a adulte) et multi-matieres. Le dark mode de Synthesis fonctionne car leur audience est jeune et tech-native.

### 2.4 Brilliant.org

| Element | Detail |
|---------|--------|
| **Mission** | "Learn by doing" — apprentissage interactif |
| **Brand refresh** | Collaboration avec Koto (2024) |
| **Couleurs** | Palette "pear" (vert-jaune vif), fond sombre, accents lumineux |
| **Typographie** | CoFo Robert (titres), CoFo Sans (produit) — Contrast Foundry |
| **Illustrations** | Tangram / modulaire, animations Rive interactives |
| **Style** | Moderne, intellectuel, premium, "smart but fun" |
| **Forces** | Visualisations interactives exceptionnelles, brand refresh reussi |
| **Faiblesses** | Percu comme "elitiste" par certains, courbe d'apprentissage UX |

**Lecon pour SOIC-10** : Le style **"smart but fun"** de Brilliant est le positionnement ideal pour SOIC-10. Leur utilisation d'animations interactives (Rive) pour expliquer des concepts est directement pertinente. La palette plus claire et dynamique du refresh 2024 montre que meme les plateformes "serieuses" bougent vers plus de chaleur.

---

## 3. Design Patterns Chat IA

### 3.1 Bulles de conversation

| Pattern | Recommandation |
|---------|---------------|
| **Layout** | Bulles alignees gauche (IA) / droite (utilisateur) |
| **Couleur IA** | Fond neutre clair (gris #F1F5F9) ou teinte primaire legere (#EFF6FF) |
| **Couleur utilisateur** | Fond primaire (#2563EB) avec texte blanc, ou teinte plus foncee |
| **Border radius** | 12-16px, coin inferieur plat cote emetteur |
| **Espacement** | 8-12px entre bulles, 16-24px entre groupes d'emetteurs differents |
| **Max-width** | 70-80% de la largeur du conteneur |
| **Typographie** | Corps 15-16px, line-height 1.5-1.6 pour lisibilite |

**Tendance 2025** : Les "AI Assistant Cards" emergent comme alternative aux bulles classiques. Au lieu du simple chat, les reponses IA sont presentees dans des cartes structurees avec sections (explication, code, exercice) visuellement delimitees.

**Recommandation SOIC-10** : Adopter un **hybride bulle + carte**. Les messages courts restent en bulle ; les reponses structurees du tuteur (diagnostic, explication, exercice) sont en cartes avec sections collapsibles et headers colores.

### 3.2 Typing indicators et streaming

| Pattern | Detail | Recommandation |
|---------|--------|---------------|
| **3 dots animaux** | Classique, universel | Base — afficher pendant latence pre-stream |
| **Skeleton loading** | Blocs gris animes | Pour les reponses structurees (cartes) |
| **Typewriter effect** | Texte qui apparait caractere par caractere | 200 chars/sec (~5ms/char) — utilise par Anthropic |
| **Token streaming** | Mots apparaissent par chunks | Plus naturel, standard pour LLM |
| **Indicateur "pense..."** | Texte contextuel ("Le tuteur analyse ta reponse...") | Recommande pour SOIC-10 — humanise l'attente |

**Recommandation SOIC-10** : Combiner :
1. Indicateur contextuel francais ("Je reflechis a ta question...", "Je prepare un exercice...")
2. Streaming token-by-token pour le contenu
3. Transition smooth vers le rendu final (markdown > HTML)

### 3.3 Code blocks et formules mathematiques

| Element | Technologie | Detail |
|---------|------------|--------|
| **Code** | Shiki ou Prism.js | Syntax highlighting avec theme adapte (light/dark) |
| **Copie code** | Bouton "Copier" en haut-droite | Feedback visuel "Copie!" pendant 2s |
| **Math inline** | KaTeX | Plus rapide que MathJax, rendu cote client |
| **Math block** | KaTeX display mode | Centre, plus grand, avec scroll horizontal si debordement |
| **Markdown** | react-markdown + remark-math + rehype-katex | Pipeline standard |
| **Diagrammes** | Mermaid.js (optionnel) | Pour les schemas conceptuels |

**Recommandation SOIC-10** : Pipeline de rendu :
```
LLM output (markdown) → react-markdown → remark-math → rehype-katex → Shiki (code)
```

### 3.4 Feedback visuel pedagogique

| Type | Pattern visuel | Detail |
|------|---------------|--------|
| **Correct** | Checkmark anime + pulse vert (#10B981) | Celebration proportionnelle a la difficulte |
| **Incorrect** | Shake leger + highlight orange (#F59E0B) | Jamais rouge agressif — encourageant |
| **Indice** | Icone ampoule + slide-in | Disclosure progressive (indice 1, 2, 3) |
| **Progression** | Barre horizontale animee + pourcentage | Visible en permanence dans la session |
| **Diagnostic** | Jauge radiale animee + niveaux | Visualisation du niveau detecte |
| **Celebration session** | Confetti subtil + resume stats | En fin de session, XP gagnes, concepts maitrises |

**Principe SOIC-10** : Le feedback utilise **l'orange/ambre** pour l'erreur (pas le rouge — moins punitif, plus "essaie encore") et le **vert** pour le succes. Le mode socratique implique que le feedback est toujours **constructif et guidant**.

---

## 4. Recommandations pour SOIC-10

### 4.1 Palette de couleurs proposee

#### Option A — "Aube Nordique" (Recommandee)
Inspiree du paysage quebecois : bleu profond (confiance, hiver), teal (forets, croissance), accents chauds (aurores boreales).

```
LIGHT MODE:
  --background:        #FAFBFD    (blanc bleuté)
  --foreground:        #0F172A    (presque noir, encre)
  --card:              #FFFFFF
  --card-foreground:   #1E293B

  --primary:           #1D4ED8    (bleu royal — confiance, intelligence)
  --primary-foreground:#FFFFFF
  --primary-hover:     #2563EB
  --primary-muted:     #DBEAFE    (bleu tres clair, fond highlight)

  --secondary:         #0D9488    (teal — croissance, succes)
  --secondary-foreground:#FFFFFF
  --secondary-hover:   #14B8A6
  --secondary-muted:   #CCFBF1    (teal tres clair)

  --accent:            #7C3AED    (violet — creativite, IA)
  --accent-foreground: #FFFFFF
  --accent-hover:      #8B5CF6
  --accent-muted:      #EDE9FE    (violet tres clair)

  --success:           #10B981    (vert emeraude — correct, progression)
  --success-foreground:#FFFFFF
  --success-muted:     #D1FAE5

  --warning:           #F59E0B    (ambre — erreur douce, "essaie encore")
  --warning-foreground:#1E293B
  --warning-muted:     #FEF3C7

  --error:             #EF4444    (rouge — erreurs systeme uniquement, pas pedagogique)
  --error-foreground:  #FFFFFF
  --error-muted:       #FEE2E2

  --muted:             #F1F5F9    (gris bleuté, fond secondaire)
  --muted-foreground:  #64748B    (gris, texte secondaire)

  --border:            #E2E8F0
  --ring:              #1D4ED8    (focus ring = primaire)

DARK MODE:
  --background:        #0F172A    (bleu nuit profond — PAS noir pur)
  --foreground:        #F1F5F9    (blanc cassé)
  --card:              #1E293B
  --card-foreground:   #E2E8F0

  --primary:           #3B82F6    (bleu plus lumineux en dark)
  --primary-foreground:#FFFFFF
  --primary-muted:     #1E3A5F

  --secondary:         #14B8A6
  --secondary-muted:   #134E4A

  --accent:            #8B5CF6
  --accent-muted:      #3B1F7A

  --success:           #34D399
  --warning:           #FBBF24
  --error:             #F87171

  --muted:             #1E293B
  --muted-foreground:  #94A3B8
  --border:            #334155
  --ring:              #3B82F6
```

**Rationale** :
- Le **bleu royal** comme primaire communique intelligence et confiance — essentiel pour un tuteur IA
- Le **teal** comme secondaire evoque la croissance et l'apprentissage — differentiation vs les "bleu pure" corporate
- Le **violet** en accent renforce le positionnement "intelligence artificielle" et "creativite"
- L'**ambre** pour le feedback d'erreur pedagogique est deliberement non-punitif (vs rouge)
- Le dark mode utilise un **bleu nuit** (#0F172A) au lieu du noir pur — plus chaleureux, moins fatiguant

#### Option B — "Aurore Boreale" (Alternative)
Plus audacieuse, gradient violet-bleu dominant, pour un positionnement plus "tech/IA".

```
  --primary:           #6366F1    (indigo)
  --secondary:         #06B6D4    (cyan)
  --accent:            #EC4899    (rose vif)
```

### 4.2 Style visuel recommande

**Positionnement** : "Smart but Approachable" — inspire de Brilliant.org mais avec la chaleur de Khan Academy.

| Dimension | Choix | Justification |
|-----------|-------|---------------|
| **Ton general** | Minimaliste + touches creatives | Pas enfantin, pas corporate froid |
| **Illustrations** | Semi-flat geometrique + gradients subtils | Age-agnostique : engage les 14 ans ET les adultes |
| **Iconographie** | Lucide React (coherent stack NEXOS) + Phosphor pour variantes | Poids multiples, lisibles a toute taille |
| **Photos** | Aucune photo stock | Illustrations vectorielles uniquement — plus universel |
| **Formes** | Coins arrondis (12-16px), cartes elevees (shadow-md) | Approchable, moderne |
| **Espacement** | Genereux (padding 24-32px, gap 16-24px) | Respiration visuelle, lisibilite |
| **Densite** | Moyenne-faible | Education =/= surcharge cognitive |
| **Identite quebecoise** | Vocabulaire UX en francais, ton tuteur chaleureux | "Bravo!" pas "Correct!", "On revoit ca?" pas "Wrong" |

### 4.3 Systeme d'icones recommande

**Primaire : Lucide React** (coherent avec le stack NEXOS)
- 1400+ icones, trait fin (1.5-2px), MIT license
- Parfaitement integre a shadcn/ui et Tailwind
- `npm install lucide-react` — tree-shakeable

**Complement : Phosphor Icons** (pour les cas specifiques)
- 6 poids (thin, light, regular, bold, fill, duotone)
- Ideal pour creer de la hierarchie visuelle (ex: sidebar = regular, highlight = bold)
- `npm install @phosphor-icons/react`

**Icones personnalisees** (a creer) :
- Mascotte/avatar du tuteur IA (ni hibou, ni robot — un symbole abstrait "neurone/connexion")
- Icones matiere (maths, sciences, francais, etc.) en style coherent
- Badge de progression / niveau

### 4.4 Motion design guidelines

```
PRINCIPES :
1. Purpose-driven — chaque animation a une raison (feedback, orientation, celebration)
2. Subtile par defaut — amplitude faible, duree courte
3. Accessible — @media (prefers-reduced-motion: reduce) { transition: none }
4. Coherente — memes courbes d'acceleration partout

SPECIFICATIONS :
  --duration-fast:     150ms    (hover, focus, toggle)
  --duration-normal:   250ms    (transitions, slide-in)
  --duration-slow:     400ms    (celebrations, modals)
  --duration-stream:   5ms/char (typewriter streaming)

  --ease-out:          cubic-bezier(0.16, 1, 0.3, 1)    (entrees, apparitions)
  --ease-in-out:       cubic-bezier(0.45, 0, 0.55, 1)   (transitions internes)
  --spring:            spring(1, 100, 10, 0)             (celebrations, Framer Motion)

ANIMATIONS CLÉS :
  Chat bubble entree :   fade-in + slide-up 8px, 250ms, ease-out
  Typing indicator :     3 dots pulse opacity 0.4→1, 600ms loop, stagger 150ms
  Streaming text :       opacity 0→1 par token, 80ms
  Correct feedback :     scale 0.8→1.05→1, 400ms, spring + checkmark draw
  Incorrect feedback :   translateX ±4px, 200ms, 2 cycles (shake)
  Progression bar :      width transition 600ms ease-in-out
  Card expand :          height auto + fade content, 300ms ease-out
  Page transition :      fade 200ms (layout transition via Next.js)
  Celebration confetti : 30 particles, gravity, 1.5s duration, on milestone

FRAMEWORK : Framer Motion (motion/react)
  - layout prop pour les transitions de layout
  - AnimatePresence pour les entrees/sorties
  - useReducedMotion() hook pour accessibilite
```

### 4.5 Theme adaptatif (clair/sombre)

**Implementation technique** :

```tsx
// Approach recommandee : next-themes + Tailwind CSS
// 1. Provider dans layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>

// 2. Variables CSS dans globals.css (voir palette 4.1)
// 3. Tailwind config : darkMode: "class"
// 4. Composant toggle dans le header
```

**Regles de transition** :
- Transition globale `color-scheme` de 200ms sur le `<html>`
- Pas de flash au chargement (next-themes gere le script inline)
- Persister le choix en localStorage
- Respecter `prefers-color-scheme` comme defaut systeme

**Adaptations specifiques dark mode** :
- Images/illustrations : ajouter un overlay subtil ou versions dedicees
- Shadows : remplacer par des `border` subtils en dark (les ombres sont invisibles sur fond sombre)
- Couleurs primaires/accent : augmenter legerement la luminosite (+10-15% lightness)
- Code blocks : theme sombre dedie (ex: One Dark Pro, Tokyo Night)
- Formules KaTeX : couleur texte adaptee automatiquement

---

## 5. Synthese concurrentielle visuelle

| Critere | Khan Academy | Duolingo | Synthesis | Brilliant.org | **SOIC-10 (cible)** |
|---------|-------------|----------|-----------|---------------|---------------------|
| **Ton** | Bienveillant, institutionnel | Ludique, provocateur | Premium, elite | Intellectuel, moderne | **Smart + chaleureux** |
| **Audience** | Tous ages | Tous ages | 5-11 ans | Adultes curieux | **14+ a adulte** |
| **Couleur dominante** | Bleu/Teal | Vert vif | Dark/Premium | Pear/Sombre | **Bleu royal + Teal** |
| **Dark mode** | Non | Non | Partiel | Oui | **Oui (system-aware)** |
| **Gamification** | Legere (badges) | Maximale | Moderee | Legere (streaks) | **Moderee (streaks, XP, badges)** |
| **Chat IA** | Khanmigo (integre) | Non | Integre | Non | **Coeur du produit** |
| **Illustrations** | Flat colore | Geometric custom | Minimal | Tangram/Rive | **Semi-flat geometric** |
| **Typo** | Lato | Feather (custom) | System | CoFo Sans | **Plus Jakarta + Inter** |
| **Francophone** | Oui (traduit) | Oui (app) | Non | Non | **Natif FR/EN** |

---

## 6. Differenciation SOIC-10

### Ce que SOIC-10 emprunte aux leaders :
- **De Khan Academy** : Ton bienveillant, accessibilite, mode socratique
- **De Duolingo** : Gamification moderee (streaks, XP), celebration des progres
- **De Synthesis** : Positionnement "superhuman tutor", qualite premium
- **De Brilliant** : Style "smart but fun", animations interactives, design moderne

### Ce qui differencie SOIC-10 :
1. **Natif francophone** — Aucun concurrent serieux en francais natif au Quebec
2. **Multi-matieres** — Pas limite a un seul domaine (vs Synthesis = math K-5)
3. **Audience 14+ a adulte** — Creneau sous-servi (entre K-12 et formation pro)
4. **Mode socratique enforce** — Jamais de reponse directe, toujours du guidage
5. **Theme adaptatif** — Light/dark natif, choix utilisateur
6. **Open-source stack** — Next.js/Vercel, pas de lock-in technologique
7. **Conformite Loi 25** — Integree nativement, avantage reglementaire Quebec

---

## 7. Livrables design recommandes pour Phase 1

| Livrable | Priorite | Detail |
|----------|----------|--------|
| Design tokens (CSS variables) | P0 | Palette complete light/dark (section 4.1) |
| Composant avatar tuteur IA | P0 | Symbole abstrait "neurone/connexion", pas de mascotte anthropomorphe |
| Chat UI kit | P0 | Bulles, cartes, streaming, feedback |
| Systeme de badges/progression | P1 | Icones, barre XP, streaks |
| Illustration set | P1 | 6-8 illustrations hero semi-flat (landing, matieres, celebration) |
| Theme toggle composant | P1 | Switch light/dark avec transition |
| Motion tokens (Framer) | P1 | Presets animation (section 4.4) |
| Figma/design kit | P2 | Composants pour iteration future |

---

## Sources

- [Top 11 Education App Design Trends 2025 - Lollypop](https://lollypop.design/blog/2025/august/top-education-app-design-trends-2025/)
- [EdTech Design Trends 2025 - Adam Fard](https://adamfard.com/blog/edtech-design-trends)
- [7 Trends in EdTech Product Design 2026 - Backpack Interactive](https://backpackinteractive.com/resources/articles/edtech-product-trends-2026)
- [EdTech 2026: Convergence of Design, Data, and Learning - Medium](https://medium.com/@webzininfotech15/edtech-2026-the-convergence-of-design-data-and-learning-fb1e422ec34b)
- [UX for AI Chatbots: Complete Guide 2026 - Parallel](https://www.parallelhq.com/blog/ux-ai-chatbots)
- [Design Patterns for AI Interfaces - Smashing Magazine](https://www.smashingmagazine.com/2025/07/design-patterns-ai-interfaces/)
- [Chat UI Design Trends 2025 - MultitaskAI](https://multitaskai.com/blog/chat-ui-design/)
- [AI UI Patterns - Patterns.dev](https://www.patterns.dev/react/ai-ui-patterns/)
- [Khan Academy Brand Identity](https://brand.khanacademy.org/)
- [Khan Academy Brand Color Codes - BrandColorCode](https://www.brandcolorcode.com/khan-academy)
- [Wonder Blocks: Khan Academy's Design System](https://www.designsystems.com/about-wonder-blocks-khan-academys-design-system-and-the-story-behind-it/)
- [Duolingo Brand Guidelines](https://design.duolingo.com/)
- [Duolingo Brand Breakdown - Canny Creative](https://www.canny-creative.com/brand-breakdown/brand/duolingo-a-brand-breakdown/)
- [Brilliant Brand Refresh - Peter Cho / Medium](https://pcho.medium.com/a-brilliant-brand-refresh-4af021c11486)
- [How Brilliant.org Motivates Learners with Rive Animations](https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations)
- [Synthesis Tutor Review - Unite.AI](https://www.unite.ai/synthesis-tutor-review/)
- [Dark Mode vs Light Mode UX Guide 2025 - AlterSquare](https://altersquare.medium.com/dark-mode-vs-light-mode-the-complete-ux-guide-for-2025-5cbdaf4e5366)
- [Dark Mode & Dopamine Colors: Education UI/UX - ColorWhistle](https://colorwhistle.com/dark-mode-dopamine-education-design/)
- [Inclusive Dark Mode - Smashing Magazine](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/)
- [EdTech UI Design Color Palettes - Octet Design Labs](https://octet.design/colors/user-interfaces/edtech-ui-design/)
- [Color Psychology for Education Web Design - Progress](https://www.progress.com/blogs/using-color-psychology-education-web-design)
- [Gamification in Product Design 2025 - Arounda](https://arounda.agency/blog/gamification-in-product-design-in-2024-ui-ux)
- [Illustration Trends 2025 - Fire Art](https://fireart.studio/blog/illustration-trends/)
- [Comparing Icon Libraries for shadcn/ui - ShadcnDesign](https://www.shadcndesign.com/blog/comparing-icon-libraries-shadcn-ui)
- [Top 10 Icon Libraries for Next.js 2025](https://embarkingonvoyage.com/blog/technologies/top-10-icon-libraries/)
- [Plus Jakarta Sans - Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [Smooth Text Streaming in AI SDK - Upstash](https://upstash.com/blog/smooth-streaming)
- [Best 20 Chatbot UIs 2026 - Jotform](https://www.jotform.com/ai/agents/best-chatbot-ui/)
- [Chatbot UI Examples - Sendbird](https://sendbird.com/blog/chatbot-ui)
- [15 Best EdTech Website Design Examples 2025 - Webstacks](https://www.webstacks.com/blog/edtech-websites)

---

*Rapport genere par l'agent design-critic de NEXOS v3.0 Phase 0 Discovery*
*Projet : SOIC-10 Tuteur IA — Mark Systems inc.*
*Date : 2026-02-24*
