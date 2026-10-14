/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#F97316",
          soft: "#FDBA74",
        },
        charcoal: {
          700: "#3A3A3A",
          900: "#1C1C1C",
        },
        navy: {
          950: "#070B1F",
          900: "#0B1437",
          800: "#131C4A",
          700: "#1D2A66",
        },
        violet: {
          DEFAULT: "#7C3AED",
          soft: "#8B5CF6",
        },
        sky: {
          glow: "#60A5FA",
        },
      },
      fontFamily: {
        display: ["Archivo Black", "Arial Black", "ui-sans-serif", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(11, 20, 55, 0.15)",
        lift: "0 18px 45px -15px rgba(124, 58, 237, 0.35)",
        card: "0 4px 24px -6px rgba(11, 20, 55, 0.12)",
      },
      backgroundImage: {
        "hero-grad": "linear-gradient(135deg, #0B1437 0%, #131C4A 55%, #2A1E6E 100%)",
        "brand-grad": "linear-gradient(90deg, #60A5FA 0%, #7C3AED 60%, #A78BFA 100%)",
        "text-grad": "linear-gradient(90deg, #60A5FA, #A78BFA)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        pulseSlow: "pulseSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
