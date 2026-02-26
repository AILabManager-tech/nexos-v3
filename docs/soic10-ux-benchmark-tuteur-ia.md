# SOIC-10 Tuteur IA -- Benchmark UX des plateformes de tutorat IA

**Agent**: ux-analyst (NEXOS v3.0 Phase 0 Discovery)
**Date**: 2026-02-24
**Projet**: SOIC-10 Tuteur IA
**Plateformes analysees**: Khan Academy Khanmigo, Synthesis Tutor, Duolingo, ChatGPT (OpenAI), Claude.ai (Anthropic), Quizlet Q-Chat

---

## Table des matieres

1. [Synthese executive](#1-synthese-executive)
2. [Analyse par plateforme](#2-analyse-par-plateforme)
3. [Matrice comparative](#3-matrice-comparative)
4. [Patterns UX specifiques au tutorat](#4-patterns-ux-specifiques-au-tutorat)
5. [Recommandations UX pour SOIC-10](#5-recommandations-ux-pour-soic-10)
6. [Sources](#6-sources)

---

## 1. Synthese executive

L'analyse de 6 plateformes majeures revele des patterns UX convergents dans le tutorat IA :

- **Le chat conversationnel est le paradigme dominant** -- toutes les plateformes utilisent une interface de chat comme interaction primaire.
- **Le split-view (chat + artefact) est le pattern emergent** -- Claude.ai et ChatGPT Canvas ont etabli le standard du panneau lateral pour le contenu genere.
- **La methode Socratique est le differenciateur pedagogique** -- Khanmigo et Synthesis se distinguent en refusant de donner les reponses directement.
- **La gamification de Duolingo est le gold standard de retention** -- streaks, XP, leagues, badges produisent un DAU de 34M.
- **L'onboarding progressif est critique** -- les plateformes performantes (Duolingo, Synthesis) font interagir l'utilisateur AVANT l'inscription.

---

## 2. Analyse par plateforme

### 2.1 Khan Academy Khanmigo

#### Interface de chat / conversation
| Critere | Implementation |
|---------|---------------|
| **Layout** | Chat integre dans l'ecosysteme Khan Academy existant -- pas d'interface separee. Le chat Khanmigo apparait comme un widget lateral sur les pages d'exercices et de video. |
| **Streaming** | Reponses progressives, token par token, avec indicateur de "reflexion" pendant la generation. |
| **Markdown/LaTeX** | Support complet des formules mathematiques (MathJax/KaTeX) integre nativement dans la plateforme Khan Academy. |
| **Input utilisateur** | Texte + upload d'images (lance en 2025 pour la geometrie et les problemes visuels). Pas de voice input natif. |

#### Onboarding & Profil
- **Flow d'inscription** : Minimal -- Khanmigo s'integre au compte Khan Academy existant. Pas d'onboarding separe.
- **Profil apprenant** : Herite du profil Khan Academy (niveau scolaire, cours suivis, progression).
- **Premiere session** : Message d'accueil expliquant que Khanmigo pose des questions plutot que de donner des reponses. Avertissement visible : "Ton historique de chat est visible par tes parents et enseignants."

#### Gamification & Engagement
- **Systeme de progression** : Herite du systeme Khan Academy (points d'energie, mastery levels par competence).
- **Streaks** : Non -- pas de systeme de streak propre a Khanmigo.
- **Feedback visuel** : Animations de mastery, progression sur l'arbre de competences.

#### Dashboard & Analytics
- **Cote enseignant** : Dashboard robuste avec 5 rapports distincts :
  - Snapshot de classe (temps d'apprentissage, completion, mastery sur 7 jours)
  - Rapport de mastery par competence
  - Scores et completion par assignment
  - Frequence des chats Khanmigo par etudiant
  - Rapport d'utilisation administrateur
- **Cote apprenant** : Progression visuelle sur l'arbre de competences, pourcentage de mastery.

#### Accessibilite & Mobile
- App mobile iOS/Android complete.
- Conformite WCAG 2.1 AA (plateforme Khan Academy).
- Support lecteur d'ecran.

#### Pattern Socratique
- **Implementation** : Khanmigo ne donne JAMAIS la reponse directement. Il repond par des questions guidees ("Qu'est-ce que tu penses que la prochaine etape serait ?").
- **Signal visuel** : Pas de marqueur visuel specifique pour les questions Socratiques vs les explications -- tout passe par le flow conversationnel.
- **Moderation** : Flagging automatique des messages problematiques, historique visible par parents/enseignants.

---

### 2.2 Synthesis Tutor

#### Interface de chat / conversation
| Critere | Implementation |
|---------|---------------|
| **Layout** | Interface immersive fullscreen centree sur le probleme. Pas de sidebar -- l'ecran est dedie au manipulatif interactif + dialogue. |
| **Streaming** | Reponses conversationnelles en temps reel avec adaptation immediate. |
| **Markdown/LaTeX** | Rendu visuel des mathematiques via des manipulatifs interactifs (blocs de fractions, lignes de nombres) plutot que du LaTeX brut. |
| **Input utilisateur** | Interaction tactile (drag & drop, taper sur des objets) + reponses texte courtes. |

#### Onboarding & Profil
- **Flow d'inscription** : Test de placement adaptatif -- l'IA determine rapidement le niveau de l'enfant en quelques problemes.
- **Profil apprenant** : Age + niveau determine automatiquement par le diagnostic initial.
- **Premiere session** : Debut immediat avec un probleme adapte, pas de tutorial sec.

#### Gamification & Engagement
- **Systeme de progression** : Flashcards adaptatives avec difficulte ajustee en temps reel.
- **Feedback visuel** : Manipulatifs visuels (boite a fractions qu'on peut "briser", animations de resolution).
- **Motivation** : Zone de developpement proximal -- l'IA pousse legerement au-dela de la zone de confort sans frustrer.

#### Dashboard & Analytics
- **Cote parent** : Rapports de progression par competence mathematique.
- **Visualisation** : Pas de heatmap complexe -- focus sur la progression lineaire K-5.

#### Accessibilite & Mobile
- Disponible sur iPad, desktop, Chromebook.
- Interface sans publicite, conforme COPPA (protection des donnees enfants).
- Multi-sensoriel : visuel + tactile + auditif.

#### Pattern Socratique
- **Implementation** : Dialogue adaptatif en aller-retour. L'IA pose des questions, ecoute les reponses, et ajuste en temps reel.
- **Gestion des erreurs** : Ne dit jamais "FAUX" brutalement. Explore POURQUOI l'enfant s'est trompe via des questions supplementaires.
- **Manipulatifs** : Les manipulatifs visuels (blocs, barres de fractions) servent de support concret au raisonnement Socratique.

---

### 2.3 Duolingo (gamification)

#### Interface de chat / conversation
| Critere | Implementation |
|---------|---------------|
| **Layout** | App mobile-first, ecran unique avec exercice centre. Pas de chat libre -- interactions structurees (QCM, traduction, ecoute). |
| **Streaming** | Pas de streaming -- reponses instantanees au format quiz. |
| **Markdown/LaTeX** | N/A -- contenu pre-formate avec illustrations. |
| **Input utilisateur** | Texte (traduction), selection (QCM), audio (prononciation), tap (mots a ordonner). |

#### Onboarding & Profil
- **Flow d'inscription** (reference industrie) :
  1. Choix de la langue (ecran simple, visuellement attractif)
  2. Motivation ("Pourquoi apprends-tu ? Voyage, ecole, travail...")
  3. Objectif quotidien (5, 10, 15, 20 min/jour)
  4. Test de placement OU debut au niveau debutant
  5. Premier exercice AVANT l'inscription (pattern critique : valeur avant engagement)
  6. Inscription apres avoir experimente le produit
- **Premiere session** : Mascotte Duo guide chaque etape avec humour.

#### Gamification & Engagement (GOLD STANDARD)
- **XP (Experience Points)** : Gagnes pour chaque lecon completee, quantite variable selon la performance. Les leaderboards XP generent +40% d'engagement.
- **Streaks** : Nombre de jours consecutifs d'apprentissage. Un streak actif = 3.6x plus de chances de retention long terme. "Streak Freeze" disponible (reduit le churn de 21%).
- **Leagues** : 10 rangs (Bronze a Diamond), 30 participants par league, promotion/relegation hebdomadaire.
- **Badges** : Achievement Badges (Inner Circle, Sharpshooter, Overachiever...) avec 3 niveaux chacun. +30% de taux de completion.
- **Hearts/Lives** : 5 coeurs max, -1 par erreur, regeneration 1/5h. Premium = coeurs illimites.
- **Feedback visuel** : Animations de celebration, sons satisfaisants, mascotte reactive.

#### Dashboard & Analytics
- **Metriques affichees** : XP total, streak actuel, position dans la league, progression par unite.
- **Visualisation** : Chemin d'apprentissage (path/arbre visuel), progression par section.

#### Accessibilite & Mobile
- Mobile-first design, responsive complet.
- 40+ langues.
- Accessibilite forte : gros boutons tactiles, contrastes eleves, feedback audio.

---

### 2.4 ChatGPT Interface (OpenAI)

#### Interface de chat / conversation
| Critere | Implementation |
|---------|---------------|
| **Layout** | **Sidebar gauche** (liste des conversations + projects) + **zone de chat centrale**. Layout devenu le standard de facto pour les interfaces conversationnelles IA. |
| **Streaming** | Token par token via Server-Sent Events (SSE). Le composer "shimmer" (effet de scintillement) pendant la generation. Snippet ephemere au-dessus du composer a la fin. |
| **Markdown** | Rendu complet : titres, listes, blocs de code avec coloration syntaxique, tableaux. |
| **LaTeX/KaTeX** | Support des formules mathematiques inline et block. |
| **Input utilisateur** | Texte + upload d'images + upload de fichiers + voice input (mode vocal avance). |

#### Canvas (Split-View)
- **Pattern cle** : Panneau lateral droit pour l'edition collaborative de documents et de code.
- **Fonctionnalites** : Edition directe dans le panneau, selection de portions pour modification ciblee, review de code avec suggestions inline, raccourcis contextuels (ajuster longueur, debugger...).
- **Disponible sur** : Web, Windows, macOS (mobile en cours).

#### Onboarding & Profil
- **Flow** : Inscription par email/Google/Apple, quasi-immediat.
- **Custom instructions** : L'utilisateur peut definir son contexte et ses preferences de reponse.
- **Memory** : ChatGPT retient des informations entre conversations pour personnaliser les reponses.

#### Dashboard & Analytics
- Pas de dashboard analytique pour l'apprenant -- ce n'est pas un outil educatif dedie.
- Historique de conversations dans la sidebar.

#### Accessibilite & Mobile
- App mobile iOS/Android.
- Mode sombre/clair.
- Navigation clavier basique.

---

### 2.5 Claude.ai Interface (Anthropic)

#### Interface de chat / conversation
| Critere | Implementation |
|---------|---------------|
| **Layout** | **Deux colonnes** : sidebar gauche (conversations + Projects) + zone de chat principale. Design minimaliste, texte noir sur fond blanc, accents violets. |
| **Streaming** | Token par token, spinner violet pendant la generation. |
| **Markdown** | Rendu complet : titres, listes, code avec coloration syntaxique, tableaux. |
| **LaTeX/KaTeX** | Support du rendu LaTeX (feature preview depuis aout 2024), formules inline et display. |
| **Input utilisateur** | Texte + upload de fichiers (PDF, images, code) + Projects (base de connaissances). |

#### Artifacts (Split-View -- reference)
- **Pattern cle** : Panneau dedie a droite du chat pour le contenu genere substantiel.
- **Onglets Code/Preview** : Basculement entre le code brut et le rendu visuel.
- **Types** : Code, documents, diagrammes Mermaid, applications React interactives, visualisations SVG.
- **Artifacts Space** : Espace dedie dans la sidebar pour retrouver tous les artifacts.
- **Embedding** : Depuis juin 2025, possibilite de transformer un artifact en application deployable.

#### Onboarding & Profil
- **Flow** : Inscription rapide email/Google.
- **Projects** : Workspaces avec documents de reference et instructions personnalisees.
- **Pas de profil apprenant** : Outil generaliste, pas specialise education.

#### Dashboard & Analytics
- Pas de metriques d'apprentissage.
- Organisation par Projects et conversations.

#### Accessibilite & Mobile
- App mobile iOS/Android.
- Mode sombre natif.
- Interface epuree favorisant la lisibilite.

---

### 2.6 Quizlet Q-Chat

> **Note** : Q-Chat a ete discontinue en juin 2025. L'analyse porte sur les patterns implementes avant sa fermeture.

#### Interface de chat / conversation
| Critere | Implementation |
|---------|---------------|
| **Layout** | Interface de chat integree dans l'app Quizlet. Icone "baguette magique" en haut a droite pour activer Q-Chat. |
| **Streaming** | Reponses generees par le modele OpenAI, affichage progressif. |
| **Input utilisateur** | Texte court (150 caracteres max pour les exercices de phrases). |

#### Modes d'etude interactifs
- **Quiz Me** : Questions generees en anglais sur le vocabulaire d'un set Quizlet.
- **Story Mode** : L'IA cree une histoire courte integrant le vocabulaire, suivie de 1-3 questions de comprehension.
- **Practice with Sentences** : L'apprenant cree des phrases avec le vocabulaire du set.
- **Skip** : Possibilite de passer une question.

#### Onboarding & Profil
- Integration au compte Quizlet existant.
- Q-Chat s'appuyait sur les sets de flashcards deja crees par l'utilisateur.

#### Gamification & Engagement
- Heritage du systeme Quizlet (streaks d'etude, badges).
- Adaptation de la difficulte basee sur la confiance de l'etudiant.

#### Pattern Socratique
- **Implementation** : Q-Chat posait des questions plutot que de donner des reponses, evaluait la confiance de l'etudiant, et ajustait dynamiquement la difficulte.
- **Faiblesse** : L'interface etait limitee en richesse visuelle (pas de manipulatifs, pas de formules rendues).

---

## 3. Matrice comparative

| Critere | Khanmigo | Synthesis | Duolingo | ChatGPT | Claude.ai | Q-Chat |
|---------|----------|-----------|----------|---------|-----------|--------|
| **Layout** | Widget integre | Fullscreen immersif | Mobile-first quiz | Sidebar + chat | Sidebar + chat | Widget integre |
| **Split-view/Artifacts** | Non | Non | Non | Canvas (oui) | Artifacts (oui) | Non |
| **Streaming** | Oui | Temps reel | Non (instantane) | SSE token/token | Token/token | Oui |
| **LaTeX/Math** | Oui (MathJax) | Manipulatifs visuels | N/A | Oui | Oui (KaTeX) | Non |
| **Voice input** | Non | Non | Oui (prononciation) | Oui (avance) | Non | Non |
| **Image upload** | Oui (2025) | Non | Non | Oui | Oui | Non |
| **Onboarding** | Minimal | Diagnostic adaptatif | Best-in-class (6 etapes) | Rapide | Rapide | Minimal |
| **XP/Points** | Points d'energie | Non | XP + leagues + badges | Non | Non | Streaks basiques |
| **Streaks** | Non | Non | Oui (3.6x retention) | Non | Non | Oui (basique) |
| **Dashboard apprenant** | Arbre de mastery | Progression lineaire | XP + league + path | Historique | Historique | Progression set |
| **Dashboard enseignant** | 5 rapports | Rapports parents | Classroom (basique) | Non | Non | Non |
| **Methode Socratique** | Forte (native) | Forte (conversationnelle) | Faible (quiz) | Possible (prompt) | Possible (prompt) | Moyenne |
| **Mobile** | App complete | iPad/Chromebook | Mobile-first | App complete | App complete | App Quizlet |
| **COPPA/RGPD** | Oui | Oui (COPPA) | Oui | Partiel | Partiel | Oui |

---

## 4. Patterns UX specifiques au tutorat

### 4.1 Implementation visuelle de la methode Socratique

| Plateforme | Approche | Efficacite |
|------------|----------|-----------|
| **Khanmigo** | Questions dans le flow de chat, pas de distinction visuelle question/explication | Bonne mais pas assez explicite visuellement |
| **Synthesis** | Dialogue adaptatif + manipulatifs visuels comme support de raisonnement | Excellente pour les jeunes enfants |
| **Q-Chat** | Questions basees sur les flashcards existantes | Limitee (texte seulement) |

**Pattern identifie** : Aucune plateforme ne distingue visuellement les "questions Socratiques" des "explications". C'est une **opportunite de differenciation**.

### 4.2 Presentation des diagnostics

| Plateforme | Approche |
|------------|----------|
| **Khanmigo** | Mastery levels par competence (arbre visuel) |
| **Synthesis** | Placement initial rapide + adaptation continue invisible |
| **Duolingo** | Test de placement + progression visible sur le path |

**Pattern identifie** : Le diagnostic est soit invisible (Synthesis), soit presente comme une progression (Duolingo), soit comme un rapport detaille (Khanmigo enseignant). Le meilleur pattern combine **diagnostic initial gamifie** + **progression visible continue**.

### 4.3 Exercices interactifs

| Type | Plateformes | Implementation |
|------|-------------|---------------|
| **QCM** | Duolingo, Q-Chat | Boutons de selection, feedback immediat |
| **Drag & Drop** | Duolingo | Ordonner des mots, associer des paires |
| **Manipulatifs** | Synthesis | Objets virtuels interactifs (fractions, blocs) |
| **Texte libre** | Khanmigo, Q-Chat | Chat conversationnel |
| **Image** | Khanmigo | Upload pour geometrie/problemes visuels |
| **Code** | ChatGPT Canvas, Claude Artifacts | Editeur + preview en split-view |

---

## 5. Recommandations UX pour SOIC-10

### REC-01 : Architecture de l'interface -- Layout Split-View Adaptatif

```
+------------------+----------------------------+----------------------+
|   SIDEBAR (240px)|      CHAT PRINCIPAL        |   PANNEAU DROIT      |
|                  |                            |   (contextuel)       |
| - Conversations  |  [Tuteur IA]               | - Exercice interactif|
| - Parcours       |  "Qu'est-ce que tu penses  | - Visualisation math |
| - Progression    |   de cette approche ?"     | - Code editor        |
| - Parametres     |                            | - Diagnostic visuel  |
|                  |  [Apprenant]               |                      |
|                  |  "Je crois que c'est..."   |                      |
|                  |                            |                      |
|                  |  [INPUT: texte/voice/img]  |                      |
+------------------+----------------------------+----------------------+
```

**Justification** : Combine le pattern ChatGPT/Claude (sidebar + chat) avec un panneau droit contextuel inspire d'Artifacts/Canvas pour les exercices interactifs.

**Specifications** :
- Sidebar collapsible sur mobile (hamburger menu)
- Panneau droit apparait uniquement quand un exercice/visualisation est actif
- Breakpoints : `< 768px` = chat seul, `768-1024px` = chat + panneau, `> 1024px` = layout complet

---

### REC-02 : Streaming et rendu de contenu

**Pattern recommande** :
- **Streaming SSE token par token** pour les reponses du tuteur (effet "reflexion en direct")
- **Shimmer/skeleton** sur la zone de reponse pendant la generation
- **Rendu Markdown complet** : titres, listes, tableaux, blocs de code avec coloration syntaxique
- **KaTeX** pour le rendu des formules mathematiques (inline `$...$` et display `$$...$$`)
- **Mermaid.js** pour les diagrammes de concepts
- **Highlight.js ou Prism** pour la coloration syntaxique des blocs de code

**Stack technique suggeree** :
```typescript
// Streaming avec Vercel AI SDK
import { useChat } from 'ai/react';
// Rendu markdown avec support LaTeX
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
```

---

### REC-03 : Onboarding inspire de Duolingo (adapte au tutorat IA)

**Flow en 7 etapes** :

1. **Ecran d'accueil** : Mascotte/avatar du tuteur + proposition de valeur (3 sec)
2. **Choix du domaine** : "Qu'est-ce que tu veux apprendre ?" (math, code, science, langues...)
3. **Objectif** : "Quel est ton objectif ?" (decouvrir, rattraper, exceller, preparer un examen)
4. **Rythme** : Engagement quotidien (10, 20, 30 min/jour)
5. **Diagnostic gamifie** : 5-8 questions adaptatives pour evaluer le niveau (inspire Synthesis + Duolingo)
6. **PREMIERE INTERACTION avec le tuteur AVANT inscription** (pattern Duolingo critique)
7. **Inscription** : Email/Google/Apple -- APRES avoir goute la valeur

**Justification** : Duolingo prouve que faire interagir avant d'inscrire augmente massivement la conversion. Synthesis prouve que le diagnostic doit etre adaptatif, pas un simple QCM.

---

### REC-04 : Systeme de gamification hybride

**Elements a implementer** (par priorite) :

| Priorite | Element | Impact attendu | Complexite |
|----------|---------|----------------|------------|
| P0 | **Streaks quotidiens** | +3.6x retention (donne Duolingo) | Faible |
| P0 | **XP par session** | Base du systeme de progression | Faible |
| P1 | **Badges de competence** | +30% completion (donne Duolingo) | Moyenne |
| P1 | **Niveaux de mastery** | Visualisation de progression (inspire Khanmigo) | Moyenne |
| P2 | **Leagues hebdomadaires** | +40% engagement (donne Duolingo) | Elevee |
| P2 | **Streak Freeze** | -21% churn (donne Duolingo) | Faible |
| P3 | **Hearts/Lives** | Monetisation freemium | Moyenne |

**Pattern de feedback** :
- Animation de celebration a chaque milestone (completion d'exercice, level up, badge)
- Son optionnel (desactivable) pour les reussites
- Mascotte/avatar du tuteur reactive (expressions selon le contexte)

---

### REC-05 : Methode Socratique -- Differenciation visuelle

**Innovation proposee** : Creer une distinction visuelle claire entre les types de messages du tuteur.

```
+-----------------------------------------------------+
| [QUESTION SOCRATIQUE]          icone: ?              |
| Bordure gauche: bleu accent                          |
| "A ton avis, pourquoi cette formule                  |
|  s'applique ici et pas une autre ?"                  |
+-----------------------------------------------------+

+-----------------------------------------------------+
| [EXPLICATION]                  icone: livre           |
| Bordure gauche: vert                                 |
| "La derivee d'une fonction composee                  |
|  s'obtient par la regle de la chaine..."             |
+-----------------------------------------------------+

+-----------------------------------------------------+
| [ENCOURAGEMENT]                icone: etoile          |
| Bordure gauche: doree                                |
| "Excellent raisonnement ! Tu as identifie            |
|  la bonne approche."                                 |
+-----------------------------------------------------+

+-----------------------------------------------------+
| [EXERCICE]                     icone: crayon          |
| Bordure gauche: orange                               |
| "Essaie maintenant de resoudre ce probleme :         |
|  [PANNEAU INTERACTIF S'OUVRE A DROITE]"              |
+-----------------------------------------------------+
```

**Justification** : Aucune plateforme analysee ne fait cette distinction. C'est un espace de differenciation majeur qui rend le processus pedagogique transparent et structure visuellement la progression cognitive.

---

### REC-06 : Dashboard apprenant

**Metriques a afficher** :

| Section | Metriques | Visualisation |
|---------|-----------|---------------|
| **En-tete** | Streak actuel, XP du jour, niveau global | Chiffres + icones |
| **Progression** | Mastery par competence (arbre ou path) | Treemap ou path visuel (inspire Duolingo) |
| **Performance** | Taux de reussite, temps moyen par exercice | Graphique lineaire (Chart.js / Recharts) |
| **Forces/Faiblesses** | Top 3 competences + 3 a travailler | Barres horizontales avec code couleur |
| **Historique** | Sessions recentes avec resume IA | Cards avec date + resume + XP gagnes |
| **Objectifs** | Progres vers l'objectif hebdomadaire | Barre de progression circulaire |

**Dashboard enseignant/parent** (si applicable) :
- Vue agregee multi-apprenants
- Alertes pour les apprenants en difficulte (predictive analytics)
- Export PDF des rapports de progression

---

### REC-07 : Exercices interactifs dans le panneau droit

**Types d'exercices a supporter** :

1. **QCM adaptatif** : Boutons de selection, feedback immediat, explication Socratique si erreur
2. **Code editor** : Monaco Editor ou CodeMirror avec execution sandboxee (WebAssembly)
3. **Manipulatifs mathematiques** : Canvas HTML5 avec interactions drag & drop (inspire Synthesis)
4. **Fill-in-the-blank** : Texte avec zones de saisie integrees
5. **Drag & Drop** : Ordonner des etapes, associer des concepts (inspire Duolingo)
6. **Dessin/Annotation** : Canvas pour la geometrie, avec upload d'image (inspire Khanmigo)

**Pattern de soumission** :
```
Exercice → Reponse apprenant → Feedback immediat
                                    ├── Correct → Animation + XP + Question suivante
                                    └── Incorrect → Question Socratique ("Pourquoi penses-tu que...?")
                                                    └── 2e tentative → Indice visuel
                                                        └── 3e tentative → Explication complete
```

---

### REC-08 : Accessibilite et mobile

**Standards a respecter** :
- **WCAG 2.2 AA** minimum (cible Silver si WCAG 3.0)
- **Ratio de contraste** : minimum 4.5:1 pour le texte, 3:1 pour les elements interactifs
- **Cibles tactiles** : minimum 44x44px (boutons, liens)
- **Navigation clavier complete** : Tab, Enter, Escape, fleches pour tous les composants
- **Lecteur d'ecran** : ARIA labels, roles, live regions pour le streaming
- **Taille de texte** : Base 16px, scalable jusqu'a 200% sans perte de layout

**Responsive breakpoints** :
```css
/* Mobile-first */
@media (min-width: 768px)  { /* Tablet: chat + panneau droit */ }
@media (min-width: 1024px) { /* Desktop: sidebar + chat + panneau */ }
@media (min-width: 1440px) { /* Large: layout espace */ }
```

**Mode mobile specifique** :
- Panneau droit en bottom sheet (swipe up)
- Sidebar en drawer (swipe right)
- Input vocal prominent (micro a cote du champ texte)

---

### REC-09 : Diagnostic et evaluation adaptative

**Flow de diagnostic initial** (inspire Synthesis + Khanmigo) :

1. **Questions adaptatives** : Commencer par un niveau moyen, ajuster selon les reponses (algorithme IRT - Item Response Theory)
2. **Progression invisible** : L'apprenant ne voit pas "Test de niveau" mais "Voyons ou tu en es" -- gamifie
3. **Resultats presentes positivement** : "Tu maitrises deja X, Y, Z ! Travaillons sur A et B."
4. **Indicateur de phase** visible mais contenu cache (pattern issu de la recherche Socratique)

**Diagnostic continu** :
- Recalibration silencieuse apres chaque session
- Alertes si regression detectee
- Suggestion automatique de revision (spaced repetition)

---

### REC-10 : Stack technique recommandee

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Framework** | Next.js 15+ (App Router) | Standard Mark Systems, SSR + streaming |
| **UI** | Tailwind CSS + Radix UI | Accessibilite native, design system rapide |
| **Chat/Streaming** | Vercel AI SDK (`useChat`) | SSE natif, support multi-provider |
| **Markdown** | `react-markdown` + `remark-gfm` | Tables, listes, todo |
| **Math** | `remark-math` + `rehype-katex` | Rendu LaTeX dans le chat |
| **Code** | `react-syntax-highlighter` (chat) + Monaco Editor (exercices) | Coloration + edition |
| **Diagrammes** | Mermaid.js | Flowcharts, sequences, mindmaps |
| **Graphiques** | Recharts ou Chart.js | Dashboard analytics |
| **Animations** | Framer Motion | Celebrations, transitions, feedback |
| **State** | Zustand | Leger, reactif, devtools |
| **Base de donnees** | PostgreSQL + Drizzle ORM | Historique, progression, analytics |
| **Auth** | NextAuth.js v5 | OAuth + magic links |
| **Temps reel** | Server-Sent Events (natif) | Streaming IA |
| **Tests** | Vitest + Playwright | Unit + E2E |

---

## 6. Sources

### Khan Academy / Khanmigo
- [The Design and UX Research of Khanmigo - Spotify Podcast](https://creators.spotify.com/pod/profile/ux-edtech/episodes/The-Design-and-UX-Research-of-Khanmigo-Khan-Academy-e275jbd)
- [AI in Education UX: How Khan Academy is Shaping Human-AI Learning - Medium](https://medium.com/@blessingokpala/ai-in-education-ux-how-khan-academy-is-shaping-human-ai-learning-experiences-9ec3492dbcc7)
- [Khanmigo AI Review 2025 - AI Flow Review](https://aiflowreview.com/khanmigo-ai-review-2025/)
- [Khanmigo Deep Dive - Skywork AI](https://skywork.ai/skypage/en/Khanmigo-Deep-Dive:-How-Khan-Academy's-AI-is-Shaping-the-Future-of-Education/1972857707881885696)
- [AI-Powered Student Progress Tracking - Khan Academy Blog](https://blog.khanacademy.org/student-progress-tracking-khanmigo-kt/)
- [Khanmigo Classroom Pilot Reports - Khan Academy Help](https://support.khanacademy.org/hc/en-us/articles/38554738905997-What-teacher-reports-are-available-on-the-Khanmigo-Classroom-pilot)

### Synthesis Tutor
- [Synthesis Tutor Review - Unite.AI](https://www.unite.ai/synthesis-tutor-review/)
- [Synthesis Tutor Review: Features and Value - Brighterly](https://brighterly.com/blog/synthesis-tutor-review/)
- [Synthesis Tutor Review - AI Tools for Kids](https://www.aitoolsforkids.com/ai-tools/synthesis-tutor)
- [Synthesis AI Review - Play Learn Thrive](https://playlearnthrive.com/synthesis-ai-review/)

### Duolingo
- [Duolingo's Gamification Secrets: Streaks & XP - Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [Duolingo Case Study 2025 - Young Urban Project](https://www.youngurbanproject.com/duolingo-case-study/)
- [Duolingo's Delightful Onboarding - Appcues](https://goodux.appcues.com/blog/duolingo-user-onboarding)
- [Duolingo UX Onboarding Breakdown - UserGuiding](https://userguiding.com/blog/duolingo-onboarding-ux)
- [Duolingo Gamification Explained - StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
- [Duolingo Leagues & Leaderboards - Duolingo Blog](https://blog.duolingo.com/duolingo-leagues-leaderboards/)

### ChatGPT / OpenAI
- [OpenAI UI Guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines/)
- [Streaming Responses for Real-Time UX - MakeAIHQ](https://makeaihq.com/guides/cluster/streaming-responses-real-time-ux-chatgpt)
- [Introducing Canvas - OpenAI](https://openai.com/index/introducing-canvas/)
- [ChatGPT Canvas Review 2025 - Skywork AI](https://skywork.ai/blog/chatgpt-canvas-review-2025-features-coding-pros-cons/)

### Claude.ai / Anthropic
- [Conversational AI UI Comparison 2025 - IntuitionLabs](https://intuitionlabs.ai/articles/conversational-ai-ui-comparison-2025)
- [Claude Artifacts Guide - Albato](https://albato.com/blog/publications/how-to-use-claude-artifacts-guide)
- [Claude Artifact Update - DesignZig](https://designzig.com/claude-artifact-update-chat-create-launch-turning-ideas-into-interactive-ai-apps/)
- [Claude LaTeX Rendering - Anthropic](https://x.com/AnthropicAI/status/1826667671364272301)

### Quizlet Q-Chat
- [Introducing Q-Chat - Quizlet Blog](https://quizlet.com/blog/meet-q-chat)
- [Q-Chat AI Tutor - Quizlet](https://quizlet.com/study-guides/q-chat-personal-ai-tutor-a5116eff-c2a9-4ba4-8b4b-b7b901994611)
- [Quick and Quirky Stories: Exploring Q-Chat - FLTMAG](https://fltmag.com/quizlet-q-chat/)

### AI UX Patterns & Education
- [AI UX Patterns - Shape of AI](https://www.shapeof.ai)
- [20+ GenAI UX Patterns - UX Collective](https://uxdesign.cc/20-genai-ux-patterns-examples-and-implementation-tactics-5b1868b7d4a1)
- [Design Patterns for AI Interfaces - Smashing Magazine](https://www.smashingmagazine.com/2025/07/design-patterns-ai-interfaces/)
- [AI Learning Analytics Dashboards - 8allocate](https://8allocate.com/blog/ai-learning-analytics-dashboards-for-instructors-turning-data-into-actionable-insights/)
- [Socratic AI: An Adaptive Tutor - medRxiv](https://www.medrxiv.org/content/10.1101/2025.06.22.25329661v1.full)
- [AAG v0.1 - Accessibility Guidelines for AI Interfaces - Medium](https://medium.com/@anky18milestone/aag-v0-1-accessibility-guidelines-for-ai-interfaces-inspired-by-wcag-40ab4e8badc2)

---

*Rapport genere par l'agent ux-analyst, NEXOS v3.0 Phase 0 Discovery, 2026-02-24.*
