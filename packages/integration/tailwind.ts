import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

export const chooseTechPreset: import("tailwindcss").Config = {
  content: [
    "./node_modules/@choose-tech/astro/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  safelist: [
    {
      pattern:
        /(bg|text)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-400/,
    },
    {
      pattern:
        /bg-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-950/,
      variants: ["hover"],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        gray: colors.slate,
        primary: colors.amber,
        secondary: colors.emerald,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
