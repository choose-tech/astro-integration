import type { AstroConfig, AstroIntegration } from "astro";
import { githubDataIntegration } from "./integrations/github-data";
import { getIntegrationName } from "./utils";
import netlify from "@astrojs/netlify/functions";
import { vitePluginVirtualImports } from "./integrations/virtual-imports";
import type { GlobalIntegrationOptions } from "./types";
import { npmDataIntegration } from "./integrations/npm-data";
import tailwind from "@astrojs/tailwind";

export default function chooseTechIntegration(
  options: GlobalIntegrationOptions
): AstroIntegration {
  return {
    name: getIntegrationName("global"),
    hooks: {
      "astro:config:setup": async (...args) => {
        const { config, injectRoute, updateConfig } = args[0];

        injectRoute({
          pattern: "/",
          entryPoint: "@choose-tech/astro/pages/index.astro",
          prerender: false,
        });

        injectRoute({
          pattern: "/api/v1/categories.json",
          entryPoint: "@choose-tech/astro/pages/api/v1/categories.json.ts",
          prerender: true,
        });

        injectRoute({
          pattern: "/api/v1/libraries.json",
          entryPoint: "@choose-tech/astro/pages/api/v1/libraries.json.ts",
          prerender: true,
        });

        const newConfig: Partial<AstroConfig> = {
          site: "https://choose-tech.com",
          srcDir: new URL(".", config.root),
          base: options.base,
          trailingSlash: "always",
          output: "server",
          adapter: netlify(),
          vite: {
            plugins: [vitePluginVirtualImports(options, config)],
            ssr: {
              noExternal: [
                "@fontsource-variable/plus-jakarta-sans",
                "@fontsource-variable/jetbrains-mono",
              ],
              external: ["@choose-tech/collections"],
            },
          },
          integrations: [
            tailwind({
              configFile: "node_modules/@choose-tech/astro/tailwind.ts",
              applyBaseStyles: false,
            }),
            githubDataIntegration(),
            npmDataIntegration(),
          ],
        };

        updateConfig(newConfig);
      },
    },
  };
}
