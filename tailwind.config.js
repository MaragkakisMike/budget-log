/** @type {import('tailwindcss').Config} */
import { COLORS, SPACING, TEXT_SIZES } from "./src/theme";

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: COLORS,
      spacing: SPACING,
      fontSize: TEXT_SIZES,
    },
  },
  plugins: [],
};
