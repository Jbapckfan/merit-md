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
        merit: {
          bg: "#0c0a14",
          card: "#15111e",
          "card-hover": "#1c1729",
          accent: "#4f8ff7",
          "accent-hover": "#6ba1ff",
          text: "#e5e2ff",
          "text-muted": "#9490b0",
          border: "#2a2440",
          "border-hover": "#3d3660",
          success: "#22c55e",
          warning: "#eab308",
          danger: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
