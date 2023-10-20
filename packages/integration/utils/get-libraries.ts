import type { ImageMetadata } from "astro";
import { getCollection, type CollectionEntry, getEntry } from "astro:content";
import { getCategories, type Category } from "./get-categories";

export type Library = {
  id: string;
  logo: ImageMetadata;
  name: string;
  description: string;
  url: string;
  repo: {
    id: number;
    owner: string;
    name: string;
    stars: number;
    description: string;
    url: string;
  };
  packages: Array<{
    name: string;
    downloads: number;
    url: string;
  }>;
  npm: {
    downloads: number | null;
  };
  equivalents: Array<CollectionEntry<"libraries">["id"]>;
  implies: Array<CollectionEntry<"libraries">["id"]>;
  categories: Array<Category>;
};

export const getLibrary = async (id: string) => {
  const { data } = (await getEntry("libraries", id))!;

  const { data: githubData } = (await getEntry(
    "github",
    `${data.repo.owner}/${data.repo.name}`
  ))!;

  const packages = (
    await Promise.all(
      data.packages.map(async (pkg) => (await getEntry("npm", pkg))!)
    )
  ).map(({ data }) => ({
    name: data.package,
    downloads: data.downloads,
    url: `https://www.npmjs.com/package/${data.package}`,
  }));

  const categories = (await getCategories()).filter((cat) =>
    data.categories.map((c) => c.id).includes(cat.id as any)
  );

  return {
    id,
    logo: data.logo,
    name: data.name,
    description: data.description ?? githubData.description,
    url: data.url,
    repo: {
      id: githubData.id,
      owner: data.repo.owner,
      name: data.repo.name,
      stars: githubData.stars,
      description: githubData.description,
      url: `https://github.com/${data.repo.owner}/${data.repo.name}`,
    },
    packages,
    npm: {
      downloads:
        packages.length === 0
          ? null
          : packages.reduce((sum, { downloads }) => sum + downloads, 0),
    },
    equivalents: data.equivalents.map((e) => e.id),
    implies: data.implies.map((e) => e.id),
    categories,
  } satisfies Library;
};

export const getLibraries = async (): Promise<Array<Library>> => {
  const raw = await getCollection("libraries");

  return await Promise.all(raw.map(({ id }) => getLibrary(id)));
};
