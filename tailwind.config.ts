import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // O_Cubed brand palette (muted terracotta / clay)
        bg: "#FBF6EE",
        ink: "#2E211A",
        rust: "#A85D34",
        "rust-dark": "#8F4A28",
        label: "#995230",
        "brown-soft": "#B07434",
        muted: "#6E5B4C",
        muted2: "#57463A",
        clay: "#C08A4A",
        "clay-hover": "#CE9A5C",
        "clay-light": "#D6A874",
        cream2: "#F1E7D3",
        offwhite: "#FFFDF9",
        "footer-bg": "#1B1410",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "serif"],
        sans: ["var(--font-jost)", "sans-serif"],
        script: ["var(--font-sacramento)", "cursive"],
      },
      keyframes: {
        kenburns: {
          from: { transform: "scale(1.05)" },
          to: { transform: "scale(1.16)" },
        },
        ocmarquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        kenburns: "kenburns 22s ease-in-out infinite alternate",
        ocmarquee: "ocmarquee 34s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
