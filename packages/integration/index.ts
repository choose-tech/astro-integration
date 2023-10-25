import type { AstroConfig, AstroIntegration } from "astro";
import { githubDataIntegration } from "./integrations/github-data";
import { getIntegrationName } from "./utils";
import vercel from "@astrojs/vercel/serverless";
import { vitePluginVirtualImports } from "./integrations/virtual-imports";
import type { GlobalIntegrationOptions } from "./types";
import { npmDataIntegration } from "./integrations/npm-data";

export default function chooseTechIntegration(
  options: GlobalIntegrationOptions
): AstroIntegration {
  return {
    name: getIntegrationName("global"),
    hooks: {
      "astro:config:setup": ({ config, injectRoute, updateConfig }) => {
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
          srcDir: new URL(".", config.root),
          base: options.base,
          trailingSlash: "always",
          output: "server",
          adapter: vercel(),
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
          integrations: [githubDataIntegration(), npmDataIntegration()],
        };

        updateConfig(newConfig);
      },
    },
  };
}
