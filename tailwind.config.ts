import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
        corporate: {
          bg: "#121212",
          card: "#1e2224",
          surface: "#252a2b",
          border: "rgba(255, 255, 255, 0.12)",
          lightBg: "#f7f7f7",
          lightCard: "#ffffff",
          lightSurface: "#f0f2f3",
          lightBorder: "rgba(18, 18, 18, 0.12)",
          cyan: "#38b6ff",
          cyanNeon: "#34feff",
          gold: "#f2be01",
          coral: "#ff914d",
          teal: "#007b7c",
        },
        surface: {
          50: "#f7f7f7",
          100: "#f0f2f3",
          200: "#e2e4e6",
          800: "#252a2b",
          900: "#1e2224",
          950: "#121212",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38b6ff",
          500: "#0284c7",
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
          900: "#082f49",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Inter", "-apple-system", "sans-serif"],
        dosis: ["var(--font-dosis)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
