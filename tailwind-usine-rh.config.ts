// ──────────────────────────────────────────────────────────────────────
// NEXOS — Tailwind Config auto-générée depuis design-tokens.json
// Client  : usine-rh
// Archétype: corporate
// Mood    : industrial
// ⚠️  NE PAS ÉDITER MANUELLEMENT — regénérer via generate_tailwind.py
// ──────────────────────────────────────────────────────────────────────

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── COULEURS (design-tokens.colors) ─────────────────────────
      colors: {
        primary: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#b91c1c',
        600: '#991b1b',
        700: '#7f1d1d',
        800: '#5c1616',
        900: '#3b0f0f',
        950: '#1f0707',
        },
        secondary: {
        50: '#f8f6f4',
        100: '#e8e0d8',
        200: '#d4c4b0',
        300: '#bca68a',
        400: '#a8896a',
        500: '#8b6f50',
        600: '#735a3e',
        700: '#5c4632',
        800: '#4a3828',
        900: '#3d2f22',
        950: '#211912',
        },
        accent: {
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        },
        neutral: {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09',
        },
        background: '#1c1917',
        foreground: '#fafaf9',
        surface: '#292524',
        error: '#dc2626',
        success: '#16a34a',
        warning: '#f97316',
      },

      // ── TYPOGRAPHIE ─────────────────────────────────────────────
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
                xs: ['0.7875rem', { lineHeight: '1.6' }],
        sm: ['0.8875rem', { lineHeight: '1.6' }],
        base: ['1.0rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.55' }],
        xl: ['1.2625rem', { lineHeight: '1.5' }],
        2xl: ['1.425rem', { lineHeight: '1.45' }],
        3xl: ['1.6rem', { lineHeight: '1.4' }],
        4xl: ['1.8rem', { lineHeight: '1.35' }],
        5xl: ['2.025rem', { lineHeight: '1.3' }],
      },

      // ── ESPACEMENT ──────────────────────────────────────────────
      spacing: {
        'section-y': '8rem',
        'section-gap': '4rem',
      },
      maxWidth: {
        'container': '1400px',
        'content': '800px',
      },

      // ── BORDURES ────────────────────────────────────────────────
      borderRadius: {
        none: '0px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
        full: '9999px',
      },
      borderWidth: {
        DEFAULT: '2px',
      },

      // ── OMBRES ──────────────────────────────────────────────────
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,0.3)',
        md: '0 4px 16px rgba(0,0,0,0.4)',
        lg: '0 8px 32px rgba(0,0,0,0.5)',
        none: 'none',
      },

      // ── ANIMATIONS ──────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};

export default config;
