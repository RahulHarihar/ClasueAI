import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        card: "#1a1a1a",
        "card-border": "#2a2a2a",
        subtle: "#888888",
        clause: "#111111",
      },
    },
  },
  plugins: [],
};

export default config;
