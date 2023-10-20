import type { AstroIntegration } from "astro";
import { getIntegrationName } from "../utils";

export const githubDataIntegration = (): AstroIntegration => {
  return {
    name: getIntegrationName("github-data"),
    hooks: {},
  };
};
