// /** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin")

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,css}"],
  safelist: [
    {
      pattern: /glass(-dark|-white)?/,
    },
    "text-color-primary",
    "text-color-secondary",
    "bg-color-primary",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#FF9933", // Deep Saffron / Kesari
        maroon: "#7A1E2E", // Royal Maroon
        indigo: "#2B1E4A", // Cosmic Indigo
        gold: "#D4AF37", // Sacred Gold
        ash: "#F5F3EF", // Ash White
        smoke: "#B9B3A9", // Temple Smoke Gray
        emerald: "#1F7A63", // Emerald Green
        "cosmic-dark": "#150B2B", // Dark Cosmic Background

        // Mapping to functional names for compatibility/clarity
        "color-primary": "#FF9933", // Saffron
        "color-secondary": "#D4AF37", // Gold
        "color-background": "#150B2B", // Dark Cosmic
        "color-text-primary": "#F5F3EF", // Ash White
        "color-text-secondary": "#B9B3A9", // Smoke
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        subheading: ['"Cinzel"', "serif"],
        body: ['"Inter"', "sans-serif"],
        sanskrit: ['"Noto Serif Devanagari"', "serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      zIndex: {
        "-1": "-1",
      },
      animation: {
        fadeInUp: "fadeInUp 0.4s ease-out forwards",
        fadeOutDown: "fadeOutDown 0.4s ease-in forwards",
        "spin-slow": "spin 12s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOutDown: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(20px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, addUtilities }) {
      addComponents({
        ".glass": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "1rem",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        },
        ".glass-dark": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 30px rgba(255, 255, 255, 0.05)",
        },
        ".glass-white": {
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        },
      })

      addUtilities({
        ".text-color-primary": {
          color: "#CA8A04",
        },
        ".text-color-secondary": {
          color: "#FFFFFF",
        },
        ".bg-color-primary": {
          backgroundColor: "#1A092A",
        },
      })
    }),
  ],
}
