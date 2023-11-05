import { getIntegrationName } from "../utils";
import {
  GITHUB_PATH,
  LIBRARIES_PATH,
} from "../utils/data-integration/constants";
import { createDataIntegration } from "../utils/data-integration/create-data-integration";
import { createDataFetcher } from "../utils/data-integration/data-fetcher";

export const githubDataIntegration = () => {
  const { setup } = createDataFetcher({
    sourceCollectionPath: LIBRARIES_PATH,
    destinationCollectionPath: GITHUB_PATH,
    getEntrySlugs: (fileContent) => {
      const { repo } = fileContent;
      return repo ? [`${repo.owner}/${repo.name}`] : [];
    },
    fetchData: async (slug) => {
      const { repo: data } = await fetch(`https://ungh.cc/repos/${slug}`).then(
        (res) => res.json()
      );

      return JSON.stringify(data, null, 2);
    },
  });

  return createDataIntegration({
    name: getIntegrationName("github-data"),
    setup,
  });
};
