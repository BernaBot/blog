import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pared: "#ddd4bd",
        zocalo: "#6f7d63",
        "zocalo-oscuro": "#586353",
        piso: "#c7b797",
        tinta: "#2a271f",
        yeso: "#efe9d8",
        salida: "#4f7a52",
        expediente: "#8a3b2f"
      },
      fontFamily: {
        display: ["var(--font-caslon-display)", "serif"],
        texto: ["var(--font-caslon-text)", "serif"],
        clinico: ["var(--font-plex-mono)", "monospace"]
      }
    },
  },
  plugins: [],
};
export default config;
