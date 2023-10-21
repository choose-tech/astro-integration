import { getIntegrationName } from "../utils";
import { LIBRARIES_PATH, NPM_PATH } from "../utils/data-integration/constants";
import { createDataIntegration } from "../utils/data-integration/create-data-integration";
import { createDataFetcher } from "../utils/data-integration/data-fetcher";

export const npmDataIntegration = () => {
  const { setup } = createDataFetcher({
    sourceCollectionPath: LIBRARIES_PATH,
    destinationCollectionPath: NPM_PATH,
    getEntrySlugs: (fileContent) => {
      const { packages } = fileContent;
      return packages;
    },
    fetchData: async (slug) => {
      const data = await fetch(
        `https://api.npmjs.org/downloads/point/last-week/${slug}`
      ).then((res) => res.json());

      return JSON.stringify(data, null, 2);
    },
  });

  return createDataIntegration({
    name: getIntegrationName("npm-data"),
    setup,
  });
};
