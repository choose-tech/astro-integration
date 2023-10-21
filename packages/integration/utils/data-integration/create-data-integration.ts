import type { AstroIntegration } from "astro";
import type { createDataFetcher } from "./data-fetcher";

export const createDataIntegration = ({
  name,
  setup,
}: {
  name: string;
  setup: ReturnType<typeof createDataFetcher>["setup"];
}): AstroIntegration => ({
  name,
  hooks: {
    "astro:config:setup": async ({ logger }) => {
      const { run } = setup({ logger });

      await run();
    },
    "astro:server:setup": async ({ server, logger }) => {
      const { handleFile } = setup({ logger });

      server.watcher.on("all", async (eventName, path) => {
        if (!["add", "change"].includes(eventName)) return;

        await handleFile(path);
      });
    },
  },
});
