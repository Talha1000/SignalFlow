import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          900: "#0f172a",
          950: "#090d16",
        },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
        },
        accent: {
          500: "#6366f1",
          600: "#4f46e5",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "signal-ping": {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.15)", opacity: "0.3" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "signal-ping": "signal-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
