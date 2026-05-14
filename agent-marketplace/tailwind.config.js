/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono:    ["var(--font-mono)",    "monospace"],
        body:    ["var(--font-body)",    "sans-serif"],
      },
      colors: {
        arc: {
          bg:      "#050810",
          surface: "#0a0f1e",
          card:    "#0d1428",
          border:  "#1a2444",
          accent:  "#00d4ff",
          green:   "#00ff94",
          amber:   "#ffb800",
          red:     "#ff4466",
          muted:   "#4a5580",
          text:    "#c8d8ff",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":      "float 6s ease-in-out infinite",
        "scan":       "scan 2s linear infinite",
        "glow":       "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%":   { boxShadow: "0 0 5px #00d4ff44, 0 0 10px #00d4ff22" },
          "100%": { boxShadow: "0 0 20px #00d4ff88, 0 0 40px #00d4ff44" },
        },
      },
    },
  },
  plugins: [],
};
