# Audit SOIC v3.0 Comparatif — L'Usine RH (4 versions)

**Date** : 2026-02-16
**Auditeur** : NEXOS SOIC v3.0
**Mode** : READ-ONLY (aucune modification du code)

---

## 1. Tableau comparatif

| Metrique              | MAIN       | REBRANDING | CHANTIER   | INDUSTRIELLE |
|-----------------------|------------|------------|------------|--------------|
| Build OK?             | OUI        | OUI        | OUI        | OUI          |
| mu (score global)     | **5.55**   | **5.55**   | **5.94**   | **5.98**     |
| Coverage              | 94%        | 94%        | 94%        | 94%          |
| Gates PASS            | 6/17       | 6/17       | 8/17       | 8/17         |
| Gates FAIL            | 10         | 10         | 8          | 8            |
| Gates NOT_EXECUTED    | 1          | 1          | 1          | 1            |
| D1 Architecture       | 10.0       | 10.0       | 10.0       | 10.0         |
| D2 Documentation      | 6.0        | 6.0        | 6.0        | 6.0          |
| D3 Tests              | 5.0        | 5.0        | 5.0        | 5.0          |
| D4 Securite           | **4.7**    | **4.7**    | **4.7**    | **4.7**      |
| D5 Performance        | 6.5        | 6.5        | **8.6**    | **8.9**      |
| D6 Accessibilite      | 5.0        | 5.0        | 4.8        | 4.8          |
| D7 SEO                | 4.9        | 4.9        | **6.6**    | **6.6**      |
| D8 Conformite legale  | **3.3**    | **3.3**    | **3.3**    | **3.3**      |
| D9 Code Quality       | 5.0        | 5.0        | 5.0        | 5.0          |
| Verdict SOIC          | FAIL       | FAIL       | FAIL       | FAIL         |
| Lighthouse Perf       | 30%        | 30%        | 72%        | **78%**      |
| Lighthouse A11y       | **100%**   | **100%**   | 95%        | 95%          |
| Lighthouse BP         | 100%       | 100%       | 100%       | 100%         |
| Lighthouse SEO        | 58%        | 58%        | **92%**    | **92%**      |
| WCAG violations       | N/A (1)    | N/A (1)    | N/A (1)    | N/A (1)      |
| Security headers      | 0/6        | 0/6        | 0/6        | 0/6          |
| npm audit high/crit   | 4/0        | 4/0        | 4/0        | 4/0          |
| W-14 legal (detail)   | 1/6        | 1/6        | 1/6        | 1/6          |
| W-17 cookies          | 5.0/10     | 5.0/10     | 5.0/10     | 5.0/10       |

> (1) Pa11y n'a pas produit de rapport exploitable (fichier vide). W-10 = NOT_EXECUTED pour les 4 versions.

---

## 2. Detail des FAIL par version

### Gates communes en FAIL (toutes les 4 versions)

| Gate | Score | Diagnostic | Action corrective |
|------|-------|-----------|-------------------|
| W-02 documentation | 6.0/10 | JSDoc present dans seulement 2/10 composants | Ajouter JSDoc aux 8 composants principaux (Header, Footer, Hero, Services, etc.) |
| W-04 test-coverage | 0.0/10 | Couverture de tests a 0% (vitest --coverage non configure) | Configurer vitest coverage (`@vitest/coverage-v8`), ecrire tests pour les composants critiques. Cible >= 60% |
| W-05 npm-audit | 2.0/10 | 4 vulnerabilites HIGH dans les dependances | Executer `npm audit fix --force`, verifier le build apres correction |
| W-06 security-headers | 2.0/10 | Aucun fichier vercel.json avec headers de securite | Creer vercel.json avec X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, CSP |
| W-13 seo-meta | 4.0/10 | Pas de title, description, openGraph dans layout.tsx | Ajouter metadata export dans app/[locale]/layout.tsx (title, description, openGraph) |
| W-14 legal-compliance | 1.7/10 | 1/6 checks : aucune page confidentialite, aucun lien footer, aucun mot-cle Loi 25, pas de checkbox consentement | Creer /politique-de-confidentialite avec RPP, finalites, duree conservation. Ajouter lien dans le footer. Template disponible dans templates/ |
| W-16 typescript-strict | 0.0/10 | tsconfig.json non parsable par le gate (format non standard) | Verifier tsconfig.json, activer strict:true, noUncheckedIndexedAccess:true |
| W-17 cookie-consent | 5.0/10 | Aucun composant de consentement cookies, trackers non wrappes | Implementer le bandeau cookies Loi 25 (template dans templates/cookie-consent-component.tsx). Wrapper les scripts tiers dans le conditionnel de consentement |

### Gates en FAIL seulement dans MAIN et REBRANDING

| Gate | MAIN/REBRANDING | CHANTIER/INDUSTRIELLE | Delta |
|------|-----------------|----------------------|-------|
| W-08 lighthouse-perf | **FAIL** (3.0) | **PASS** (7.2 / 7.8) | +4.2 / +4.8 |
| W-12 lighthouse-seo | **FAIL** (5.8) | **PASS** (9.2 / 9.2) | +3.4 / +3.4 |

---

## 3. Analyse differentielle

### MAIN vs REBRANDING
**Identiques.** Les 17 gates donnent exactement les memes scores. La branche `rebranding/hr-factory` n'a pas encore diverge du main sur les metriques de qualite. Le rebranding semble etre purement visuel (couleurs, textes) sans impact sur la structure ou la conformite.

### MAIN vs CHANTIER/INDUSTRIELLE
**3 gates different** :

| Gate | MAIN | CHANTIER | INDUSTRIELLE | Explication |
|------|------|----------|--------------|-------------|
| W-08 perf | 3.0 FAIL | 7.2 PASS | **7.8 PASS** | Lighthouse perf 30% vs 72-78%. Les branches thematiques ont probablement des images plus legeres ou moins de JS client |
| W-11 a11y | 10.0 PASS | 9.5 PASS | 9.5 PASS | Legere regression a11y (-5%) dans les branches thematiques. Probablement des elements visuels ajoutes sans attributs ARIA complets |
| W-12 seo | 5.8 FAIL | 9.2 PASS | **9.2 PASS** | Lighthouse SEO 58% vs 92%. Les branches thematiques ont de meilleures meta tags ou une meilleure structure HTML |

### CHANTIER vs INDUSTRIELLE
**Quasi-identiques.** Seule difference : W-08 (perf) = 7.2 vs 7.8 (+0.6 en faveur d'INDUSTRIELLE). Negligeable.

### Regressions
- **Accessibilite** : MAIN/REBRANDING a11y=100% vs CHANTIER/INDUSTRIELLE a11y=95%. Regression mineure (-5%).
- **Aucune regression critique** : les gates D4 (securite) et D8 (legal) sont identiques dans les 4 versions.

### Version la plus avancee en conformite
**INDUSTRIELLE** (mu=5.98) devance CHANTIER (mu=5.94) de 0.04 point grace a une meilleure performance Lighthouse (78% vs 72%). Les 4 versions partagent les memes lacunes en securite (D4=4.7), conformite legale (D8=3.3) et qualite de code (D9=5.0).

---

## 4. Recommandation finale

### Base recommandee pour la livraison
**INDUSTRIELLE** (`version/usine-industrielle`) — mu=5.98, meilleur score global.

Justification :
- Meilleure performance Lighthouse (78% vs 30% pour MAIN)
- Meilleur SEO Lighthouse (92% vs 58% pour MAIN)
- Regression a11y mineure (-5%) facilement corrigible
- Memes problemes structurels que les autres versions = meme effort de correction

### Top 5 correctifs prioritaires pour atteindre mu >= 8.5

| # | Correctif | Impact estime sur mu | Effort |
|---|-----------|---------------------|--------|
| 1 | **W-14 + W-17 : Conformite Loi 25** — Creer page confidentialite, bandeau cookies, liens footer | D8: 3.3 -> ~8.0 (+4.7) = **mu +0.52** | 2-3h |
| 2 | **W-06 : Headers securite** — Creer vercel.json avec les 6 headers obligatoires + CSP | D4: 4.7 -> ~7.3 (+2.6) = **mu +0.31** | 30min |
| 3 | **W-05 : npm audit** — `npm audit fix --force` + verifier build | D4: 4.7 -> ~8.0 (cumul W-06) = **mu +0.15** | 30min |
| 4 | **W-13 : SEO metadata** — Ajouter title, description, openGraph dans layout.tsx | D7: 6.6 -> ~9.0 (+2.4) = **mu +0.24** | 30min |
| 5 | **W-16 : TypeScript strict** — Corriger tsconfig.json, activer strict mode | D9: 5.0 -> ~8.0 (+3.0) = **mu +0.27** | 1h |

**Estimation totale** : 5-6h de travail pour passer de mu=5.98 a mu ~8.5

### Gates BLOQUANTES encore en FAIL (D4 + D8)

| Gate | Dimension | Score actuel | Seuil implicite | Statut |
|------|-----------|-------------|-----------------|--------|
| W-05 npm-audit | D4 Securite | 2.0/10 | PASS requis | **BLOQUANT** |
| W-06 security-headers | D4 Securite | 2.0/10 | PASS requis | **BLOQUANT** |
| W-14 legal-compliance | D8 Legal | 1.7/10 | PASS requis | **BLOQUANT** |
| W-17 cookie-consent | D8 Legal | 5.0/10 | PASS requis | **BLOQUANT** |

> D4 et D8 sont des dimensions non-negociables dans SOIC v3.0 : un FAIL dans ces dimensions bloque l'ACCEPT meme si mu >= 8.5. **Les 4 gates ci-dessus doivent passer avant toute livraison.**

---

## Annexe : Donnees brutes Lighthouse

| Categorie | MAIN | REBRANDING | CHANTIER | INDUSTRIELLE |
|-----------|------|------------|----------|--------------|
| Performance | 30% | 30% | 72% | 78% |
| Accessibility | 100% | 100% | 95% | 95% |
| Best Practices | 100% | 100% | 100% | 100% |
| SEO | 58% | 58% | 92% | 92% |

## Annexe : Branches Git

| Label | Branche | Commit | Source |
|-------|---------|--------|--------|
| MAIN | `main` | HEAD | https://github.com/AILabManager-tech/USINE_RH.git |
| REBRANDING | `rebranding/hr-factory` | HEAD | idem |
| CHANTIER | `version/chantier-construction` | HEAD | idem |
| INDUSTRIELLE | `version/usine-industrielle` | HEAD | idem |

## Annexe : Note sur W-10 (pa11y)

Pa11y a produit des fichiers vides pour les 4 versions. Le gate W-10 est marque NOT_EXECUTED (score 0.0, penalisant). Cela explique le D6 bas (4.8-5.0) malgre un Lighthouse a11y de 95-100%. Pour obtenir un score D6 complet, installer Chromium headless et relancer pa11y, ou utiliser `npx playwright install chromium` avant le scan.
