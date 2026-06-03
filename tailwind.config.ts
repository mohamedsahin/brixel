import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#0E5C5A", 700: "#0A4745", 300: "#5FA39F" },
        amber: { DEFAULT: "#F5A524", 600: "#E0940F", text: "#5A3606" },
        aqua: { DEFAULT: "#3AA89C", soft: "#D6ECE8" },
        ink: { DEFAULT: "#14242A", soft: "#46585E", faint: "#7A8A8F" },
        mist: { DEFAULT: "#E4EFEC", deep: "#D4E6E1" },
        cloud: "#F6FAF9",
        line: "#DCE8E4",
        wa: "#25D366",
      },
      fontFamily: {
        head: ["var(--font-head)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        ar: ["var(--font-ar)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,36,42,.06), 0 2px 6px rgba(20,36,42,.05)",
        card: "0 6px 22px -8px rgba(14,92,90,.18), 0 2px 8px rgba(20,36,42,.05)",
        lift: "0 24px 60px -22px rgba(14,92,90,.34)",
      },
      keyframes: {
        floaty: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(-16px,20px) scale(1.06)" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        brickpop: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.18)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        draw: { to: { strokeDashoffset: "0" } },
      },
      animation: {
        floaty: "floaty 9s ease-in-out infinite alternate",
        bob: "bob 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
    // Safe-area padding utilities for notch / home-indicator devices
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".pb-safe": { paddingBottom: "env(safe-area-inset-bottom, 1.75rem)" },
        ".pt-safe": { paddingTop: "env(safe-area-inset-top, 0px)" },
      });
    },
  ],
};

export default config;
