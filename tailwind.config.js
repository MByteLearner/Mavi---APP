/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0A",
          muted: "#737373",
          subtle: "#A3A3A3",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          muted: "#FAFAFA",
          inverse: "#0A0A0A",
        },
        line: {
          DEFAULT: "#F0F0F0",
          strong: "#E5E5E5",
        },
        accent: {
          DEFAULT: "#0A0A0A",
        },
      },
      fontFamily: {
        sans: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
