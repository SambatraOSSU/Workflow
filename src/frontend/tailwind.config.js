/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#000a24",
        "primary-container": "#14213d",
        "on-primary": "#ffffff",
        "on-primary-container": "#7c89aa",
        "primary-fixed": "#d9e2ff",
        "primary-fixed-dim": "#b9c6ea",
        "on-primary-fixed": "#0d1b36",
        "on-primary-fixed-variant": "#3a4664",
        "inverse-primary": "#b9c6ea",

        "secondary": "#855300",
        "secondary-container": "#fca311",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#684000",
        "secondary-fixed": "#ffddb8",
        "secondary-fixed-dim": "#ffb95f",
        "on-secondary-fixed": "#2a1700",
        "on-secondary-fixed-variant": "#653e00",

        "tertiary": "#130900",
        "tertiary-container": "#321d00",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#a58359",
        "tertiary-fixed": "#ffddb6",
        "tertiary-fixed-dim": "#e7c092",
        "on-tertiary-fixed": "#2a1800",
        "on-tertiary-fixed-variant": "#5c421e",

        "surface": "#f9f9f9",
        "surface-bright": "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-variant": "#e2e2e2",
        "surface-tint": "#525e7d",

        "on-surface": "#1a1c1c",
        "on-surface-variant": "#45464d",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",

        "outline": "#75777e",
        "outline-variant": "#c5c6ce",

        "background": "#f9f9f9",
        "on-background": "#1a1c1c",

        "noir-text": "#000000",
        "pure-white": "#ffffff",

        "success": "#10B981",
        "warning": "#F59E0B",
        "error": "#EF4444",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "info": "#3B82F6",
        "disabled": "#9CA3AF"
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1rem",
        "space-xl": "1.5rem",
        "space-2xl": "2rem",
        "space-3xl": "2.5rem",
        "space-4xl": "3rem",
        "space-5xl": "4rem",
        "gutter": "1rem",
        "gutter-lg": "1.5rem",
        "margin": "1rem",
        "margin-md": "1.5rem",
        "margin-lg": "2rem"
      }
    },
  },
  plugins: [],
}
