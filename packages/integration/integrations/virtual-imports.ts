import type { AstroConfig, ViteUserConfig } from "astro";
import type { GlobalIntegrationOptions } from "../types";

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
  return `\0${id}`;
}

export const vitePluginVirtualImports = (
  options: GlobalIntegrationOptions,
  { root, srcDir }: Pick<AstroConfig, "root" | "srcDir">
): NonNullable<ViteUserConfig["plugins"]>[number] => {

  const modules = {
    "virtual:choose-tech/options": `export default ${JSON.stringify(options)}`,
    "virtual:choose-tech/project-context": `export default ${JSON.stringify({
      root,
      srcDir,
    })}`,
  } satisfies Record<string, string>;

  /** Mapping names prefixed with `\0` to their original form. */
  const resolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: "vite-plugin-choose-tech-virtual-imports",
    resolveId(id): string | void {
      if (id in modules) return resolveVirtualModuleId(id);
    },
    load(id): string | void {
      const resolution = resolutionMap[id];
      if (resolution) return modules[resolution];
    },
  };
};
