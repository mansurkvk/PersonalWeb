import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// UI dili koyu, premium, kontrollu glass efektli ve teknik gorunumludur.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        space: "#05070d",
        panel: "rgba(10, 18, 32, 0.72)",
        cyanSoft: "#8bd3dd",
        electric: "#38bdf8",
        goldSoft: "#d5b46a"
      },
      boxShadow: {
        glow: "0 0 40px rgba(139, 211, 221, 0.22)",
        card: "0 24px 80px rgba(0, 0, 0, 0.34)"
      },
      backgroundImage: {
        "radial-cyan": "radial-gradient(circle at top, rgba(139,211,221,0.22), transparent 35%)",
        "grid-lines": "linear-gradient(rgba(139,211,221,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,211,221,0.08) 1px, transparent 1px)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: [typography]
};

export default config;
