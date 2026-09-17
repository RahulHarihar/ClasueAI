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
        demo: "#0e0e0e",
        card: "#141414",
        subcard: "#181818",
        border: "#242422",
        gold: {
          DEFAULT: "#c5a059",
          light: "#dfbe82",
          dark: "#8f7034",
        },
        parchment: {
          DEFAULT: "#f0ede8",
          muted: "#d4d0c7",
          dim: "#9e998e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
