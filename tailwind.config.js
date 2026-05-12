/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
      colors: {
        ylo: {
          bg: "#FFFFFF",
          surface: "#FAFAFA",
          ink: "#1C1B1A",
          "ink-soft": "#6B665E",
          border: "#E5E0D8",
          accent: "#47B5A8",
          pool: "#47B5A8",
          "pool-dark": "#1F5A55",
          fuchsia: "#EA5E86",
          poppy: "#F76F54",
          yellow: "#F7E289",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};