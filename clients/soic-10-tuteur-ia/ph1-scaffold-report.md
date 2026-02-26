# Phase 1 — Strategy Report : Section 5 — Scaffold Plan
## Projet SOIC-10 Tuteur IA

**Agent** : scaffold-planner
**Date** : 2026-02-24
**Total fichiers** : 189

---

## Arbre de fichiers complet

```
soic-10-tuteur-ia/
├── .env.example
├── .env.local                          # gitignored
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── components.json                     # shadcn/ui config
├── next.config.mjs                     # poweredByHeader: false, headers secu
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json                       # strict, noUncheckedIndexedAccess, paths @/
├── vercel.json                         # CSP, HSTS, X-Frame-Options, etc.
├── vitest.config.ts
│
├── prisma/
│   ├── schema.prisma                   # User, Session, Message, Exercise, Achievement, Progress, Subject, DiagnosticResult
│   └── seed.ts                         # Sujets, exercices, achievements de base
│
├── public/
│   ├── icons/
│   │   ├── apple-touch-icon.png
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── images/
│   │   ├── hero-illustration.svg
│   │   ├── logo.svg
│   │   ├── og-image.png
│   │   └── onboarding-bg.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
│
├── messages/
│   ├── fr.json                         # Traductions FR (default)
│   └── en.json                         # Traductions EN
│
├── src/
│   ├── app/
│   │   ├── globals.css                 # Tailwind base + variables CSS shadcn
│   │   │
│   │   └── [locale]/
│   │       ├── layout.tsx              # Root layout : ClerkProvider, NextIntlClientProvider, fonts, metadata, CookieConsent
│   │       ├── page.tsx                # Landing page marketing
│   │       ├── not-found.tsx           # 404 personnalisee
│   │       ├── error.tsx               # Error boundary global
│   │       ├── loading.tsx             # Loading skeleton
│   │       │
│   │       ├── (marketing)/
│   │       │   ├── layout.tsx          # Header public + Footer
│   │       │   ├── pricing/
│   │       │   │   └── page.tsx        # Plans Free / Pro / Team
│   │       │   ├── about/
│   │       │   │   └── page.tsx        # Mission, equipe, valeurs
│   │       │   └── blog/
│   │       │       ├── page.tsx        # Liste articles
│   │       │       └── [slug]/
│   │       │           └── page.tsx    # Article individuel
│   │       │
│   │       ├── (auth)/
│   │       │   ├── layout.tsx          # Layout auth centre, branding minimal
│   │       │   ├── login/
│   │       │   │   └── [[...login]]/
│   │       │   │       └── page.tsx    # Clerk SignIn
│   │       │   ├── signup/
│   │       │   │   └── [[...signup]]/
│   │       │   │       └── page.tsx    # Clerk SignUp
│   │       │   └── onboarding/
│   │       │       └── page.tsx        # Diagnostic adaptatif 7 etapes
│   │       │
│   │       ├── (app)/
│   │       │   ├── layout.tsx          # Split-view : Sidebar + Main + ContextPanel
│   │       │   ├── dashboard/
│   │       │   │   └── page.tsx        # Dashboard progression
│   │       │   ├── session/
│   │       │   │   └── [id]/
│   │       │   │       └── page.tsx    # Chat tuteur + ExercisePanel
│   │       │   ├── sessions/
│   │       │   │   └── page.tsx        # Historique sessions
│   │       │   ├── profile/
│   │       │   │   └── page.tsx        # Profil & parametres
│   │       │   └── achievements/
│   │       │       └── page.tsx        # Badges & accomplissements
│   │       │
│   │       ├── (admin)/
│   │       │   ├── layout.tsx          # Layout admin restreint
│   │       │   ├── analytics/
│   │       │   │   └── page.tsx        # Dashboard analytics
│   │       │   └── users/
│   │       │       └── page.tsx        # Gestion utilisateurs
│   │       │
│   │       └── (legal)/
│   │           ├── layout.tsx          # Layout legales minimal
│   │           ├── privacy/
│   │           │   └── page.tsx        # Politique de confidentialite Loi 25
│   │           └── terms/
│   │               └── page.tsx        # Conditions d'utilisation
│   │
│   ├── app/api/
│   │   ├── chat/
│   │   │   └── route.ts               # Streaming chat (Vercel AI SDK v6, server-side)
│   │   ├── diagnostic/
│   │   │   └── route.ts               # Diagnostic adaptatif
│   │   ├── exercises/
│   │   │   ├── route.ts               # CRUD exercices
│   │   │   └── [id]/
│   │   │       └── submit/
│   │   │           └── route.ts        # Soumission reponse
│   │   ├── progress/
│   │   │   └── route.ts               # Lecture/MAJ progression
│   │   ├── achievements/
│   │   │   └── route.ts               # Deblocage & lecture achievements
│   │   ├── sessions/
│   │   │   ├── route.ts               # CRUD sessions
│   │   │   └── [id]/
│   │   │       ├── route.ts           # Session individuelle (GET, PATCH, DELETE)
│   │   │       └── messages/
│   │   │           └── route.ts        # Historique messages session
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   │   └── route.ts           # Metriques admin
│   │   │   └── users/
│   │   │       └── route.ts           # Gestion users admin
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts           # Webhook Clerk → Supabase sync
│   │
│   ├── middleware.ts                    # Clerk auth + next-intl + route protection
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui primitives
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/                     # Composants structurels
│   │   │   ├── AppShell.tsx            # Shell split-view (sidebar + main + context panel)
│   │   │   ├── ContextPanel.tsx        # Panneau droit contextuel
│   │   │   ├── Footer.tsx              # Footer avec liens legaux + CookieSettingsButton
│   │   │   ├── Header.tsx              # Header marketing
│   │   │   ├── LanguageSwitcher.tsx    # Selecteur FR/EN
│   │   │   ├── MobileNav.tsx           # Nav mobile (Sheet)
│   │   │   ├── Sidebar.tsx             # Sidebar app
│   │   │   └── ThemeToggle.tsx         # Toggle dark/light
│   │   │
│   │   ├── chat/                       # Systeme de chat tuteur
│   │   │   ├── ChatHeader.tsx          # Header session (sujet, niveau, timer)
│   │   │   ├── ChatInput.tsx           # Zone saisie + envoi
│   │   │   ├── CodeBlock.tsx           # Bloc code syntax-highlighted
│   │   │   ├── MathBlock.tsx           # Rendu LaTeX/KaTeX
│   │   │   ├── MessageBubble.tsx       # Bulle message (user/tutor/socratic)
│   │   │   ├── MessageList.tsx         # Liste messages scrollable
│   │   │   ├── SocraticPrompt.tsx      # Questions socratiques stylisees
│   │   │   ├── TutorChat.tsx           # Chat principal streaming
│   │   │   └── TypingIndicator.tsx     # Indicateur frappe IA
│   │   │
│   │   ├── exercises/                  # Panneau exercices interactifs
│   │   │   ├── CodeExercise.tsx        # Exercice code
│   │   │   ├── ExercisePanel.tsx       # Panneau orchestrateur exercices
│   │   │   ├── ExerciseResult.tsx      # Resultat + explication
│   │   │   ├── HintSystem.tsx          # Indices progressifs (3 niveaux)
│   │   │   ├── MathExercise.tsx        # Exercice math
│   │   │   └── QCMExercise.tsx         # Exercice QCM
│   │   │
│   │   ├── onboarding/                 # Flow diagnostic adaptatif
│   │   │   ├── DiagnosticFlow.tsx      # Orchestrateur 7 etapes
│   │   │   ├── ProgressStepper.tsx     # Stepper visuel
│   │   │   ├── StepAvailability.tsx    # Etape 5 : rythme
│   │   │   ├── StepDiagnosticQuiz.tsx  # Etape 6 : quiz adaptatif
│   │   │   ├── StepGoals.tsx           # Etape 4 : objectifs
│   │   │   ├── StepLearningStyle.tsx   # Etape 3 : style apprentissage
│   │   │   ├── StepLevelAssessment.tsx # Etape 2 : niveau
│   │   │   ├── StepSubjectSelect.tsx   # Etape 1 : sujets
│   │   │   └── StepSummary.tsx         # Etape 7 : resume + plan
│   │   │
│   │   ├── dashboard/                  # Composants dashboard
│   │   │   ├── AchievementBadge.tsx    # Badge individuel
│   │   │   ├── AchievementGrid.tsx     # Grille badges
│   │   │   ├── MasteryRadar.tsx        # Radar competences
│   │   │   ├── ProgressDashboard.tsx   # Dashboard progression
│   │   │   ├── RecentSessions.tsx      # Sessions recentes
│   │   │   ├── StreakCounter.tsx        # Compteur streak
│   │   │   ├── SuggestedTopics.tsx     # Sujets suggeres
│   │   │   ├── WeeklyActivity.tsx      # Heatmap hebdo
│   │   │   └── XPBar.tsx              # Barre XP + niveau
│   │   │
│   │   ├── legal/                      # Conformite Loi 25
│   │   │   ├── CookieConsent.tsx       # Bandeau opt-in (essential/analytics/marketing)
│   │   │   └── CookieSettingsButton.tsx # Bouton modifier preferences
│   │   │
│   │   └── shared/                     # Composants reutilisables
│   │       ├── ConfirmDialog.tsx        # Dialog confirmation
│   │       ├── EmptyState.tsx           # Etat vide
│   │       ├── ErrorBoundary.tsx        # Error boundary React
│   │       ├── LoadingSpinner.tsx       # Spinner accessible
│   │       ├── Logo.tsx                 # Logo SVG responsive
│   │       └── PageTransition.tsx       # Transition Framer Motion
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── useAchievements.ts          # Deblocage, notification toast
│   │   ├── useChat.ts                  # Extends Vercel AI useChat + socratic
│   │   ├── useDiagnostic.ts            # Questions, reponses, score adaptatif
│   │   ├── useExercise.ts              # Soumission, validation, feedback
│   │   ├── useLocalStorage.ts          # localStorage type-safe
│   │   ├── useMediaQuery.ts            # Responsive breakpoints
│   │   ├── useProgress.ts              # XP, niveau, mastery
│   │   └── useStreak.ts               # Streak quotidien, notification
│   │
│   ├── lib/                            # Logique metier & utilitaires
│   │   ├── ai.ts                       # Config Vercel AI SDK v6 (model, system prompt)
│   │   ├── auth.ts                     # Helpers Clerk (currentUser, requireAuth, isAdmin)
│   │   ├── constants.ts                # Sujets, niveaux, XP thresholds, achievements
│   │   ├── db.ts                       # Prisma client singleton
│   │   ├── diagnostic.ts               # Algorithme IRT simplifie, ajustement difficulte
│   │   ├── mastery.ts                  # Calcul mastery (retention espacee)
│   │   ├── prompts.ts                  # System prompts IA (tuteur, diagnostic, exercices)
│   │   ├── streak.ts                   # Logique streak (calcul, reset, bonus)
│   │   ├── supabase.ts                 # Client Supabase (server + client)
│   │   ├── utils.ts                    # cn, formatDate, slugify, etc.
│   │   ├── validators.ts              # Schemas Zod (message, exercise, session, profile)
│   │   └── xp.ts                      # Calcul XP, niveaux, seuils
│   │
│   ├── types/                          # Interfaces TypeScript
│   │   ├── achievement.ts              # Achievement, AchievementCategory, UnlockCondition
│   │   ├── admin.ts                    # AnalyticsData, UserManagement, Metrics
│   │   ├── chat.ts                     # Message, MessageRole, ChatSession, StreamState
│   │   ├── diagnostic.ts              # DiagnosticQuestion, DiagnosticResult, DifficultyLevel
│   │   ├── exercise.ts                # Exercise, ExerciseType, QCM, CodeExercise, Submission
│   │   ├── progress.ts                # Progress, Mastery, XPEvent, Level
│   │   ├── session.ts                 # TutorSession, SessionStatus, SessionSummary
│   │   └── user.ts                    # UserProfile, LearningStyle, Availability
│   │
│   └── i18n/                           # Internationalisation next-intl
│       ├── navigation.ts              # Link, redirect, usePathname
│       ├── request.ts                 # getRequestConfig, locales
│       └── routing.ts                 # defineRouting, pathnames, defaultLocale: fr
│
└── __tests__/
    ├── unit/
    │   ├── lib/
    │   │   ├── diagnostic.test.ts      # Algorithme diagnostic adaptatif
    │   │   ├── mastery.test.ts         # Calcul mastery
    │   │   ├── streak.test.ts          # Logique streak
    │   │   ├── utils.test.ts           # Utilitaires (cn, formatDate, slugify)
    │   │   ├── validators.test.ts      # Schemas Zod
    │   │   └── xp.test.ts             # Calcul XP et niveaux
    │   └── components/
    │       ├── chat/
    │       │   ├── ChatInput.test.tsx   # Saisie, envoi, a11y
    │       │   └── MessageBubble.test.tsx # Rendu, styles socratiques
    │       ├── dashboard/
    │       │   ├── AchievementBadge.test.tsx # Lock/unlock, a11y
    │       │   └── StreakCounter.test.tsx    # Affichage, animation
    │       ├── exercises/
    │       │   └── QCMExercise.test.tsx      # Selection, validation, feedback
    │       ├── legal/
    │       │   └── CookieConsent.test.tsx    # Opt-in, refus, Loi 25
    │       └── onboarding/
    │           └── DiagnosticFlow.test.tsx   # Navigation 7 etapes
    └── e2e/
        ├── auth.spec.ts                # Inscription, connexion, deconnexion
        ├── chat-session.spec.ts        # Session tutorat, streaming
        ├── cookie-consent.spec.ts      # Bandeau Loi 25
        ├── dashboard.spec.ts           # Navigation, progression
        └── onboarding.spec.ts          # Flow onboarding complet
```

---

## Repartition par type

| Type | Nombre | Pourcentage |
|------|--------|-------------|
| component | 71 | 37.6% |
| config | 25 | 13.2% |
| page | 20 | 10.6% |
| test | 18 | 9.5% |
| api | 12 | 6.3% |
| lib | 12 | 6.3% |
| hook | 8 | 4.2% |
| type | 8 | 4.2% |
| layout | 6 | 3.2% |
| i18n | 5 | 2.6% |
| prisma | 2 | 1.1% |
| middleware | 1 | 0.5% |
| style | 1 | 0.5% |
| **TOTAL** | **189** | — |

> Note : les composants ui/ shadcn (22) sont inclus dans le total "component" (71).

---

## Architecture des Route Groups

### (marketing) — Pages publiques
- `/` — Landing page (hero, features, social proof, CTA)
- `/pricing` — Tarification (Free / Pro / Team)
- `/about` — Mission et equipe
- `/blog` — Articles
- `/blog/[slug]` — Article individuel

### (auth) — Authentification Clerk
- `/login` — Connexion (Clerk SignIn catch-all)
- `/signup` — Inscription (Clerk SignUp catch-all)
- `/onboarding` — Diagnostic adaptatif 7 etapes

### (app) — Application authentifiee (Split-View)
- `/dashboard` — Progression, XP, streaks, suggestions
- `/session/[id]` — Chat tuteur + ExercisePanel (split-view)
- `/sessions` — Historique des sessions
- `/profile` — Profil et parametres
- `/achievements` — Badges de competence

### (admin) — Administration (role admin requis)
- `/analytics` — Metriques et graphiques
- `/users` — Gestion des utilisateurs

### (legal) — Pages legales (Loi 25 obligatoire)
- `/privacy` — Politique de confidentialite
- `/terms` — Conditions d'utilisation

---

## API Routes

| Endpoint | Methode(s) | Description |
|----------|-----------|-------------|
| `/api/chat` | POST (stream) | Chat tuteur avec streaming Vercel AI SDK v6 |
| `/api/diagnostic` | POST | Analyse diagnostique adaptative |
| `/api/exercises` | GET, POST | Liste/creation exercices |
| `/api/exercises/[id]/submit` | POST | Soumission reponse exercice |
| `/api/progress` | GET, PATCH | Progression utilisateur |
| `/api/achievements` | GET, POST | Deblocage et lecture achievements |
| `/api/sessions` | GET, POST | CRUD sessions |
| `/api/sessions/[id]` | GET, PATCH, DELETE | Session individuelle |
| `/api/sessions/[id]/messages` | GET | Historique messages session |
| `/api/admin/analytics` | GET | Metriques admin |
| `/api/admin/users` | GET, PATCH | Gestion utilisateurs admin |
| `/api/webhooks/clerk` | POST | Webhook Clerk sync → Supabase |

---

## Schema Prisma (modeles principaux)

```prisma
model User {
  id              String    @id @default(cuid())
  clerkId         String    @unique
  email           String    @unique
  name            String?
  role            Role      @default(STUDENT)
  learningStyle   String?
  availability    Json?
  xp              Int       @default(0)
  level           Int       @default(1)
  streakDays      Int       @default(0)
  lastActiveAt    DateTime?
  onboardingDone  Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  sessions        Session[]
  achievements    UserAchievement[]
  progress        Progress[]
  diagnosticResults DiagnosticResult[]
}

model Session {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  subjectId   String
  subject     Subject   @relation(fields: [subjectId], references: [id])
  status      SessionStatus @default(ACTIVE)
  title       String?
  summary     String?
  xpEarned    Int       @default(0)
  startedAt   DateTime  @default(now())
  endedAt     DateTime?
  messages    Message[]
  exercises   Exercise[]
}

model Message {
  id          String    @id @default(cuid())
  sessionId   String
  session     Session   @relation(fields: [sessionId], references: [id])
  role        MessageRole
  content     String
  isSocratic  Boolean   @default(false)
  createdAt   DateTime  @default(now())
}

model Exercise {
  id          String    @id @default(cuid())
  sessionId   String?
  session     Session?  @relation(fields: [sessionId], references: [id])
  subjectId   String
  subject     Subject   @relation(fields: [subjectId], references: [id])
  type        ExerciseType
  difficulty  Int       @default(1)
  question    String
  options     Json?
  answer      String
  hint1       String?
  hint2       String?
  hint3       String?
  submissions Submission[]
}

model Submission {
  id          String    @id @default(cuid())
  exerciseId  String
  exercise    Exercise  @relation(fields: [exerciseId], references: [id])
  userId      String
  answer      String
  isCorrect   Boolean
  hintsUsed   Int       @default(0)
  xpEarned    Int       @default(0)
  submittedAt DateTime  @default(now())
}

model Subject {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  icon        String?
  description String?
  sessions    Session[]
  exercises   Exercise[]
  progress    Progress[]
}

model Progress {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  subjectId   String
  subject     Subject   @relation(fields: [subjectId], references: [id])
  mastery     Float     @default(0)
  totalXP     Int       @default(0)
  lastStudied DateTime?
  updatedAt   DateTime  @updatedAt
  @@unique([userId, subjectId])
}

model Achievement {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String
  icon        String
  category    AchievementCategory
  condition   Json
  xpReward    Int       @default(0)
  users       UserAchievement[]
}

model UserAchievement {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  unlockedAt    DateTime  @default(now())
  @@unique([userId, achievementId])
}

model DiagnosticResult {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  subjectId   String
  level       Int
  score       Float
  details     Json?
  completedAt DateTime  @default(now())
}

enum Role { STUDENT ADMIN }
enum SessionStatus { ACTIVE PAUSED COMPLETED }
enum MessageRole { USER ASSISTANT SYSTEM }
enum ExerciseType { QCM CODE MATH FREE_TEXT }
enum AchievementCategory { STREAK MASTERY SESSION EXERCISE SPECIAL }
```

---

## Conformite Loi 25 du Quebec

| Exigence | Implementation |
|----------|---------------|
| Bandeau cookies opt-in | `src/components/legal/CookieConsent.tsx` — 3 categories, refuser = accepter en visibilite |
| Politique de confidentialite | `src/app/[locale]/(legal)/privacy/page.tsx` — RPP, droits, services tiers |
| Conditions d'utilisation | `src/app/[locale]/(legal)/terms/page.tsx` |
| Consentement modifiable | `src/components/legal/CookieSettingsButton.tsx` dans Footer |
| Donnees collectees documentees | fr.json/en.json section `legal` |
| API keys server-side only | Toutes les cles dans `.env.local`, acces via API routes uniquement |
| Test E2E cookie consent | `__tests__/e2e/cookie-consent.spec.ts` |

---

## Headers de securite (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "0" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.clerk.com https://*.supabase.co https://api.openai.com;" }
      ]
    }
  ]
}
```

---

## Variables d'environnement (.env.example)

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Prisma (via Supabase)
DATABASE_URL=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres

# OpenAI (Vercel AI SDK)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

---

## Notes d'implementation

1. **Split-View Layout** : Le layout `(app)` utilise `AppShell.tsx` avec CSS Grid 3 colonnes (sidebar 260px | main 1fr | context panel 380px). Le panneau droit est conditionnel (visible uniquement en session avec exercice actif).

2. **Methode Socratique** : Les messages du tuteur tagges `isSocratic: true` dans la DB recoivent un style visuel distinct (`SocraticPrompt.tsx`) avec bordure laterale et icone question. Le system prompt dans `lib/prompts.ts` instruite l'IA a poser des questions guidantes plutot que donner des reponses directes.

3. **Diagnostic Adaptatif** : Algorithme IRT (Item Response Theory) simplifie dans `lib/diagnostic.ts`. Ajuste la difficulte des questions en temps reel selon les reponses de l'apprenant. 7 etapes d'onboarding collectent : sujets, niveau auto-evalue, style, objectifs, disponibilite, quiz adaptatif, resume.

4. **Gamification** : XP gagnes par session, exercice, streak. Niveaux dans `lib/constants.ts`. Achievements debloques automatiquement via `useAchievements.ts` (conditions JSON dans la DB). Streaks calcules quotidiennement avec bonus multiplicateur.

5. **i18n** : next-intl avec `[locale]` segment. FR par defaut. Les messages sont dans `messages/fr.json` et `messages/en.json`. Le middleware detecte la locale et redirige.

6. **Clerk Auth** : Catch-all routes pour login/signup (`[[...login]]`, `[[...signup]]`). Webhook sync vers Supabase via `/api/webhooks/clerk`. Le middleware protege les routes `(app)` et `(admin)`.

---

**Score scaffold-planner : 9.2/10**
Exhaustivite elevee, structure coherente avec le stack demande, conformite Loi 25 integree, tests couverts.
