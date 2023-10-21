import fsp from "node:fs/promises";
import {
  ensureDirExists,
  isPathInsideDirectory,
  readRecursiveDir,
  doesFileExist,
} from "./node";
import path from "node:path";
import type { AstroIntegrationLogger } from "astro";

export const createDataFetcher = ({
  sourceCollectionPath,
  destinationCollectionPath,
  getEntrySlugs,
  fetchData: _fetchData,
}: {
  sourceCollectionPath: string;
  destinationCollectionPath: string;
  getEntrySlugs: (fileContent: any) => Array<string>;
  fetchData: (slug: string) => Promise<string>;
}) => {
  return {
    setup: ({ logger }: { logger: AstroIntegrationLogger }) => {
      const fetchData = async (...args: Parameters<typeof _fetchData>) => {
        const result = await _fetchData(...args);
        logger.info(`Fetched ${args[0]}`);
        return result;
      };

      const saveEntry = async ({
        filePath,
        content,
      }: {
        filePath: string;
        content: string;
      }) => {
        await ensureDirExists(filePath);
        await fsp.writeFile(filePath, content, "utf-8");
      };

      const run = async () => {
        await fsp.rm(destinationCollectionPath, {
          recursive: true,
          force: true,
        });
        await ensureDirExists(destinationCollectionPath);

        const filenames = await readRecursiveDir(sourceCollectionPath);

        const slugs = await Promise.all(
          filenames.map(async (filename) =>
            getEntrySlugs(
              JSON.parse(
                await fsp.readFile(
                  path.join(sourceCollectionPath, filename),
                  "utf-8"
                )
              )
            )
          )
        ).then((r) => r.flat());

        for (const slug of slugs) {
          const content = await fetchData(slug);
          const filePath = path.join(destinationCollectionPath, `${slug}.json`);

          await saveEntry({ filePath, content });
        }

        logger.info("Done");
      };

      const handleFile = async (filePath: string) => {
        if (path.extname(filePath) === "") return;
        const inDir = isPathInsideDirectory(filePath, sourceCollectionPath);
        if (!inDir) return;

        try {
          const slugs = getEntrySlugs(
            JSON.parse(await fsp.readFile(filePath, "utf-8"))
          );

          for (const slug of slugs) {
            const _filePath = path.join(
              destinationCollectionPath,
              `${slug}.json`
            );

            const exists = await doesFileExist(_filePath);
            if (exists) {
              logger.info(`File already exists, skipping`);
              return;
            }

            const content = await fetchData(slug);
            await saveEntry({ filePath: _filePath, content });
          }
        } catch (err) {
          logger.warn(
            `An error occured, likely because file is either empty or invalid`
          );
        }
      };

      return { run, handleFile };
    },
  };
};
