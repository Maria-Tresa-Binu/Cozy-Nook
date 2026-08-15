/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: "#7E998A",
        cream: "#FAF6EE",
        slate: {
          nook: "#1E292B",
        },
        amber: {
          nook: "#E0A458",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"VT323"', "monospace"],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scaleY(1) translateY(0)" },
          "50%": { transform: "scaleY(1.06) translateY(-1px)" },
        },
        tailsway: {
          "0%, 100%": { transform: "rotate(-14deg)" },
          "50%": { transform: "rotate(16deg)" },
        },
        bubble: {
          "0%": { opacity: "0", transform: "translateY(4px) scale(0.9)" },
          "25%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "75%": { opacity: "1", transform: "translateY(-3px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-8px) scale(0.95)" },
        },
        rainfall: {
          "0%": { transform: "translateY(-20%)" },
          "100%": { transform: "translateY(120%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        tailsway: "tailsway 1.6s ease-in-out infinite",
        bubble: "bubble 3s ease-in-out infinite",
        rainfall: "rainfall 1.1s linear infinite",
        flicker: "flicker 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
