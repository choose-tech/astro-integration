import type { AstroUserConfig } from "astro/config";
import type { GlobalIntegrationOptions } from "./types";
import type { AstroConfig } from "astro";
import { githubDataIntegration } from "./integrations/github-data";
import { getIntegrationName } from "./utils";
import netlify from "@astrojs/netlify/functions";
import { vitePluginVirtualImports } from "./integrations/virtual-imports";
import { npmDataIntegration } from "./integrations/npm-data";
import tailwind from "@astrojs/tailwind";

export const defineConfig = (
  options: GlobalIntegrationOptions
): AstroUserConfig => {
  return {
    site: `https://${options.name}.choose-tech.com`,
    srcDir: ".",
    base: "/",
    trailingSlash: "always",
    output: "server",
    adapter: netlify(),
    vite: {
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
      {
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
              vite: {
                plugins: [vitePluginVirtualImports(options, config)],
              },
            };

            updateConfig(newConfig);
          },
        },
      },
      githubDataIntegration(),
      npmDataIntegration(),
    ],
  };
};
