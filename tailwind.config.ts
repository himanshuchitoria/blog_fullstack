import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // enable dark mode via `dark` class on <html>
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // optional brand helpers for gradients you used
        brand: {
          indigo: "#4f46e5",
          emerald: "#059669",
        },
      },
    },
  },
  plugins: [],
};
export default config;
