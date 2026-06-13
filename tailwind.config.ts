import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        partselect: {
          "brand-teal": {
            DEFAULT: "#3C767D",
            dark: "#2d585e",
            light: "#4a8a92",
          },
          orange: {
            DEFAULT: "#F8991D",
            dark: "#d97f0a",
            light: "#fab04d",
          },
          teal: {
            DEFAULT: "#016984",
            dark: "#014d63",
            light: "#0289ad",
          },
          green: {
            DEFAULT: "#7ab800",
            dark: "#5f8f00",
            light: "#8dc63f",
          },
          gray: {
            50: "#f7f8f9",
            100: "#eef0f2",
            200: "#d8dde2",
            600: "#5c6670",
            900: "#1a1f24",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
