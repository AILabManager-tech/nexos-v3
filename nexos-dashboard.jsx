// ═══════════════════════════════════════════════════════════════════════════════
// NEXOS v3.0 — Architecture Interactive Dashboard
// Pipeline Web Autonome │ Mark Systems │ Cyberpunk Terminal UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import {
  Shield, Zap, Eye, Lock, FileCode, Search, Palette, FileText, Hammer,
  CheckCircle, AlertTriangle, XCircle, ChevronRight, ChevronDown, Globe,
  Code2, BarChart3, ArrowRight, Play, RotateCw, Target, Activity, Terminal,
  Cpu, LayoutDashboard, Layers, ShieldCheck, Menu, X, ExternalLink,
  Gauge, GitBranch, Settings, Radio, MonitorCheck, Bug, Fingerprint,
  Scale, Cookie, BookOpen, Gavel, CircleDot, Filter
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// THEME — Cyberpunk Terminal Palette
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  bg:        '#0a0a0f',
  surface:   '#12121a',
  border:    '#1a1a2e',
  primary:   '#00ff88',
  secondary: '#00d4ff',
  accent:    '#ff3366',
  warning:   '#ffaa00',
  text:      '#e0e0e0',
  textDim:   '#888888',
  textMuted: '#555555',
  glow: (color, intensity = 0.3) => `0 0 20px rgba(${hexToRgb(color)},${intensity})`,
  glowStrong: (color) => `0 0 30px rgba(${hexToRgb(color)},0.5), 0 0 60px rgba(${hexToRgb(color)},0.2)`,
  borderGlow: (color) => `1px solid rgba(${hexToRgb(color)},0.25)`,
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — Phases du Pipeline
// ═══════════════════════════════════════════════════════════════════════════════

const PHASES = [
  {
    id: 'ph0', name: 'Discovery', icon: 'Search', color: '#00d4ff',
    threshold: 7.0, thresholdLabel: 'μ ≥ 7.0', timeout: '5 min',
    description: 'Analyse du site existant ou brief client. Collecte données techniques, UX, contenu, design.',
    agents: [
      { name: 'web-scout', role: 'Crawl et analyse structure existante' },
      { name: 'tech-inspector', role: 'Audit stack technique et dépendances' },
      { name: 'ux-analyst', role: 'Évaluation parcours utilisateur' },
      { name: 'content-evaluator', role: 'Analyse qualité et pertinence contenu' },
      { name: 'design-critic', role: 'Revue design system et cohérence visuelle' },
    ],
  },
  {
    id: 'ph1', name: 'Strategy', icon: 'Target', color: '#00ff88',
    threshold: 8.0, thresholdLabel: 'μ ≥ 8.0', timeout: '5 min',
    description: 'Stratégie globale : branding, architecture info, SEO, solution technique, scaffold.',
    agents: [
      { name: 'brand-strategist', role: 'Positionnement et identité de marque' },
      { name: 'info-architect', role: 'Architecture de l\'information et navigation' },
      { name: 'seo-strategist', role: 'Stratégie SEO et mots-clés cibles' },
      { name: 'solution-architect', role: 'Architecture technique et choix techno' },
      { name: 'scaffold-planner', role: 'Plan de structure du projet Next.js' },
    ],
  },
  {
    id: 'ph2', name: 'Design', icon: 'Palette', color: '#a855f7',
    threshold: 8.0, thresholdLabel: 'μ ≥ 8.0', timeout: '10 min',
    description: 'Design system, layouts, interactions, responsive, direction artistique.',
    agents: [
      { name: 'design-system-architect', role: 'Tokens, composants, thème global' },
      { name: 'layout-designer', role: 'Grilles, mise en page, hiérarchie' },
      { name: 'interaction-designer', role: 'Micro-interactions et animations' },
      { name: 'responsive-specialist', role: 'Adaptation mobile/tablet/desktop' },
      { name: 'asset-director', role: 'Direction artistique, images, iconographie' },
    ],
  },
  {
    id: 'ph3', name: 'Content', icon: 'FileText', color: '#ffaa00',
    threshold: 8.0, thresholdLabel: 'μ ≥ 8.0', timeout: '10 min',
    description: 'Rédaction, optimisation SEO, architecture contenu, traduction, révision.',
    agents: [
      { name: 'copywriter-principal', role: 'Rédaction textes principaux et ton' },
      { name: 'seo-copywriter', role: 'Optimisation SEO du contenu rédactionnel' },
      { name: 'content-architect', role: 'Structure et hiérarchie du contenu' },
      { name: 'translator', role: 'Traduction FR/EN et localisation' },
      { name: 'content-reviewer', role: 'Révision qualité, cohérence, orthographe' },
    ],
  },
  {
    id: 'ph4', name: 'Build', icon: 'Hammer', color: '#ff3366',
    threshold: null, thresholdLabel: 'BUILD PASS', timeout: '20 min',
    description: 'Bootstrap projet, composants, assemblage pages, intégration, assets SEO, validation build.',
    agents: [
      { name: 'project-bootstrap', role: 'Init Next.js, config TS/Tailwind/ESLint' },
      { name: 'component-builder', role: 'Développement composants React' },
      { name: 'page-assembler', role: 'Assemblage pages à partir des composants' },
      { name: 'integration-engineer', role: 'API routes, services tiers, i18n' },
      { name: 'seo-asset-generator', role: 'Sitemap, robots.txt, OG images, JSON-LD' },
      { name: 'build-validator', role: 'Validation build Next.js + TypeScript strict' },
    ],
  },
  {
    id: 'ph5', name: 'QA + Deploy', icon: 'ShieldCheck', color: '#00ff88',
    threshold: 8.5, thresholdLabel: 'μ ≥ 8.5', timeout: '30 min',
    description: '23 agents : 5 perf, 5 sécu, 4 SEO, 3 a11y, 2 code, 1 conformité, 1 post-deploy, 2 gate-keepers.',
    agents: [
      { name: 'perf-auditor', role: 'Audit Lighthouse performance' },
      { name: 'perf-optimizer', role: 'Optimisations performance ciblées' },
      { name: 'image-optimizer', role: 'Compression et formats next-gen' },
      { name: 'bundle-analyzer', role: 'Analyse et réduction bundle size' },
      { name: 'core-vitals-checker', role: 'LCP, FID, CLS monitoring' },
      { name: 'security-auditor', role: 'Audit sécurité global' },
      { name: 'csp-generator', role: 'Génération Content-Security-Policy' },
      { name: 'headers-validator', role: 'Validation headers HTTP sécurité' },
      { name: 'dep-scanner', role: 'Scan vulnérabilités dépendances' },
      { name: 'secret-detector', role: 'Détection secrets/clés exposés' },
      { name: 'seo-validator', role: 'Validation SEO technique' },
      { name: 'meta-checker', role: 'Vérification meta tags et OG' },
      { name: 'sitemap-validator', role: 'Validation sitemap et robots.txt' },
      { name: 'schema-markup-validator', role: 'Validation JSON-LD et Schema.org' },
      { name: 'a11y-auditor', role: 'Audit accessibilité WCAG 2.2 AA' },
      { name: 'color-contrast-checker', role: 'Vérification contrastes couleurs' },
      { name: 'screen-reader-tester', role: 'Tests lecteur d\'écran' },
      { name: 'code-reviewer', role: 'Revue qualité code et patterns' },
      { name: 'typescript-checker', role: 'Validation TypeScript strict' },
      { name: 'legal-compliance', role: 'Conformité Loi 25 Québec (28 checks)' },
      { name: 'post-deploy-setup', role: 'GSC, Analytics, AdSense, DNS' },
      { name: 'phase-gate-keeper', role: 'Validation gate inter-phase' },
      { name: 'deploy-gate-keeper', role: 'Validation finale déploiement' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — 9 Dimensions SOIC
// ═══════════════════════════════════════════════════════════════════════════════

const DIMENSIONS = [
  { id: 'D1', name: 'Architecture',  shortName: 'Archi',      weight: 1.0, blocking: false, icon: 'Layers' },
  { id: 'D2', name: 'Documentation', shortName: 'Docs',       weight: 0.8, blocking: false, icon: 'BookOpen' },
  { id: 'D3', name: 'Tests',         shortName: 'Tests',      weight: 0.9, blocking: false, icon: 'CheckCircle' },
  { id: 'D4', name: 'Sécurité',      shortName: 'Sécu',       weight: 1.2, blocking: true,  icon: 'Shield' },
  { id: 'D5', name: 'Performance',   shortName: 'Perf',       weight: 1.0, blocking: false, icon: 'Zap' },
  { id: 'D6', name: 'Accessibilité', shortName: 'A11y',       weight: 1.1, blocking: false, icon: 'Eye' },
  { id: 'D7', name: 'SEO',           shortName: 'SEO',        weight: 1.0, blocking: false, icon: 'Globe' },
  { id: 'D8', name: 'Conformité',    shortName: 'Conform.',   weight: 1.1, blocking: true,  icon: 'Scale' },
  { id: 'D9', name: 'Code Quality',  shortName: 'CodeQ',      weight: 0.9, blocking: false, icon: 'Code2' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — 21 Quality Gates (17 Web + 4 Early)
// ═══════════════════════════════════════════════════════════════════════════════

const GATES = [
  { id: 'PE-01', name: 'brief-completeness',    dim: 'D2', priority: 'Haute',     phase: 'ph0', description: 'Brief client complet avec toutes sections obligatoires' },
  { id: 'PE-02', name: 'discovery-coverage',     dim: 'D1', priority: 'Haute',     phase: 'ph0', description: 'Couverture complète de l\'analyse discovery' },
  { id: 'PE-03', name: 'strategy-coherence',     dim: 'D1', priority: 'Haute',     phase: 'ph1', description: 'Cohérence entre stratégie SEO, branding et architecture' },
  { id: 'PE-04', name: 'design-tokens-defined',  dim: 'D1', priority: 'Moyenne',   phase: 'ph2', description: 'Design tokens définis (couleurs, typo, espacement)' },
  { id: 'W-01', name: 'project-structure',       dim: 'D1', priority: 'Haute',     phase: 'ph4', description: 'Structure projet Next.js conforme au scaffold' },
  { id: 'W-02', name: 'documentation',           dim: 'D2', priority: 'Moyenne',   phase: 'ph4', description: 'README, commentaires, documentation API' },
  { id: 'W-03', name: 'tests-run',               dim: 'D3', priority: 'Haute',     phase: 'ph4', description: 'Suite de tests exécutée sans échec' },
  { id: 'W-04', name: 'coverage-80',             dim: 'D3', priority: 'Haute',     phase: 'ph4', description: 'Couverture de tests ≥ 80%' },
  { id: 'W-05', name: 'dependencies-audit',      dim: 'D4', priority: 'Critique',  phase: 'ph5', description: 'npm audit = 0 vulnérabilités HIGH/CRITICAL' },
  { id: 'W-06', name: 'security-headers',        dim: 'D4', priority: 'Critique',  phase: 'ph5', description: '6 headers sécu obligatoires dans vercel.json' },
  { id: 'W-07', name: 'no-client-secrets',       dim: 'D4', priority: 'Critique',  phase: 'ph5', description: 'Aucune clé API côté client' },
  { id: 'W-08', name: 'perf-core-vitals',        dim: 'D5', priority: 'Haute',     phase: 'ph5', description: 'Core Web Vitals dans les seuils Google' },
  { id: 'W-09', name: 'code-splitting',          dim: 'D5', priority: 'Haute',     phase: 'ph5', description: 'Code splitting et lazy loading implémentés' },
  { id: 'W-10', name: 'accessibility-pa11y',     dim: 'D6', priority: 'Haute',     phase: 'ph5', description: '0 erreurs pa11y WCAG 2.2 AA' },
  { id: 'W-11', name: 'aria-attributes',         dim: 'D6', priority: 'Haute',     phase: 'ph5', description: 'Attributs ARIA corrects sur tous les contrôles' },
  { id: 'W-12', name: 'seo-meta-basic',          dim: 'D7', priority: 'Haute',     phase: 'ph5', description: 'Title, description, canonical, OG tags' },
  { id: 'W-13', name: 'seo-advanced',            dim: 'D7', priority: 'Moyenne',   phase: 'ph5', description: 'Sitemap, robots.txt, JSON-LD Schema.org' },
  { id: 'W-14', name: 'legal-compliance',        dim: 'D8', priority: 'Bloquant',  phase: 'ph5', description: 'Conformité Loi 25 — 28 checks passés' },
  { id: 'W-15', name: 'linting',                 dim: 'D9', priority: 'Moyenne',   phase: 'ph5', description: 'ESLint 0 erreurs, 0 warnings' },
  { id: 'W-16', name: 'typescript-strict',       dim: 'D9', priority: 'Haute',     phase: 'ph5', description: 'TypeScript strict mode sans erreurs' },
  { id: 'W-17', name: 'cookie-consent',          dim: 'D8', priority: 'Bloquant',  phase: 'ph5', description: 'Bandeau cookies opt-in conforme Loi 25' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — 6 Outils CLI Tooling
// ═══════════════════════════════════════════════════════════════════════════════

const TOOLS = [
  { id: 'lighthouse', name: 'Lighthouse', icon: 'Gauge',       cmd: 'lighthouse <URL> --output json', targets: ['D5', 'D6', 'D7'], description: 'Performance, SEO, Accessibilité, Best Practices' },
  { id: 'pa11y',      name: 'pa11y',      icon: 'Eye',         cmd: 'pa11y <URL> --standard WCAG2AA',  targets: ['D6'], description: 'WCAG 2.2 AA — erreurs accessibilité détaillées' },
  { id: 'headers',    name: 'curl headers', icon: 'Shield',    cmd: 'curl -sI <URL>',                  targets: ['D4'], description: 'Vérification 6 headers sécurité HTTP' },
  { id: 'ssl',        name: 'testssl/openssl', icon: 'Lock',   cmd: 'testssl --quiet <URL>',           targets: ['D4'], description: 'Audit certificat SSL/TLS et configuration' },
  { id: 'npm-audit',  name: 'npm audit',  icon: 'Bug',         cmd: 'npm audit --audit-level=high',    targets: ['D4'], description: 'Vulnérabilités dépendances HIGH/CRITICAL' },
  { id: 'osiris',     name: 'OSIRIS',     icon: 'Activity',    cmd: 'osiris-scan <URL>',               targets: ['D5'], description: 'Sobriété web — poids pages, requêtes, éco-score' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — 28 Checks Loi 25 Québec
// ═══════════════════════════════════════════════════════════════════════════════

const LAW25_CATEGORIES = [
  { id: 'cookies', name: 'Cookies & Consentement', icon: 'Cookie', color: '#ffaa00' },
  { id: 'privacy', name: 'Politique de confidentialité', icon: 'FileText', color: '#00d4ff' },
  { id: 'legal',   name: 'Mentions légales', icon: 'Gavel', color: '#a855f7' },
  { id: 'security', name: 'Sécurité technique', icon: 'Shield', color: '#ff3366' },
  { id: 'incident', name: 'Gestion d\'incidents', icon: 'AlertTriangle', color: '#ff6b35' },
];

const LAW25_CHECKS = [
  // Cookies & Consentement (7)
  { id: 'C1', cat: 'cookies', name: 'Bandeau consentement présent', critical: true },
  { id: 'C2', cat: 'cookies', name: 'Opt-in par défaut (pas opt-out)', critical: true },
  { id: 'C3', cat: 'cookies', name: 'Bouton Refuser aussi visible qu\'Accepter', critical: true },
  { id: 'C4', cat: 'cookies', name: 'Catégories granulaires (Essentiels/Analytics/Marketing)', critical: false },
  { id: 'C5', cat: 'cookies', name: 'Cookies non-essentiels bloqués avant consentement', critical: true },
  { id: 'C6', cat: 'cookies', name: 'Préférences modifiables après consentement', critical: false },
  { id: 'C7', cat: 'cookies', name: 'Consentement enregistré avec horodatage', critical: false },
  // Politique de confidentialité (9)
  { id: 'P1', cat: 'privacy', name: 'Page dédiée /politique-confidentialite', critical: true },
  { id: 'P2', cat: 'privacy', name: 'RPP identifié (nom, titre, courriel)', critical: true },
  { id: 'P3', cat: 'privacy', name: 'Types de données collectées listés', critical: true },
  { id: 'P4', cat: 'privacy', name: 'Finalités de collecte documentées', critical: true },
  { id: 'P5', cat: 'privacy', name: 'Durée de conservation précisée', critical: true },
  { id: 'P6', cat: 'privacy', name: 'Droits des utilisateurs (accès, rectification, suppression)', critical: true },
  { id: 'P7', cat: 'privacy', name: 'Services tiers et transferts hors QC documentés', critical: true },
  { id: 'P8', cat: 'privacy', name: 'Base juridique du traitement mentionnée', critical: false },
  { id: 'P9', cat: 'privacy', name: 'Date de dernière mise à jour affichée', critical: false },
  // Mentions légales (5)
  { id: 'L1', cat: 'legal', name: 'Page dédiée /mentions-legales', critical: true },
  { id: 'L2', cat: 'legal', name: 'Dénomination sociale et NEQ', critical: true },
  { id: 'L3', cat: 'legal', name: 'Adresse physique complète', critical: false },
  { id: 'L4', cat: 'legal', name: 'Coordonnées de contact', critical: true },
  { id: 'L5', cat: 'legal', name: 'Hébergeur identifié', critical: false },
  // Sécurité technique (5)
  { id: 'S1', cat: 'security', name: 'HTTPS actif avec certificat valide', critical: true },
  { id: 'S2', cat: 'security', name: 'Headers sécurité (CSP, HSTS, X-Frame)', critical: true },
  { id: 'S3', cat: 'security', name: 'Pas de secrets exposés côté client', critical: true },
  { id: 'S4', cat: 'security', name: '0 vulnérabilités HIGH dans dépendances', critical: true },
  { id: 'S5', cat: 'security', name: 'poweredByHeader désactivé', critical: false },
  // Incidents (2)
  { id: 'I1', cat: 'incident', name: 'Courriel de notification incident configuré', critical: true },
  { id: 'I2', cat: 'incident', name: 'Procédure de réponse aux incidents documentée', critical: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — Modes d'opération & Convergence
// ═══════════════════════════════════════════════════════════════════════════════

const MODES = [
  { id: 'create',    name: 'Create',    desc: 'Création complète (6 phases)', phases: 'ph0→ph5', icon: 'Play' },
  { id: 'audit',     name: 'Audit',     desc: 'Audit site existant', phases: 'tooling→ph5', icon: 'Search' },
  { id: 'modify',    name: 'Modify',    desc: 'Modification ciblée', phases: 'site-update', icon: 'Settings' },
  { id: 'content',   name: 'Content',   desc: 'Rédaction / traduction', phases: 'ph3', icon: 'FileText' },
  { id: 'analyze',   name: 'Analyze',   desc: 'Découverte seule', phases: 'ph0', icon: 'Eye' },
  { id: 'converge',  name: 'Converge',  desc: 'Boucle convergence autonome', phases: 'SOIC loop', icon: 'RotateCw' },
  { id: 'knowledge', name: 'Knowledge', desc: 'Base de connaissances', phases: 'docs', icon: 'BookOpen' },
];

const CONVERGENCE_STEPS = [
  { id: 1, name: 'GateEngine', desc: 'Évaluation SOIC 9 dimensions', icon: 'BarChart3', color: '#00d4ff' },
  { id: 2, name: 'Converger', desc: 'Décision: ACCEPT / ITERATE / ABORT', icon: 'GitBranch', color: '#ffaa00' },
  { id: 3, name: 'FeedbackRouter', desc: 'Feedback correctif priorisé (D4/D8 first)', icon: 'Target', color: '#ff3366' },
  { id: 4, name: 'Claude CLI', desc: 'Réexécution agent avec feedback injecté', icon: 'Terminal', color: '#a855f7' },
  { id: 5, name: 'RunStore', desc: 'Persistence du run (soic-gates.json)', icon: 'Fingerprint', color: '#00ff88' },
];

const CONVERGENCE_DECISIONS = [
  { id: 'ACCEPT', condition: 'μ ≥ target (8.5) ET pas de dim bloquante', color: T.primary, icon: 'CheckCircle' },
  { id: 'ITERATE', condition: 'μ < target ET itérations < max (4)', color: T.warning, icon: 'RotateCw' },
  { id: 'ABORT_PLATEAU', condition: 'Δμ < 0.2 entre 2 itérations consécutives', color: T.accent, icon: 'XCircle' },
  { id: 'ABORT_MAX_ITER', condition: 'itérations ≥ max (4)', color: T.accent, icon: 'XCircle' },
  { id: 'ABORT_LOW_COVERAGE', condition: 'Couverture gates < 50%', color: T.accent, icon: 'XCircle' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — Navigation views
// ═══════════════════════════════════════════════════════════════════════════════

const VIEWS = [
  { id: 'overview',    name: 'Overview',     icon: 'LayoutDashboard' },
  { id: 'phases',      name: 'Phases',       icon: 'Layers' },
  { id: 'soic',        name: 'SOIC Engine',  icon: 'BarChart3' },
  { id: 'convergence', name: 'Convergence',  icon: 'RotateCw' },
  { id: 'gates',       name: 'Gates',        icon: 'ShieldCheck' },
  { id: 'compliance',  name: 'Compliance',   icon: 'Scale' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ICON MAP — String → Component
// ═══════════════════════════════════════════════════════════════════════════════

const ICON_MAP = {
  Shield, Zap, Eye, Lock, FileCode, Search, Palette, FileText, Hammer,
  CheckCircle, AlertTriangle, XCircle, ChevronRight, ChevronDown, Globe,
  Code2, BarChart3, ArrowRight, Play, RotateCw, Target, Activity, Terminal,
  Cpu, LayoutDashboard, Layers, ShieldCheck, Menu, X, ExternalLink,
  Gauge, GitBranch, Settings, Radio, MonitorCheck, Bug, Fingerprint,
  Scale, Cookie, BookOpen, Gavel, CircleDot, Filter,
};

const DynIcon = ({ name, size = 16, ...props }) => {
  const Comp = ICON_MAP[name] || CircleDot;
  return <Comp size={size} {...props} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// CORE SOIC CALCULATION — TODO(human)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcule la moyenne pondérée μ SOIC et détermine la décision.
 *
 * @param {Object} scores - Scores par dimension { D1: 8.5, D2: 7.0, ... D9: 9.0 }
 * @returns {{ mu: number, decision: string, blocked: boolean, blockingDims: string[] }}
 *
 * Exigences :
 * - Appliquer les poids (weights) de DIMENSIONS
 * - Vérifier les dimensions bloquantes (D4, D8) : si < 7.0 → blocked
 * - Calculer μ = somme(score_i × weight_i) / somme(weight_i)
 * - Décision : ACCEPT (μ ≥ 8.5 ET !blocked), ITERATE (μ ≥ 6.0 ET !blocked), ABORT sinon
 * - Retourner { mu, decision, blocked, blockingDims }
 */
function calculateMu(scores) {
  // TODO(human): Implémenter le calcul pondéré avec logique de blocage
  // Placeholder — moyenne simple sans poids ni blocage
  const values = Object.values(scores);
  const mu = values.reduce((sum, v) => sum + v, 0) / values.length;
  return {
    mu: Math.round(mu * 100) / 100,
    decision: mu >= 8.5 ? 'ACCEPT' : mu >= 6.0 ? 'ITERATE' : 'ABORT',
    blocked: false,
    blockingDims: [],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES — Keyframes, Scanlines, Fonts
// ═══════════════════════════════════════════════════════════════════════════════

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 10px rgba(0,255,136,0.2); }
        50% { box-shadow: 0 0 25px rgba(0,255,136,0.5), 0 0 50px rgba(0,255,136,0.15); }
      }
      @keyframes dataflow {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes scanmove {
        0% { top: -5%; }
        100% { top: 105%; }
      }
      @keyframes countup {
        from { opacity: 0.5; }
        to { opacity: 1; }
      }
      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(1px, -1px); }
        60% { transform: translate(-1px, -1px); }
        80% { transform: translate(1px, 1px); }
      }

      .nexos-dashboard {
        font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
        background: ${T.bg};
        color: ${T.text};
        min-height: 100vh;
      }
      .nexos-dashboard * { box-sizing: border-box; }
      .nexos-dashboard h1, .nexos-dashboard h2, .nexos-dashboard h3 {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
      }

      .scanline-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 2px,
          rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px
        );
        pointer-events: none; z-index: 9998;
      }
      .scanline-bar {
        position: fixed; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, transparent, rgba(0,255,136,0.06), transparent);
        pointer-events: none; z-index: 9999;
        animation: scanmove 8s linear infinite;
      }

      .grid-bg {
        background-image:
          linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px);
        background-size: 50px 50px;
      }

      .view-enter { animation: fadeIn 0.35s ease-out; }

      .nexos-dashboard ::-webkit-scrollbar { width: 6px; }
      .nexos-dashboard ::-webkit-scrollbar-track { background: ${T.bg}; }
      .nexos-dashboard ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
      .nexos-dashboard ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,136,0.3); }

      .connector-flow {
        background: linear-gradient(90deg, transparent 0%, ${T.primary} 50%, transparent 100%);
        background-size: 200% 100%;
        animation: dataflow 2s linear infinite;
      }
    `}</style>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MICRO COMPONENTS — Panel, Badge, etc.
// ═══════════════════════════════════════════════════════════════════════════════

function Panel({ children, glow, glowColor = T.primary, style = {}, className = '' }) {
  const base = {
    background: T.surface,
    border: `1px solid ${glow ? `rgba(${hexToRgb(glowColor)},0.25)` : T.border}`,
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
    transition: 'all 0.3s ease-out',
    ...(glow ? { boxShadow: T.glow(glowColor) } : {}),
    ...style,
  };
  return <div style={base} className={className}>{children}</div>;
}

function CornerAccents({ color = T.primary, size = 10 }) {
  const style = (pos) => ({
    position: 'absolute', width: size, height: size,
    borderColor: `rgba(${hexToRgb(color)},0.4)`,
    borderStyle: 'solid', borderWidth: 0,
    ...pos,
  });
  return (
    <>
      <span style={style({ top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1 })} />
      <span style={style({ top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1 })} />
      <span style={style({ bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1 })} />
      <span style={style({ bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1 })} />
    </>
  );
}

function NeonBadge({ label, color = T.primary, small = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: small ? '2px 6px' : '3px 10px',
      background: `rgba(${hexToRgb(color)},0.1)`,
      border: `1px solid rgba(${hexToRgb(color)},0.3)`,
      borderRadius: 4, fontSize: small ? '0.65rem' : '0.7rem',
      color, fontWeight: 500, letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
}

function StatusDot({ status = 'pass', size = 8 }) {
  const colors = { pass: T.primary, fail: T.accent, warn: T.warning, idle: T.textMuted };
  const c = colors[status] || colors.idle;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: c, boxShadow: `0 0 6px ${c}`,
      animation: status === 'fail' ? 'blink 1.5s ease-in-out infinite' : 'none',
    }} />
  );
}

function MuDisplay({ mu, size = 'lg' }) {
  const color = mu >= 8.5 ? T.primary : mu >= 7.0 ? T.warning : T.accent;
  const fontSize = size === 'lg' ? '2.5rem' : size === 'md' ? '1.5rem' : '1rem';
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
      fontSize, color, textShadow: `0 0 20px rgba(${hexToRgb(color)},0.5)`,
      animation: 'countup 0.3s ease-out',
    }}>
      μ = {mu.toFixed(2)}
    </span>
  );
}

function SectionTitle({ children, icon, color = T.primary }) {
  return (
    <h2 style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: '1.1rem', color, margin: '0 0 16px 0',
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      {icon && <DynIcon name={icon} size={18} />}
      {children}
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(${hexToRgb(color)},0.3), transparent)`, marginLeft: 8 }} />
    </h2>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR — Navigation + Logo
// ═══════════════════════════════════════════════════════════════════════════════

function Sidebar({ activeView, onViewChange, open, onToggle }) {
  const totalAgents = PHASES.reduce((sum, p) => sum + p.agents.length, 0);
  return (
    <>
      {/* Mobile toggle */}
      <button onClick={onToggle} style={{
        position: 'fixed', top: 12, left: 12, zIndex: 1001,
        background: T.surface, border: T.borderGlow(T.primary),
        borderRadius: 6, padding: 8, color: T.primary, cursor: 'pointer',
        display: open ? 'none' : 'flex',
      }} aria-label="Ouvrir menu">
        <Menu size={20} />
      </button>

      {/* Sidebar panel */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 220, background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        zIndex: 1000,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-out',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 12px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: '1.3rem', color: T.primary,
            textShadow: `0 0 20px rgba(${hexToRgb(T.primary)},0.4)`,
            letterSpacing: '0.15em',
          }}>
            NEXOS
          </div>
          <div style={{ fontSize: '0.6rem', color: T.textDim, letterSpacing: '0.1em', marginTop: 2 }}>
            v3.0 │ PIPELINE AUTONOME
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {VIEWS.map(v => {
            const active = activeView === v.id;
            return (
              <button key={v.id} onClick={() => onViewChange(v.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 6, border: 'none',
                background: active ? `rgba(${hexToRgb(T.primary)},0.1)` : 'transparent',
                color: active ? T.primary : T.textDim,
                cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit',
                transition: 'all 0.2s ease-out', textAlign: 'left', width: '100%',
                borderLeft: active ? `2px solid ${T.primary}` : '2px solid transparent',
              }}
              aria-label={`Naviguer vers ${v.name}`}
              aria-current={active ? 'page' : undefined}
              >
                <DynIcon name={v.icon} size={16} />
                {v.name}
              </button>
            );
          })}
        </nav>

        {/* Stats */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${T.border}`, fontSize: '0.65rem', color: T.textDim }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Agents</span><span style={{ color: T.primary }}>{totalAgents}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Dimensions</span><span style={{ color: T.secondary }}>9</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Gates</span><span style={{ color: T.warning }}>{GATES.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Loi 25 checks</span><span style={{ color: T.accent }}>{LAW25_CHECKS.length}</span>
          </div>
        </div>

        {/* Close on mobile */}
        <button onClick={onToggle} style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', color: T.textDim, cursor: 'pointer',
        }} aria-label="Fermer menu">
          <X size={16} />
        </button>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 1 — Overview (Pipeline + Metrics + Modes)
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewView({ onNavigate }) {
  const [expandedPhase, setExpandedPhase] = useState(null);

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionTitle icon="LayoutDashboard" color={T.primary}>Pipeline Principal</SectionTitle>

      {/* Pipeline Flow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '8px 0' }}>
        {PHASES.map((phase, i) => (
          <React.Fragment key={phase.id}>
            {/* Phase Node */}
            <button
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              style={{
                minWidth: 140, padding: '16px 14px', borderRadius: 8,
                background: T.surface, border: `1px solid rgba(${hexToRgb(phase.color)},0.3)`,
                cursor: 'pointer', transition: 'all 0.3s ease-out', position: 'relative',
                boxShadow: expandedPhase === phase.id ? T.glowStrong(phase.color) : T.glow(phase.color, 0.1),
                animation: expandedPhase === phase.id ? 'pulse 2s ease-in-out infinite' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                fontFamily: 'inherit', color: T.text,
              }}
              aria-label={`Phase ${phase.id}: ${phase.name}`}
              aria-expanded={expandedPhase === phase.id}
            >
              <CornerAccents color={phase.color} />
              <DynIcon name={phase.icon} size={22} style={{ color: phase.color }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: phase.color }}>{phase.name}</div>
              <div style={{ fontSize: '0.65rem', color: T.textDim }}>{phase.id.toUpperCase()}</div>
              <div style={{
                fontSize: '0.6rem', padding: '2px 6px', borderRadius: 3,
                background: `rgba(${hexToRgb(phase.color)},0.15)`, color: phase.color,
              }}>
                {phase.agents.length} agents
              </div>
              <div style={{ fontSize: '0.6rem', color: T.textDim }}>
                {phase.thresholdLabel} │ {phase.timeout}
              </div>
            </button>

            {/* Connector */}
            {i < PHASES.length - 1 && (
              <div style={{
                width: 40, height: 2, flexShrink: 0, position: 'relative',
              }}>
                <div className="connector-flow" style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: 1,
                }} />
                <ArrowRight size={12} style={{
                  position: 'absolute', top: -5, right: -2, color: T.primary, opacity: 0.5,
                }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Expanded Phase Detail */}
      {expandedPhase && (() => {
        const phase = PHASES.find(p => p.id === expandedPhase);
        return (
          <Panel glow glowColor={phase.color} style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <CornerAccents color={phase.color} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div>
                <h3 style={{ color: phase.color, fontSize: '1rem', margin: 0 }}>
                  {phase.id.toUpperCase()} — {phase.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: T.textDim, margin: '4px 0 0' }}>{phase.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <NeonBadge label={phase.thresholdLabel} color={phase.color} />
                <NeonBadge label={phase.timeout} color={T.textDim} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {phase.agents.map(a => (
                <div key={a.name} style={{
                  padding: '8px 10px', borderRadius: 6,
                  background: `rgba(${hexToRgb(phase.color)},0.05)`,
                  border: `1px solid rgba(${hexToRgb(phase.color)},0.1)`,
                  fontSize: '0.72rem',
                }}>
                  <div style={{ color: phase.color, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ color: T.textDim, fontSize: '0.65rem', marginTop: 2 }}>{a.role}</div>
                </div>
              ))}
            </div>
          </Panel>
        );
      })()}

      {/* Metrics Bar */}
      <SectionTitle icon="BarChart3" color={T.secondary}>Métriques Globales</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {[
          { label: 'Agents', value: PHASES.reduce((s, p) => s + p.agents.length, 0), color: T.primary },
          { label: 'Phases', value: 6, color: T.secondary },
          { label: 'Dimensions', value: 9, color: '#a855f7' },
          { label: 'Gates', value: GATES.length, color: T.warning },
          { label: 'Outils CLI', value: 6, color: T.accent },
          { label: 'Templates', value: 15, color: '#ff6b35' },
          { label: 'Checks Loi 25', value: LAW25_CHECKS.length, color: '#00d4ff' },
          { label: 'Lignes Python', value: '~5.5K', color: T.textDim },
        ].map(m => (
          <Panel key={m.label} style={{ textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.6rem', color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
              {m.label}
            </div>
          </Panel>
        ))}
      </div>

      {/* Modes */}
      <SectionTitle icon="Settings" color={T.warning}>Modes d'Opération</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {MODES.map(m => (
          <Panel key={m.id} style={{ padding: 12, cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <DynIcon name={m.icon} size={16} style={{ color: T.primary }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: T.primary }}>{m.name}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: T.textDim, marginBottom: 4 }}>{m.desc}</div>
            <NeonBadge label={m.phases} color={T.secondary} small />
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 2 — Phase Explorer
// ═══════════════════════════════════════════════════════════════════════════════

function PhaseExplorerView() {
  const [selectedPhase, setSelectedPhase] = useState('ph0');
  const phase = PHASES.find(p => p.id === selectedPhase);

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle icon="Layers" color={T.secondary}>Phase Explorer</SectionTitle>

      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
        {PHASES.map(p => (
          <button key={p.id} onClick={() => setSelectedPhase(p.id)} style={{
            padding: '8px 16px', borderRadius: '6px 6px 0 0', border: 'none',
            background: selectedPhase === p.id ? `rgba(${hexToRgb(p.color)},0.15)` : T.surface,
            borderBottom: selectedPhase === p.id ? `2px solid ${p.color}` : `2px solid ${T.border}`,
            color: selectedPhase === p.id ? p.color : T.textDim,
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem',
            fontWeight: selectedPhase === p.id ? 600 : 400,
            transition: 'all 0.2s ease-out',
          }}
          aria-label={`Sélectionner ${p.name}`}
          aria-selected={selectedPhase === p.id}
          role="tab"
          >
            <DynIcon name={p.icon} size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            {p.name}
          </button>
        ))}
      </div>

      {/* Phase detail */}
      <Panel glow glowColor={phase.color}>
        <CornerAccents color={phase.color} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, color: phase.color, fontSize: '1.2rem' }}>
              {phase.id.toUpperCase()} — {phase.name}
            </h3>
            <p style={{ margin: '6px 0 0', color: T.textDim, fontSize: '0.78rem' }}>{phase.description}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <NeonBadge label={phase.thresholdLabel} color={phase.color} />
            <NeonBadge label={`⏱ ${phase.timeout}`} color={T.textDim} />
            <NeonBadge label={`${phase.agents.length} agents`} color={T.secondary} />
          </div>
        </div>

        {/* Agent flow */}
        <div style={{ fontSize: '0.7rem', color: T.textDim, marginBottom: 10, letterSpacing: '0.05em' }}>
          AGENTS PIPELINE :
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {phase.agents.map((agent, i) => (
            <div key={agent.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 6,
              background: `rgba(${hexToRgb(phase.color)},0.04)`,
              border: `1px solid rgba(${hexToRgb(phase.color)},0.1)`,
              transition: 'all 0.2s ease-out',
            }}>
              {/* Index */}
              <span style={{
                width: 24, height: 24, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
                background: `rgba(${hexToRgb(phase.color)},0.15)`, color: phase.color,
                fontWeight: 600, flexShrink: 0,
              }}>
                {i + 1}
              </span>
              {/* Agent info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: phase.color, fontSize: '0.8rem' }}>{agent.name}</div>
                <div style={{ color: T.textDim, fontSize: '0.68rem', marginTop: 2 }}>{agent.role}</div>
              </div>
              {/* Arrow to next */}
              {i < phase.agents.length - 1 && (
                <ChevronRight size={14} style={{ color: T.textMuted }} />
              )}
            </div>
          ))}
        </div>

        {/* Phase I/O */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div style={{
            padding: 10, borderRadius: 6, background: `rgba(${hexToRgb(T.secondary)},0.05)`,
            border: `1px solid rgba(${hexToRgb(T.secondary)},0.1)`,
          }}>
            <div style={{ fontSize: '0.65rem', color: T.secondary, fontWeight: 600, marginBottom: 6, letterSpacing: '0.08em' }}>
              INPUT
            </div>
            <div style={{ fontSize: '0.7rem', color: T.textDim }}>
              {phase.id === 'ph0' ? 'brief-client.json / URL site existant' :
               `${PHASES[PHASES.findIndex(p => p.id === phase.id) - 1]?.id}-report.md + SOIC gate PASS`}
            </div>
          </div>
          <div style={{
            padding: 10, borderRadius: 6, background: `rgba(${hexToRgb(T.primary)},0.05)`,
            border: `1px solid rgba(${hexToRgb(T.primary)},0.1)`,
          }}>
            <div style={{ fontSize: '0.65rem', color: T.primary, fontWeight: 600, marginBottom: 6, letterSpacing: '0.08em' }}>
              OUTPUT
            </div>
            <div style={{ fontSize: '0.7rem', color: T.textDim }}>
              {phase.id === 'ph5' ? 'Site déployé Vercel + ph5-qa-report.md' :
               phase.id === 'ph4' ? 'Build Next.js validé + ph4-build-log.md' :
               `${phase.id}-report.md → SOIC gate evaluation`}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 3 — SOIC Engine (Radar + Sliders + μ Gauge + Decision)
// ═══════════════════════════════════════════════════════════════════════════════

function SOICEngineView({ scores, onScoresChange, onNavigateGates }) {
  const soicResult = useMemo(() => calculateMu(scores), [scores]);

  const radarData = useMemo(() =>
    DIMENSIONS.map(d => ({
      dimension: d.shortName,
      score: scores[d.id],
      fullMark: 10,
      weight: d.weight,
      blocking: d.blocking,
    })),
    [scores]
  );

  const decisionColors = { ACCEPT: T.primary, ITERATE: T.warning, ABORT: T.accent };

  const handleSliderChange = useCallback((dimId, value) => {
    onScoresChange(prev => ({ ...prev, [dimId]: parseFloat(value) }));
  }, [onScoresChange]);

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle icon="BarChart3" color={T.secondary}>SOIC Engine — 9 Dimensions</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Radar Chart */}
        <Panel glow glowColor={T.secondary}>
          <CornerAccents color={T.secondary} />
          <div style={{ fontSize: '0.7rem', color: T.textDim, marginBottom: 8, letterSpacing: '0.08em' }}>
            RADAR CHART — SCORES PAR DIMENSION
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(0,255,136,0.08)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={({ x, y, payload }) => {
                  const dim = DIMENSIONS.find(d => d.shortName === payload.value);
                  const col = dim?.blocking ? T.accent : T.textDim;
                  return (
                    <text x={x} y={y} textAnchor="middle" fill={col}
                      style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace" }}>
                      {payload.value}
                      {dim?.blocking ? ' ⚠' : ''}
                    </text>
                  );
                }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: T.textMuted, fontSize: 9 }}
                stroke="rgba(0,255,136,0.05)" />
              <Radar name="Score" dataKey="score" stroke={T.primary} fill={T.primary}
                fillOpacity={0.12} strokeWidth={2} dot={{ r: 3, fill: T.primary }} />
              <Tooltip
                contentStyle={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem',
                }}
                itemStyle={{ color: T.primary }}
                labelStyle={{ color: T.text }}
                formatter={(value, name, props) => {
                  const dim = DIMENSIONS.find(d => d.shortName === props.payload.dimension);
                  return [`${value}/10 (×${dim?.weight})`, dim?.name];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Sliders + μ + Decision */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* μ Gauge */}
          <Panel glow glowColor={decisionColors[soicResult.decision]} style={{ textAlign: 'center', padding: 20 }}>
            <CornerAccents color={decisionColors[soicResult.decision]} />
            <MuDisplay mu={soicResult.mu} size="lg" />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <NeonBadge
                label={soicResult.decision}
                color={decisionColors[soicResult.decision]}
              />
              {soicResult.blocked && (
                <NeonBadge label={`BLOQUÉ: ${soicResult.blockingDims.join(', ')}`} color={T.accent} />
              )}
            </div>
            {/* Mini threshold bar */}
            <div style={{ marginTop: 14, position: 'relative', height: 6, background: T.bg, borderRadius: 3 }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 3,
                width: `${Math.min(soicResult.mu / 10 * 100, 100)}%`,
                background: `linear-gradient(90deg, ${T.accent}, ${T.warning}, ${T.primary})`,
                transition: 'width 0.5s ease-out',
              }} />
              {/* Threshold markers */}
              {[7.0, 8.0, 8.5].map(t => (
                <div key={t} style={{
                  position: 'absolute', top: -3, left: `${t / 10 * 100}%`,
                  width: 1, height: 12, background: 'rgba(255,255,255,0.3)',
                }} title={`Seuil μ=${t}`} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.55rem', color: T.textMuted }}>
              <span>0</span><span>7.0</span><span>8.0</span><span>8.5</span><span>10</span>
            </div>
          </Panel>

          {/* Dimension Sliders */}
          <Panel style={{ maxHeight: 350, overflowY: 'auto' }}>
            <div style={{ fontSize: '0.7rem', color: T.textDim, marginBottom: 10, letterSpacing: '0.08em' }}>
              AJUSTER LES SCORES
            </div>
            {DIMENSIONS.map(dim => {
              const score = scores[dim.id];
              const isLow = dim.blocking && score < 7.0;
              const color = isLow ? T.accent : dim.blocking ? T.warning : T.primary;
              return (
                <div key={dim.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.7rem', color, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <DynIcon name={dim.icon} size={12} />
                      {dim.id} {dim.name}
                      {dim.blocking && <span style={{ color: T.accent, fontSize: '0.6rem' }}>●BLOQUANT</span>}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color, fontFamily: "'JetBrains Mono'" }}>
                      {score.toFixed(1)} <span style={{ fontSize: '0.55rem', color: T.textMuted }}>×{dim.weight}</span>
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="10" step="0.1" value={score}
                    onChange={e => handleSliderChange(dim.id, e.target.value)}
                    aria-label={`Score ${dim.name}`}
                    style={{
                      width: '100%', height: 4, appearance: 'none', background: T.bg,
                      borderRadius: 2, outline: 'none', cursor: 'pointer',
                      accentColor: color,
                    }}
                  />
                  {isLow && (
                    <div style={{ fontSize: '0.6rem', color: T.accent, marginTop: 2, animation: 'blink 1.5s infinite' }}>
                      ⚠ Score &lt; 7.0 → DÉPLOIEMENT BLOQUÉ
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={() => onNavigateGates(null)} style={{
              width: '100%', padding: '8px', marginTop: 8, border: `1px solid rgba(${hexToRgb(T.secondary)},0.3)`,
              background: `rgba(${hexToRgb(T.secondary)},0.05)`, color: T.secondary,
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem',
            }}>
              Voir les Quality Gates →
            </button>
          </Panel>
        </div>
      </div>

      {/* Dimension detail cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {DIMENSIONS.map(dim => {
          const score = scores[dim.id];
          const relatedGates = GATES.filter(g => g.dim === dim.id);
          const color = dim.blocking && score < 7.0 ? T.accent : dim.blocking ? T.warning : T.primary;
          return (
            <Panel key={dim.id} style={{ padding: 12, cursor: 'pointer' }}
              glow={dim.blocking} glowColor={color}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <DynIcon name={dim.icon} size={16} style={{ color }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color }}>{dim.id}</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color, fontFamily: "'JetBrains Mono'" }}>
                  {score.toFixed(1)}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: T.text, marginBottom: 4 }}>{dim.name}</div>
              <div style={{ fontSize: '0.6rem', color: T.textDim }}>
                Poids ×{dim.weight} │ {relatedGates.length} gates │ {dim.blocking ? 'BLOQUANT' : 'Non-bloquant'}
              </div>
              {dim.blocking && (
                <div style={{
                  marginTop: 6, padding: '3px 6px', borderRadius: 3, fontSize: '0.6rem',
                  background: `rgba(${hexToRgb(T.accent)},0.1)`, color: T.accent,
                  textAlign: 'center',
                }}>
                  Seuil minimum : 7.0 pour déploiement
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 4 — Convergence Loop
// ═══════════════════════════════════════════════════════════════════════════════

function ConvergenceView() {
  const [activeStep, setActiveStep] = useState(0);
  const [iteration, setIteration] = useState(1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const startSimulation = useCallback(() => {
    setRunning(true);
    setActiveStep(0);
    setIteration(1);
  }, []);

  const stopSimulation = useCallback(() => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= CONVERGENCE_STEPS.length - 1) {
          setIteration(iter => {
            if (iter >= 4) { setRunning(false); return 4; }
            return iter + 1;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timerRef.current);
  }, [running]);

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle icon="RotateCw" color={T.warning}>Boucle de Convergence</SectionTitle>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={running ? stopSimulation : startSimulation} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: running ? `rgba(${hexToRgb(T.accent)},0.15)` : `rgba(${hexToRgb(T.primary)},0.15)`,
          border: `1px solid ${running ? T.accent : T.primary}`,
          color: running ? T.accent : T.primary, borderRadius: 6, cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '0.78rem',
        }} aria-label={running ? 'Arrêter simulation' : 'Démarrer simulation'}>
          {running ? <X size={14} /> : <Play size={14} />}
          {running ? 'Arrêter' : 'Simuler'}
        </button>
        <div style={{ fontSize: '0.8rem', color: T.warning, fontFamily: "'JetBrains Mono'" }}>
          Itération {iteration}/4
        </div>
        {/* Iteration dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i <= iteration ? T.primary : T.border,
              boxShadow: i === iteration && running ? `0 0 8px ${T.primary}` : 'none',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Loop Diagram */}
      <Panel glow glowColor={T.warning}>
        <CornerAccents color={T.warning} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CONVERGENCE_STEPS.map((step, i) => {
            const isActive = running && i === activeStep;
            const isPast = running && i < activeStep;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 8, border: 'none',
                    background: isActive ? `rgba(${hexToRgb(step.color)},0.12)` : 'transparent',
                    boxShadow: isActive ? T.glow(step.color) : 'none',
                    cursor: 'pointer', fontFamily: 'inherit', color: T.text,
                    transition: 'all 0.3s ease-out', textAlign: 'left',
                    animation: isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    opacity: isPast ? 0.5 : 1,
                  }}
                  aria-label={`Étape ${step.id}: ${step.name}`}
                >
                  {/* Step number */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: `2px solid ${isActive ? step.color : T.border}`,
                    background: isActive ? `rgba(${hexToRgb(step.color)},0.1)` : T.bg,
                    color: isActive ? step.color : T.textDim,
                    transition: 'all 0.3s',
                  }}>
                    <DynIcon name={step.icon} size={16} />
                  </div>
                  {/* Step info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.85rem', fontWeight: 600,
                      color: isActive ? step.color : T.text,
                    }}>
                      {step.id}. {step.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: T.textDim, marginTop: 2 }}>{step.desc}</div>
                  </div>
                  {isActive && <StatusDot status="pass" />}
                </button>
                {/* Connector line */}
                {i < CONVERGENCE_STEPS.length - 1 && (
                  <div style={{
                    marginLeft: 33, width: 2, height: 16,
                    background: isPast ? step.color : T.border,
                    transition: 'background 0.3s',
                  }} />
                )}
              </React.Fragment>
            );
          })}
          {/* Loop back arrow */}
          <div style={{
            marginLeft: 16, marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 6,
            background: `rgba(${hexToRgb(T.warning)},0.05)`,
            border: `1px dashed rgba(${hexToRgb(T.warning)},0.2)`,
          }}>
            <RotateCw size={14} style={{ color: T.warning }} />
            <span style={{ fontSize: '0.7rem', color: T.warning }}>
              Retour à l'étape 1 si ITERATE (max 4 itérations, timeout 15 min)
            </span>
          </div>
        </div>
      </Panel>

      {/* Decision Tree */}
      <SectionTitle icon="GitBranch" color={T.accent}>Arbre de Décision</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {CONVERGENCE_DECISIONS.map(d => (
          <Panel key={d.id} glow glowColor={d.color} style={{ padding: 12 }}>
            <CornerAccents color={d.color} size={8} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <DynIcon name={d.icon} size={18} style={{ color: d.color }} />
              <span style={{
                fontWeight: 700, fontSize: '0.9rem', color: d.color,
                fontFamily: "'JetBrains Mono'",
              }}>
                {d.id}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: T.textDim }}>{d.condition}</div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 5 — Quality Gates
// ═══════════════════════════════════════════════════════════════════════════════

function GatesView({ gateFilter, onGateFilterChange, scores }) {
  const [expandedGate, setExpandedGate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [gateStatuses, setGateStatuses] = useState(() =>
    Object.fromEntries(GATES.map(g => [g.id, Math.random() > 0.3 ? 'pass' : 'fail']))
  );

  const toggleGate = useCallback((gateId) => {
    setGateStatuses(prev => ({
      ...prev,
      [gateId]: prev[gateId] === 'pass' ? 'fail' : 'pass',
    }));
  }, []);

  const filteredGates = useMemo(() => {
    return GATES.filter(g => {
      if (gateFilter && g.dim !== gateFilter) return false;
      if (statusFilter === 'pass' && gateStatuses[g.id] !== 'pass') return false;
      if (statusFilter === 'fail' && gateStatuses[g.id] !== 'fail') return false;
      return true;
    });
  }, [gateFilter, statusFilter, gateStatuses]);

  const passCount = GATES.filter(g => gateStatuses[g.id] === 'pass').length;

  const priorityColors = {
    'Bloquant': T.accent, 'Critique': T.accent, 'Haute': T.warning, 'Moyenne': T.secondary,
  };

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionTitle icon="ShieldCheck" color={T.warning}>
        Quality Gates — {passCount}/{GATES.length} PASS
      </SectionTitle>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} style={{ color: T.textDim }} />
        {/* Dimension filter */}
        <button onClick={() => onGateFilterChange(null)} style={{
          padding: '4px 10px', borderRadius: 4, border: `1px solid ${!gateFilter ? T.primary : T.border}`,
          background: !gateFilter ? `rgba(${hexToRgb(T.primary)},0.1)` : 'transparent',
          color: !gateFilter ? T.primary : T.textDim, cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '0.68rem',
        }}>Toutes</button>
        {DIMENSIONS.map(d => {
          const active = gateFilter === d.id;
          return (
            <button key={d.id} onClick={() => onGateFilterChange(active ? null : d.id)} style={{
              padding: '4px 10px', borderRadius: 4,
              border: `1px solid ${active ? T.secondary : T.border}`,
              background: active ? `rgba(${hexToRgb(T.secondary)},0.1)` : 'transparent',
              color: active ? T.secondary : T.textDim, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.68rem',
            }}>{d.id}</button>
          );
        })}
        <span style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />
        {/* Status filter */}
        {['all', 'pass', 'fail'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '4px 10px', borderRadius: 4,
            border: `1px solid ${statusFilter === s ? T.primary : T.border}`,
            background: statusFilter === s ? `rgba(${hexToRgb(T.primary)},0.1)` : 'transparent',
            color: statusFilter === s ? T.primary : T.textDim, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.68rem',
          }}>{s === 'all' ? 'Tous' : s.toUpperCase()}</button>
        ))}
      </div>

      {/* Gate progress bar */}
      <div style={{ position: 'relative', height: 8, background: T.bg, borderRadius: 4 }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 4,
          width: `${passCount / GATES.length * 100}%`,
          background: `linear-gradient(90deg, ${T.primary}, ${T.secondary})`,
          transition: 'width 0.5s ease-out',
        }} />
      </div>

      {/* Gates list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredGates.map(gate => {
          const status = gateStatuses[gate.id];
          const expanded = expandedGate === gate.id;
          const dim = DIMENSIONS.find(d => d.id === gate.dim);
          const prioColor = priorityColors[gate.priority] || T.textDim;

          return (
            <div key={gate.id} style={{
              borderRadius: 6, overflow: 'hidden',
              border: `1px solid ${status === 'fail' && (gate.priority === 'Bloquant' || gate.priority === 'Critique')
                ? `rgba(${hexToRgb(T.accent)},0.3)` : T.border}`,
              transition: 'all 0.2s',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', cursor: 'pointer',
                background: expanded ? `rgba(${hexToRgb(T.primary)},0.03)` : T.surface,
              }}
                onClick={() => setExpandedGate(expanded ? null : gate.id)}
                role="button" aria-expanded={expanded}
                aria-label={`Gate ${gate.id}: ${gate.name}`}
              >
                {/* Toggle status */}
                <button onClick={e => { e.stopPropagation(); toggleGate(gate.id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                  aria-label={`Basculer ${gate.id} (actuellement ${status})`}
                >
                  <StatusDot status={status} size={10} />
                </button>

                {/* Gate ID */}
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, color: T.secondary,
                  fontFamily: "'JetBrains Mono'", width: 48,
                }}>
                  {gate.id}
                </span>

                {/* Gate name */}
                <span style={{ flex: 1, fontSize: '0.78rem', color: status === 'fail' ? T.accent : T.text }}>
                  {gate.name}
                </span>

                {/* Dimension badge */}
                <NeonBadge label={gate.dim} color={dim?.blocking ? T.accent : T.secondary} small />

                {/* Priority */}
                <span style={{ fontSize: '0.62rem', color: prioColor, width: 65, textAlign: 'right' }}>
                  {gate.priority}
                </span>

                {/* Expand icon */}
                {expanded ? <ChevronDown size={14} style={{ color: T.textDim }} /> :
                  <ChevronRight size={14} style={{ color: T.textDim }} />}
              </div>

              {/* Expanded detail */}
              {expanded && (
                <div style={{
                  padding: '10px 14px 12px 48px', background: T.bg, fontSize: '0.72rem',
                  borderTop: `1px solid ${T.border}`, animation: 'fadeIn 0.2s ease-out',
                }}>
                  <div style={{ color: T.textDim, marginBottom: 6 }}>{gate.description}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <NeonBadge label={`Phase: ${gate.phase}`} color={T.textDim} small />
                    <NeonBadge label={`Dim: ${dim?.name}`} color={T.secondary} small />
                    {dim?.blocking && <NeonBadge label="BLOQUANT" color={T.accent} small />}
                    {scores && (
                      <NeonBadge
                        label={`Score ${gate.dim}: ${scores[gate.dim]?.toFixed(1)}`}
                        color={scores[gate.dim] >= 7.0 ? T.primary : T.accent}
                        small
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredGates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: T.textDim, fontSize: '0.8rem' }}>
          Aucune gate ne correspond aux filtres sélectionnés.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW 6 — Compliance (Tooling + Loi 25)
// ═══════════════════════════════════════════════════════════════════════════════

function ComplianceView() {
  const [checkStates, setCheckStates] = useState(() =>
    Object.fromEntries(LAW25_CHECKS.map(c => [c.id, false]))
  );
  const [expandedTool, setExpandedTool] = useState(null);

  const toggleCheck = useCallback((checkId) => {
    setCheckStates(prev => ({ ...prev, [checkId]: !prev[checkId] }));
  }, []);

  const passCount = useMemo(() =>
    LAW25_CHECKS.filter(c => checkStates[c.id]).length,
    [checkStates]
  );

  const criticalPass = useMemo(() => {
    const criticals = LAW25_CHECKS.filter(c => c.critical);
    return criticals.filter(c => checkStates[c.id]).length;
  }, [checkStates]);

  const totalCritical = LAW25_CHECKS.filter(c => c.critical).length;

  const d8Score = useMemo(() => {
    const ratio = passCount / LAW25_CHECKS.length;
    const criticalRatio = criticalPass / totalCritical;
    if (criticalRatio < 1.0) return Math.min(ratio * 6.9, 6.9);
    return ratio * 10;
  }, [passCount, criticalPass, totalCritical]);

  const d8Color = d8Score >= 7.0 ? T.primary : T.accent;

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tooling CLI */}
      <SectionTitle icon="Terminal" color={T.secondary}>Tooling CLI Preflight</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {TOOLS.map(tool => {
          const expanded = expandedTool === tool.id;
          return (
            <Panel key={tool.id} style={{ padding: 12, cursor: 'pointer' }}
              glow={expanded} glowColor={T.secondary}
              onClick={() => setExpandedTool(expanded ? null : tool.id)}>
              <CornerAccents color={T.secondary} size={8} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <DynIcon name={tool.icon} size={20} style={{ color: T.secondary }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: T.secondary }}>{tool.name}</div>
                  <div style={{ fontSize: '0.65rem', color: T.textDim }}>{tool.description}</div>
                </div>
              </div>
              {expanded && (
                <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                  <div style={{
                    padding: '8px 10px', borderRadius: 4, background: T.bg, marginBottom: 8,
                    fontFamily: "'JetBrains Mono'", fontSize: '0.68rem', color: T.primary,
                  }}>
                    $ {tool.cmd}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {tool.targets.map(t => <NeonBadge key={t} label={t} color={T.warning} small />)}
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>

      {/* Loi 25 */}
      <SectionTitle icon="Scale" color={T.accent}>Loi 25 Québec — Conformité</SectionTitle>

      {/* D8 Score Display */}
      <Panel glow glowColor={d8Color} style={{ textAlign: 'center', padding: 20 }}>
        <CornerAccents color={d8Color} />
        <div style={{
          fontSize: '0.7rem', color: T.textDim, marginBottom: 8, letterSpacing: '0.1em',
        }}>
          SCORE D8 — CONFORMITÉ
        </div>
        <div style={{
          fontSize: '2.2rem', fontWeight: 700, color: d8Color,
          fontFamily: "'JetBrains Mono'",
          textShadow: `0 0 20px rgba(${hexToRgb(d8Color)},0.5)`,
        }}>
          {d8Score.toFixed(1)}/10
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10 }}>
          <NeonBadge
            label={d8Score >= 7.0 ? 'DEPLOYABLE' : 'NON DEPLOYABLE'}
            color={d8Color}
          />
          <NeonBadge label={`${passCount}/${LAW25_CHECKS.length} checks`} color={T.secondary} />
          <NeonBadge label={`${criticalPass}/${totalCritical} critiques`} color={criticalPass === totalCritical ? T.primary : T.accent} />
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 14, position: 'relative', height: 6, background: T.bg, borderRadius: 3 }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 3,
            width: `${passCount / LAW25_CHECKS.length * 100}%`,
            background: d8Color, transition: 'all 0.3s ease-out',
          }} />
        </div>
      </Panel>

      {/* Checks by category */}
      {LAW25_CATEGORIES.map(cat => {
        const checks = LAW25_CHECKS.filter(c => c.cat === cat.id);
        const catPass = checks.filter(c => checkStates[c.id]).length;
        return (
          <Panel key={cat.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DynIcon name={cat.icon} size={16} style={{ color: cat.color }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: cat.color }}>{cat.name}</span>
              </div>
              <NeonBadge label={`${catPass}/${checks.length}`} color={catPass === checks.length ? T.primary : T.accent} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {checks.map(check => {
                const passed = checkStates[check.id];
                return (
                  <button key={check.id} onClick={() => toggleCheck(check.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 4, border: 'none',
                    background: passed ? `rgba(${hexToRgb(T.primary)},0.05)` : `rgba(${hexToRgb(T.accent)},0.03)`,
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    transition: 'all 0.2s', width: '100%',
                  }}
                  aria-label={`${check.name} — ${passed ? 'conforme' : 'non conforme'}`}
                  aria-pressed={passed}
                  >
                    {/* Toggle indicator */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      border: `1.5px solid ${passed ? T.primary : T.accent}`,
                      background: passed ? `rgba(${hexToRgb(T.primary)},0.2)` : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {passed && <CheckCircle size={12} style={{ color: T.primary }} />}
                    </div>
                    {/* Check info */}
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: '0.73rem',
                        color: passed ? T.text : T.textDim,
                        textDecoration: passed ? 'none' : 'none',
                      }}>
                        {check.name}
                      </span>
                    </div>
                    {/* ID + Critical */}
                    <span style={{ fontSize: '0.6rem', color: T.textMuted, fontFamily: "'JetBrains Mono'" }}>{check.id}</span>
                    {check.critical && (
                      <NeonBadge label="CRITIQUE" color={T.accent} small />
                    )}
                  </button>
                );
              })}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — NexosDashboard
// ═══════════════════════════════════════════════════════════════════════════════

export default function NexosDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gateFilter, setGateFilter] = useState(null);
  const [scores, setScores] = useState({
    D1: 8.5, D2: 7.8, D3: 8.0, D4: 9.2, D5: 8.3, D6: 8.7, D7: 8.1, D8: 7.5, D9: 8.6,
  });

  const navigateToGates = useCallback((dimension) => {
    setGateFilter(dimension);
    setActiveView('gates');
  }, []);

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView onNavigate={navigateToGates} />;
      case 'phases':
        return <PhaseExplorerView />;
      case 'soic':
        return <SOICEngineView scores={scores} onScoresChange={setScores} onNavigateGates={navigateToGates} />;
      case 'convergence':
        return <ConvergenceView />;
      case 'gates':
        return <GatesView gateFilter={gateFilter} onGateFilterChange={setGateFilter} scores={scores} />;
      case 'compliance':
        return <ComplianceView />;
      default:
        return <OverviewView onNavigate={navigateToGates} />;
    }
  };

  return (
    <div className="nexos-dashboard grid-bg" style={{ minHeight: '100vh', display: 'flex' }}>
      <GlobalStyles />
      <div className="scanline-overlay" />
      <div className="scanline-bar" />

      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <main style={{
        flex: 1, marginLeft: sidebarOpen ? 220 : 0,
        padding: '24px 28px', transition: 'margin-left 0.3s ease-out',
        maxWidth: '100%', overflowX: 'hidden',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 24, paddingBottom: 12,
          borderBottom: `1px solid ${T.border}`,
        }}>
          <div>
            <h1 style={{
              fontSize: '1.3rem', margin: 0, color: T.primary,
              letterSpacing: '0.1em',
              textShadow: `0 0 15px rgba(${hexToRgb(T.primary)},0.3)`,
            }}>
              {VIEWS.find(v => v.id === activeView)?.name || 'NEXOS'}
            </h1>
            <div style={{ fontSize: '0.65rem', color: T.textDim, marginTop: 2, letterSpacing: '0.05em' }}>
              NEXOS v3.0 │ PIPELINE WEB AUTONOME │ MARK SYSTEMS
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MuDisplay mu={calculateMu(scores).mu} size="sm" />
            <NeonBadge label={calculateMu(scores).decision} color={
              calculateMu(scores).decision === 'ACCEPT' ? T.primary :
              calculateMu(scores).decision === 'ITERATE' ? T.warning : T.accent
            } />
          </div>
        </div>

        {renderView()}

        {/* Footer */}
        <div style={{
          marginTop: 40, paddingTop: 16, borderTop: `1px solid ${T.border}`,
          fontSize: '0.6rem', color: T.textMuted, textAlign: 'center',
          letterSpacing: '0.08em',
        }}>
          NEXOS v3.0 │ 46 AGENTS │ 6 PHASES │ 9 DIMENSIONS SOIC │ 21 QUALITY GATES │ LOI 25 QUÉBEC
        </div>
      </main>
    </div>
  );
}
