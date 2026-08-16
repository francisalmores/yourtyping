/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12182B",
        inkdeep: "#0B0F1D",
        paper: "#F3ECDD",
        brass: "#E8A33D",
        rust: "#C1502E",
        sage: "#6FA287",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
