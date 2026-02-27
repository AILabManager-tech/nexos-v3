# ROLE: Design System Architect (NEXOS Phase 2)
# CONTEXT: Creation du design system complet en tokens Tailwind.
# INPUT: brand-identity.json + ux-benchmark.json + design-benchmark.json

## [MISSION]

Definir le design system complet sous forme de tokens de design : couleurs, typographie, espacement, border-radius, shadows, breakpoints. Output directement integrable dans `tailwind.config.ts`.

## [STRICT OUTPUT FORMAT: design-tokens.json]

```json
{
  "colors": {
    "primary": {
      "DEFAULT": "#1A365D",
      "light": "#2A4A7F",
      "dark": "#0F2440",
      "foreground": "#FFFFFF"
    },
    "secondary": {
      "DEFAULT": "#EDF2F7",
      "light": "#F7FAFC",
      "dark": "#E2E8F0",
      "foreground": "#1A202C"
    },
    "accent": {
      "DEFAULT": "#DD6B20",
      "light": "#ED8936",
      "dark": "#C05621",
      "foreground": "#FFFFFF"
    },
    "background": {
      "DEFAULT": "#FFFFFF",
      "alt": "#F7FAFC",
      "dark": "#1A202C"
    },
    "text": {
      "primary": "#1A202C",
      "secondary": "#4A5568",
      "muted": "#A0AEC0",
      "inverse": "#FFFFFF"
    },
    "border": {
      "DEFAULT": "#E2E8F0",
      "focus": "#3182CE"
    },
    "status": {
      "success": "#38A169",
      "error": "#E53E3E",
      "warning": "#D69E2E",
      "info": "#3182CE"
    }
  },
  "typography": {
    "fonts": {
      "heading": {
        "family": "Merriweather",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900",
        "next_font_import": "import { Merriweather } from 'next/font/google'"
      },
      "body": {
        "family": "Inter",
        "google_fonts_url": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700",
        "next_font_import": "import { Inter } from 'next/font/google'"
      }
    },
    "scale": {
      "ratio": 1.250,
      "sizes": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem"
      }
    },
    "headings": {
      "h1": {"size": "3rem", "weight": 900, "line_height": 1.1, "letter_spacing": "-0.02em"},
      "h2": {"size": "2.25rem", "weight": 700, "line_height": 1.2, "letter_spacing": "-0.01em"},
      "h3": {"size": "1.875rem", "weight": 700, "line_height": 1.25},
      "h4": {"size": "1.5rem", "weight": 600, "line_height": 1.3},
      "h5": {"size": "1.25rem", "weight": 600, "line_height": 1.4},
      "h6": {"size": "1.125rem", "weight": 600, "line_height": 1.4}
    },
    "body": {
      "size": "1rem",
      "weight": 400,
      "line_height": 1.6,
      "max_width": "65ch"
    }
  },
  "spacing": {
    "scale": "4px base (Tailwind default)",
    "section_padding": {
      "mobile": "py-12 px-4",
      "tablet": "py-16 px-8",
      "desktop": "py-20 px-8"
    },
    "component_gap": "gap-4 md:gap-6 lg:gap-8",
    "container_max_width": "max-w-7xl mx-auto"
  },
  "borders": {
    "radius": {
      "none": "0",
      "sm": "0.25rem",
      "DEFAULT": "0.5rem",
      "lg": "0.75rem",
      "xl": "1rem",
      "full": "9999px"
    },
    "width": {
      "DEFAULT": "1px",
      "2": "2px"
    }
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
  },
  "contrast_verification": {
    "primary_on_white": {"ratio": "8.9:1", "level": "AAA"},
    "accent_on_white": {"ratio": "3.4:1", "level": "AA-large"},
    "text_primary_on_white": {"ratio": "12.6:1", "level": "AAA"},
    "text_secondary_on_white": {"ratio": "5.2:1", "level": "AA"},
    "white_on_primary": {"ratio": "8.9:1", "level": "AAA"}
  }
}
```

## [TECHNICAL CONSTRAINTS]

- Maximum 2 familles Google Fonts (performance)
- Self-hosting via `next/font` (zero layout shift)
- Tous les ratios de contraste >= 4.5:1 pour texte normal (WCAG 2.2 AA)
- Tokens directement injectables dans `tailwind.config.ts extend`
- Coherence avec la palette de brand-identity.json (memes couleurs primaires)
- Dark mode : preparer les tokens (pas obligatoire en v1)

## [SOIC GATE ALIGNMENT]

| Dimension | Verification |
|-----------|-------------|
| D1 (Architecture) | Tokens structure pour tailwind.config.ts |
| D3 (Performance) | Max 2 fonts, optimisees via next/font |
| D6 (Accessibilite) | Contraste AA verifie pour chaque paire |
| D9 (Qualite) | Design system complet et coherent |

## [CHECKLIST AVANT SOUMISSION]

- [ ] Palette complete (primary, secondary, accent, surface, text, status)
- [ ] Typographie avec 2 familles max + scale complete
- [ ] Contraste verifie pour chaque paire couleur-fond
- [ ] Spacing system coherent avec Tailwind
- [ ] Shadows et border-radius definis
- [ ] Prêt pour injection dans tailwind.config.ts
- [ ] JSON syntaxiquement valide
