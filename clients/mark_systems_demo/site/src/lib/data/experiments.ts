import type { Experiment } from '@/types';

export const experiments: Experiment[] = [
  {
    slug: 'animated-card',
    category: 'ui',
    title: 'Animated Card',
    description:
      'Card component with layered hover effects, tilt on mouse, and spring entry animation.',
    status: 'stable',
    createdAt: '2026-03-12',
    updatedAt: '2026-04-02',
    author: 'Mark Systems',
    bundleSizeKb: 4.2,
    themeSupport: ['minimalist', 'bento', 'glassmorphism', 'cyberpunk'],
    tags: ['card', 'hover', 'animation'],
    pricingTier: 'free',
  },
  {
    slug: 'bento-grid',
    category: 'layout',
    title: 'Bento Grid',
    description:
      'Asymmetric 12-column grid with featured cards spanning multiple rows.',
    status: 'stable',
    createdAt: '2026-02-28',
    updatedAt: '2026-03-30',
    author: 'Mark Systems',
    bundleSizeKb: 2.1,
    themeSupport: ['minimalist', 'bento', 'cyberpunk'],
    tags: ['grid', 'layout', 'bento'],
    pricingTier: 'free',
  },
  {
    slug: 'command-palette',
    category: 'navigation',
    title: 'Command Palette',
    description:
      'CMD+K palette with fuzzy search, recent items and keyboard navigation.',
    status: 'beta',
    createdAt: '2026-03-20',
    updatedAt: '2026-04-05',
    author: 'Mark Systems',
    bundleSizeKb: 6.8,
    themeSupport: ['minimalist', 'glassmorphism', 'cyberpunk'],
    tags: ['search', 'keyboard', 'palette'],
    pricingTier: 'pro',
  },
  {
    slug: 'glow-button',
    category: 'ui',
    title: 'Glow Button',
    description:
      'Interactive button with neon border glow and cursor trail effect.',
    status: 'stable',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-22',
    author: 'Mark Systems',
    bundleSizeKb: 3.4,
    themeSupport: ['cyberpunk', 'glassmorphism'],
    tags: ['button', 'glow', 'neon'],
    pricingTier: 'free',
  },
  {
    slug: 'data-chart',
    category: 'dataViz',
    title: 'Data Chart',
    description:
      'Responsive line and bar chart with theme-aware colors and smooth transitions.',
    status: 'beta',
    createdAt: '2026-03-15',
    updatedAt: '2026-04-01',
    author: 'Mark Systems',
    bundleSizeKb: 18.5,
    themeSupport: ['minimalist', 'bento'],
    tags: ['chart', 'data', 'visualization'],
    pricingTier: 'pro',
  },
  {
    slug: 'form-wizard',
    category: 'forms',
    title: 'Form Wizard',
    description:
      'Multi-step form with progress indicator, validation, and autosave.',
    status: 'draft',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-08',
    author: 'Mark Systems',
    bundleSizeKb: 12.3,
    themeSupport: ['minimalist'],
    tags: ['form', 'wizard', 'multi-step'],
    pricingTier: 'enterprise',
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}

export function getExperimentsByCategory(
  category: Experiment['category']
): Experiment[] {
  return experiments.filter((e) => e.category === category);
}

export function getExperimentStats() {
  return {
    total: experiments.length,
    stable: experiments.filter((e) => e.status === 'stable').length,
    beta: experiments.filter((e) => e.status === 'beta').length,
    draft: experiments.filter((e) => e.status === 'draft').length,
  };
}
