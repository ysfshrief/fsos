import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // New "Engraved Heritage" palette
        pine: { DEFAULT: "#1B3A2F", light: "#2C5443", dark: "#122A21", deep: "#0E211A" },
        brass: { DEFAULT: "#B08D2E", light: "#D4B14E", pale: "#EBDCA9", wash: "#F5EDD6" },
        parchment: { DEFAULT: "#F5F0E4", warm: "#FBF9F3", dark: "#E9E1CE" },
        ink: { DEFAULT: "#1C2620", muted: "#5C665F" },
        // Legacy aliases so existing pages still compile
        ivory: { DEFAULT: "#F5F0E4", dark: "#E9E1CE" },
        burgundy: { DEFAULT: "#1B3A2F", light: "#2C5443", dark: "#122A21" },
        gold: { DEFAULT: "#B08D2E", light: "#D4B14E", pale: "#F5EDD6" },
      },
      fontFamily: {
        display: ['"Amiri"', '"Playfair Display"', "serif"],
        body: ['"Rubik"', '"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
