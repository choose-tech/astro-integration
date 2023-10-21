import { defineConfig } from "astro/config";
import chooseTechIntegration from "@choose-tech/astro";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  // TODO: move to integration
  srcDir: ".",
  integrations: [
    tailwind(),
    chooseTechIntegration({
      base: "/js-libs",
      title: "JS Libs",
      description: "Hand-picked comparisons for your next project.",
      color: "#F7DF1E",
      repo: "choose-tech/astro-integration"
    }),
  ],
});
