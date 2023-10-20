import { getCollection, type CollectionEntry } from "astro:content";

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: CollectionEntry<"categories">["data"]["color"];
};

export const getCategories = async (): Promise<Array<Category>> => {
  const raw = await getCollection("categories");

  return await Promise.all(
    raw.map(async ({ id, data }) => {
      return {
        id,
        name: data.name,
        icon: data.icon,
        color: data.color,
      } satisfies Category;
    })
  );
};
