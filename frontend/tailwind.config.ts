import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'DM Serif Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        page: "#0c0c0c",
        demo: "#0f0f0f",
        card: "#141414",
        border: "#1e1e1e",
      },
    },
  },
  plugins: [],
};

export default config;
