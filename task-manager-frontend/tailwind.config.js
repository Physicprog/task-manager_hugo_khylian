export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",

        surface: "var(--color-surface)",
        text: "var(--font-color)",
        gray: "var(--gray)",
        grayLight: "var(--gray-light)",
        white: "var(--white)",
        success: "var(--green)",
        danger: "var(--red)",
        navbar: "var(--navbar-color)",
        accent1: "var(--color-accent-main)",
        accentMain: "var(--color-accent-main)",
        accentLight: "var(--color-accent-light)",


        label: {
          red: "var(--label-red)",
          blue: "var(--label-blue)",
          green: "var(--label-green)",
          yellow: "var(--label-yellow)",
          purple: "var(--label-purple)",
          orange: "var(--label-orange)",
          pink: "var(--label-pink)",
        },
      },

      fontFamily: {
        museo: ["Museosans", "sans-serif"],
      },

      animation: {
        upDown: "upDown 1.6s ease-in-out infinite",
        fadeOut: "fadeOut 0.6s ease-out forwards",
        scaleIN: "scaleIN 0.3s ease-in-out forwards",
        scaleOUT: "scaleOUT 0.3s ease-in-out forwards",
        hoverScale: "hoverScale 0.3s ease-in-out",
        activeScale: "activeScale 0.3s ease-in-out",
      },

      keyframes: {
        upDown: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0)" },
        },

        fadeOut: {
          "0%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { opacity: "0" },
        },

        scaleIN: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },

        scaleOUT: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },

        hoverScale: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },

        activeScale: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.95)" },
        },

      },

      boxShadow: {
        long: "4px 4px 0 var(--white)",
        longFocus: "4px 5px 0 var(--white)",
        buttonLight: "0 2px 6px rgba(0,0,0,0.15)",
        buttonDark: "0 4px 12px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};