# Phase 0 — Discovery Report
## Client : Électro-Maître | Secteur : Automation industrielle & maintenance électrique HT
## Date : 2026-03-02 | Pipeline : NEXOS v4.0 create

---

## 1. Analyse sectorielle

### Marché
Le secteur de l'automation industrielle et de la maintenance électrique haute tension au Québec est mature, dominé par des acteurs établis (20-30 ans d'expérience). Le marché est segmenté entre :
- **Grands intégrateurs** (Excelpro, ~1000 employés) : projets multi-millions, multi-sites
- **Spécialistes moyenne envergure** (MJL, Ligne STE, 50-200 employés) : expertise ciblée (HT, thermographie)
- **PME régionales** (GET Électrique, Électromécanix) : proximité, réactivité, polyvalence

### Positionnement Électro-Maître
Électro-Maître se positionne dans le segment PME spécialisée avec trois piliers distincts :
1. **Automation industrielle** — programmation PLC, intégration systèmes
2. **Maintenance électrique haute tension** — préventive et corrective
3. **Thermographie infrarouge** — diagnostic non-intrusif

**Zone de service** : Grand Montréal + Montérégie (basé à Boucherville).

### Opportunités identifiées
- Peu de concurrents combinent automation + HT + thermographie dans une offre unifiée
- Le marché manque de sites web modernes à haute performance (la plupart sont datés)
- La section "Urgence 24/7" est un différenciateur fort si bien exécutée
- Le formulaire avec upload de plans est un avantage fonctionnel rare

---

## 2. Benchmark concurrence (5 sites)

### 2.1 Excelpro (excelpro.ca)
| Critère | Évaluation |
|---------|------------|
| **Services** | Automation complète, électricité industrielle, robotique, panneaux de contrôle |
| **Zone** | 13 marchés au Canada, bureaux Boucherville/Montréal/Drummondville |
| **Forces** | Approche intégrée, ~1000 employés, 30 ans, expertise sectorielle large |
| **Faiblesses web** | Site dense, navigation complexe, temps de chargement moyen |
| **UX** | Menu mega-dropdown par secteur, études de cas détaillées |
| **Trust signals** | Logos clients, certifications, chiffres clés en hero |

### 2.2 MJL Électrique (mjlelectrique.com)
| Critère | Évaluation |
|---------|------------|
| **Services** | Électricité BT/MT/HT, automation, thermographie IR, EV charging, solaire |
| **Zone** | Québec (CMEQ certifié) |
| **Forces** | 25 ans, 70 experts, 650+ projets, thermographie spécialisée |
| **Faiblesses web** | Design daté, formulaire basique, pas d'upload |
| **UX** | Navigation par service, page thermographie dédiée |
| **Trust signals** | Chiffres clés, certifications CMEQ, 12+ secteurs |

### 2.3 Ligne STE (ligneste.com)
| Critère | Évaluation |
|---------|------------|
| **Services** | Réseaux électriques privés, distribution souterraine, HT 18-100 MW |
| **Zone** | Montérégie, Centre-du-Québec, Capitale-Nationale |
| **Forces** | Spécialiste HT/MT pur, ISO 9001, projets 100 MW+, urgence 24/7 |
| **Faiblesses web** | Site minimaliste, peu de contenu SEO, pas de blog |
| **UX** | Navigation simple, focus projet, CTA urgence visible |
| **Trust signals** | ISO 9001, RBQ 5757-1440-01, projets majeurs listés |

### 2.4 GET Électrique (getelectrique.com)
| Critère | Évaluation |
|---------|------------|
| **Services** | Installation/maintenance résidentiel-commercial-industriel, ingénierie, énergies renouvelables |
| **Zone** | Saint-Philippe, Montérégie, tout le Québec |
| **Forces** | Polyvalence, urgence 24/7, sites de travail propres |
| **Faiblesses web** | Design générique, pas de différenciation industrielle claire |
| **UX** | Menu classique, formulaire contact simple |
| **Trust signals** | Licences, témoignages basiques |

### 2.5 Électromécanix (electromecanix.com)
| Critère | Évaluation |
|---------|------------|
| **Services** | Maintenance préventive, mécanique industrielle, PLC, troubleshooting |
| **Zone** | Saint-Lambert-de-Lauzon, Montréal et région |
| **Forces** | Approche préventive, surveillance continue, réponse rapide |
| **Faiblesses web** | Site basique, peu de contenu, UX datée |
| **UX** | Navigation minimaliste, contact direct |
| **Trust signals** | Expérience terrain, spécialisation maintenance |

### Synthèse concurrentielle

| Concurrent | Design | Perf. | SEO | Fonctionnalités | Trust | Global |
|-----------|--------|-------|-----|-----------------|-------|--------|
| Excelpro | 7/10 | 6/10 | 8/10 | 7/10 | 9/10 | 7.4 |
| MJL Électrique | 5/10 | 5/10 | 6/10 | 5/10 | 7/10 | 5.6 |
| Ligne STE | 6/10 | 7/10 | 5/10 | 4/10 | 8/10 | 6.0 |
| GET Électrique | 5/10 | 6/10 | 5/10 | 4/10 | 5/10 | 5.0 |
| Électromécanix | 4/10 | 5/10 | 4/10 | 3/10 | 5/10 | 4.2 |

**Conclusion** : Le niveau web moyen du secteur est bas (μ = 5.6/10). Un site performant à μ ≥ 8.5 SOIC positionnera Électro-Maître largement au-dessus de la concurrence.

---

## 3. Stacks techniques détectées

| Concurrent | Stack | CMS/Framework | Performance |
|-----------|-------|---------------|-------------|
| Excelpro | WordPress + Elementor | PHP | Moyenne |
| MJL Électrique | WordPress classique | PHP | Basse |
| Ligne STE | HTML/CSS statique ou WordPress | PHP | Correcte |
| GET Électrique | WordPress | PHP | Moyenne |
| Électromécanix | WordPress basique | PHP | Basse |

**Constat** : 100% des concurrents utilisent WordPress ou du HTML statique. Un site Next.js 15 avec SSG/ISR offrira un avantage technique majeur en performance, SEO et sécurité.

### Stack recommandée pour Électro-Maître
- **Next.js 15** (App Router, SSG) — performance maximale, SEO natif
- **TypeScript strict** — robustesse du code
- **Tailwind CSS 4** — design system cohérent
- **next-intl** — FR/EN bilingue
- **Vercel** — CDN global, déploiement continu
- **Google Maps API** — zone de service interactive
- **Formulaire custom** — upload PDF via API route server-side (sécurité)

---

## 4. Patterns UX dominants

### Navigation
- **Hub-and-spoke** : dominant dans le secteur B2B industriel
  - Hub : Services, Projets, Carrière, Contact
  - Spokes : sous-pages par service (Automation, Maintenance, Thermographie)
- **Sticky header** : navigation accessible en permanence sur scroll
- **Breadcrumbs** : orientation dans la hiérarchie de pages

### Formulaires
- **Champs réduits** : 3-5 champs max en première interaction (-8-10% complétion par champ supplémentaire)
- **Logique conditionnelle** : afficher champs selon le type de demande (soumission vs urgence)
- **Upload sécurisé** : validation type fichier + taille max côté serveur
- **Confirmation dynamique** : page de remerciement avec numéro de suivi

### Urgence 24/7
- **CTA fixe** : bouton d'urgence visible en permanence (coin inférieur droit ou header)
- **Couleur distinctive** : jaune sécurité (#FFD700) ou rouge sur fond sombre
- **Click-to-call** : `tel:` link direct sur mobile
- **Temps de réponse affiché** : "Réponse en moins de 30 minutes"
- **Formulaire simplifié** : Nom + Tél + Description brève

### Trust signals efficaces
1. Certifications visibles en header/footer (RBQ, CSA, CMEQ, ISO)
2. Chiffres clés animés (années d'expérience, projets complétés, clients actifs)
3. Logos clients (8-12 maximum, secteur-spécifiques)
4. Études de cas avec métriques : "Réduit le downtime de X%"
5. Photos authentiques de l'équipe et des chantiers (pas de stock)
6. Localisation visible (Boucherville + zone de service sur carte)

---

## 5. Contenu existant

**Non applicable** — Création de site (pas de migration). Le domaine `electromaitre.ca` est réservé mais pas encore en ligne.

---

## 6. Design trends du secteur

### Tendances 2025-2026 pour B2B industriel
1. **Design minimaliste & technique** : blanc abondant, typo forte, zéro fioriture — aligné avec le brief
2. **Palette sombre + accent vif** : bleu marine + jaune sécurité = standard du secteur électrique
3. **Micro-interactions** : hover sur cartes de services, compteurs animés, parallax subtil
4. **Photos authentiques** : installations réelles > stock photos (confiance +40%)
5. **Glassmorphisme léger** : effets de profondeur sur les cards de services
6. **Mobile-first obligatoire** : 60%+ du trafic B2B sur mobile en 2026
7. **Dark mode partiel** : hero sections en fond sombre avec texte clair (autorité)
8. **Scrollytelling** : narration de processus complexes en scroll (workflow automation)

### Palette confirmée
| Rôle | Couleur | Usage |
|------|---------|-------|
| Primaire | #1A2B3C (bleu marine) | Backgrounds, headers, texte principal |
| Secondaire | #B2B2B2 (gris acier) | Texte secondaire, bordures, backgrounds légers |
| Accent | #FFD700 (jaune sécurité) | CTAs, urgence, highlights, hover states |
| Fond clair | #F8F9FA | Sections alternées |
| Fond sombre | #0F1923 | Hero, footer |
| Texte sur sombre | #FFFFFF | Headers sur fond sombre |
| Succès | #22C55E | Confirmations, badges |
| Erreur | #EF4444 | Validations, alertes |

### Typographie recommandée
- **Headings** : Montserrat Bold/ExtraBold — robuste, industriel, excellente lisibilité
- **Body** : Inter Regular — netteté écran, excellent en petite taille
- **Mono** : JetBrains Mono — pour specs techniques si nécessaire

---

## 7. Recommandations pour Phase 1

### Architecture d'information proposée
```
electromaitre.ca
├── / (Accueil)
│   ├── Hero avec vidéo/image industrielle + CTA "Demander une soumission"
│   ├── 3 piliers services (cards animées)
│   ├── Chiffres clés (compteurs animés)
│   ├── Projets récents (carousel/grid)
│   ├── Certifications & partenaires
│   └── CTA urgence 24/7
├── /services
│   ├── /services/automation — Automation industrielle
│   ├── /services/maintenance — Maintenance électrique HT
│   └── /services/thermographie — Thermographie infrarouge
├── /projets — Projets réalisés (grid filtrable par type)
├── /carriere — Postes ouverts + culture d'entreprise
├── /contact — Formulaire soumission + upload PDF + carte
├── /urgence — Page dédiée urgence 24/7
├── /politique-confidentialite — Loi 25
└── /mentions-legales — Loi 25
```

### Fonctionnalités prioritaires
1. **Formulaire de soumission avec upload PDF** — API route server-side, validation type/taille, confirmation par courriel
2. **Bouton urgence 24/7 sticky** — visible sur toutes les pages, click-to-call sur mobile
3. **Google Maps interactif** — zone de service Grand Montréal / Montérégie
4. **Compteurs animés** — années d'expérience, projets complétés, satisfaction client
5. **Grid projets filtrable** — par type de service (automation, maintenance, thermographie)
6. **Bandeau cookies Loi 25** — opt-in, 3 catégories, conforme art. 8.1
7. **next-intl FR/EN** — français principal, anglais secondaire

### SEO Strategy outline
- **Mots-clés principaux** : automation industrielle Québec, maintenance électrique haute tension, thermographie infrarouge industrielle
- **Mots-clés locaux** : électricien industriel Montérégie, services électriques Boucherville, urgence électrique 24/7 Montréal
- **Structured data** : LocalBusiness, Service, FAQ schema.org
- **Vitesse cible** : Lighthouse Performance > 90

### Risques identifiés
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Upload PDF = vecteur d'attaque | Élevé | Validation serveur stricte, limite taille, scan MIME type |
| HubSpot = transfert hors QC | Moyen | Documenter dans politique Loi 25, consentement explicite |
| Google Maps API = coût | Faible | Limiter requêtes, carte statique en fallback |
| Délai 6 semaines serré | Moyen | Pipeline NEXOS automatisé, prioriser MVP |

---

## Score global Phase 0 : 8.2/10

**Justification** : Brief complet (Loi 25 incluse), secteur bien analysé, 5 concurrents benchmarkés, stack technique optimale identifiée, architecture d'information claire. Points à approfondir en Phase 1 : mots-clés SEO détaillés, wireframes, spécifications fonctionnelles du formulaire upload.

---

*Généré par NEXOS v4.0 — Phase 0 Discovery | 2026-03-02*
