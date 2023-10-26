import { defineConfig } from "astro/config";
import chooseTechIntegration from "@choose-tech/astro";

export default defineConfig({
  integrations: [
    chooseTechIntegration({
      base: "/js-libs",
      title: "JS Libraries",
      description: "Hand-picked comparisons for your next project.",
      color: "#F7DF1E",
      repo: "choose-tech/astro-integration",
      logoFilename: "logo.svg",
    }),
  ],
});
