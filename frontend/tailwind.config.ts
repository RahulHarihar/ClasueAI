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
        page: "#0e1117",
        demo: "#12151e",
        card: "#161a25",
        subcard: "#1a1f2c",
        border: "#282e3d",
      },
    },
  },
  plugins: [],
};

export default config;
