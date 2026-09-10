import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F6",
        surface: "#FFFFFF",
        ink: "#2B2622",
        "ink-muted": "#8A8078",
        rosewood: {
          DEFAULT: "#9C6B63",
          dark: "#7D534C",
          light: "#C9A9A2",
        },
        sage: {
          DEFAULT: "#4A5043",
          light: "#8A9179",
        },
        line: "#E7E1DA",
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15" }],
        h1: ["2rem", { lineHeight: "1.2" }],
        h2: ["1.5rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
