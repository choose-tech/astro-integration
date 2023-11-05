import { defineCollection, reference, z } from "astro:content";

export const collections = {
  categories: defineCollection({
    type: "data",
    schema: () =>
      z.object({
        name: z.string(),
        icon: z.string(),
        color: z.enum([
          "red",
          "orange",
          "amber",
          "yellow",
          "lime",
          "green",
          "emerald",
          "teal",
          "cyan",
          "sky",
          "blue",
          "indigo",
          "violet",
          "purple",
          "fuchsia",
          "pink",
          "rose",
        ]),
      }),
  }),
  libraries: defineCollection({
    type: "data",
    schema: ({ image }) =>
      z.object({
        logo: image(),
        name: z.string(),
        description: z.string().optional(),
        url: z.string().url(),
        repo: z.object({
          owner: z.string(),
          name: z.string(),
        }).optional(),
        packages: z.array(z.string()),
        equivalents: z.array(reference("libraries")),
        implies: z.array(reference("libraries")),
        categories: z.array(reference("categories")),
      }),
  }),
  github: defineCollection({
    type: "data",
    schema: () =>
      z.object({
        id: z.number(),
        name: z.string(),
        repo: z.string(),
        description: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        pushedAt: z.string(),
        stars: z.number(),
        watchers: z.number(),
        forks: z.number(),
        defaultBranch: z.string(),
      }),
  }),
  npm: defineCollection({
    type: "data",
    schema: () =>
      z.object({
        downloads: z.number(),
        start: z.string(),
        end: z.string(),
        package: z.string(),
      }),
  }),
};
