import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEXOS: Palette Vertex PMO — Structure dynamique, précision énergique
        cobalt: {
          50: "#EEF2FB",
          100: "#D5DDF5",
          200: "#ABBBEB",
          300: "#8199E1",
          400: "#5777D7",
          500: "#2E5BBA",
          600: "#254A97",
          700: "#1C3872",
          800: "#13264D",
          900: "#0A1428",
        },
        orange: {
          50: "#FDF2EC",
          100: "#FADFD0",
          200: "#F5BFA1",
          300: "#F09F72",
          400: "#EC8A4F",
          500: "#E8732A",
          600: "#C45E1F",
          700: "#964818",
          800: "#683211",
          900: "#3A1C09",
        },
        success: {
          50: "#EBF5ED",
          100: "#CEE8D3",
          200: "#9DD1A7",
          300: "#6CBA7B",
          400: "#4BA85F",
          500: "#34A853",
          600: "#2A8743",
          700: "#206533",
          800: "#164423",
          900: "#0C2213",
        },
        slate: {
          50: "#FFFFFF",
          100: "#F4F5F7",
          200: "#E8EAF0",
          300: "#D1D5DE",
          400: "#B0B7C7",
          500: "#8892A6",
          600: "#6B7280",
          700: "#4B5563",
          800: "#374151",
          900: "#1F2937",
        },
        charcoal: {
          DEFAULT: "#1F2937",
          light: "#374151",
          dark: "#111827",
        },
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-source-sans)", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-left": "fade-in-left 0.6s ease-out forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "draw-line": "draw-line 2s ease-out forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(rgba(46,91,186,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,91,186,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
