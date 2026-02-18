// ──────────────────────────────────────────────────────────────────────
// NEXOS — Tailwind Config auto-générée depuis design-tokens.json
// Client  : plomberie-qc
// Archétype: artisan
// Mood    : organic
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
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#2563eb',
        600: '#1d4ed8',
        700: '#1e40af',
        800: '#1e3a8a',
        900: '#172554',
        950: '#0c1633',
        },
        secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#16a34a',
        600: '#15803d',
        700: '#166534',
        800: '#14532d',
        900: '#052e16',
        950: '#022c22',
        },
        accent: {
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        },
        neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
        },
        background: '#f9fafb',
        foreground: '#111827',
        surface: '#ffffff',
        error: '#dc2626',
        success: '#16a34a',
        warning: '#f59e0b',
      },

      // ── TYPOGRAPHIE ─────────────────────────────────────────────
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
                xs: ['0.7375rem', { lineHeight: '1.6' }],
        sm: ['0.8875rem', { lineHeight: '1.6' }],
        base: ['1.0625rem', { lineHeight: '1.6' }],
        lg: ['1.275rem', { lineHeight: '1.55' }],
        xl: ['1.5312rem', { lineHeight: '1.5' }],
        2xl: ['1.8375rem', { lineHeight: '1.45' }],
        3xl: ['2.2062rem', { lineHeight: '1.4' }],
        4xl: ['2.6437rem', { lineHeight: '1.35' }],
        5xl: ['3.175rem', { lineHeight: '1.3' }],
      },

      // ── ESPACEMENT ──────────────────────────────────────────────
      spacing: {
        'section-y': '5rem',
        'section-gap': '3rem',
      },
      maxWidth: {
        'container': '1200px',
        'content': '720px',
      },

      // ── BORDURES ────────────────────────────────────────────────
      borderRadius: {
        none: '0px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '28px',
        full: '9999px',
      },
      borderWidth: {
        DEFAULT: '1px',
      },

      // ── OMBRES ──────────────────────────────────────────────────
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.1)',
        lg: '0 8px 24px rgba(0,0,0,0.12)',
        none: 'none',
      },

      // ── ANIMATIONS ──────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
