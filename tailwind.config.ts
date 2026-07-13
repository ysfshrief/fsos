import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: "#F8F4EC", dark: "#EDE7D9" },
        burgundy: { DEFAULT: "#6E1E2B", light: "#8B2535", dark: "#4A1219" },
        gold: { DEFAULT: "#C9A227", light: "#E4BE4A", pale: "#F5E9C4" },
      },
    },
  },
  plugins: [],
};
export default config;
