declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		
	};

	type DataEntryMap = {
		"categories": {
"bundler": {
	id: "bundler";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"meta-framework": {
	id: "meta-framework";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"router": {
	id: "router";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"ui-framework": {
	id: "ui-framework";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
"ui-kit": {
	id: "ui-kit";
  collection: "categories";
  data: InferEntrySchema<"categories">
};
};
"github": {
"facebook/react": {
	id: "facebook/react";
  collection: "github";
  data: InferEntrySchema<"github">
};
"gridsome/gridsome": {
	id: "gridsome/gridsome";
  collection: "github";
  data: InferEntrySchema<"github">
};
"nuxt/nuxt": {
	id: "nuxt/nuxt";
  collection: "github";
  data: InferEntrySchema<"github">
};
"radix-vue/radix-vue": {
	id: "radix-vue/radix-vue";
  collection: "github";
  data: InferEntrySchema<"github">
};
"remix-run/remix": {
	id: "remix-run/remix";
  collection: "github";
  data: InferEntrySchema<"github">
};
"solidjs/solid": {
	id: "solidjs/solid";
  collection: "github";
  data: InferEntrySchema<"github">
};
"tanstack/router": {
	id: "tanstack/router";
  collection: "github";
  data: InferEntrySchema<"github">
};
"vercel/next.js": {
	id: "vercel/next.js";
  collection: "github";
  data: InferEntrySchema<"github">
};
"vitejs/vite": {
	id: "vitejs/vite";
  collection: "github";
  data: InferEntrySchema<"github">
};
"vuejs/core": {
	id: "vuejs/core";
  collection: "github";
  data: InferEntrySchema<"github">
};
"vuetifyjs/vuetify": {
	id: "vuetifyjs/vuetify";
  collection: "github";
  data: InferEntrySchema<"github">
};
};
"libraries": {
"gridsome": {
	id: "gridsome";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"nextjs": {
	id: "nextjs";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"nuxt": {
	id: "nuxt";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"radix-vue": {
	id: "radix-vue";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"reactjs": {
	id: "reactjs";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"remix": {
	id: "remix";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"solidjs": {
	id: "solidjs";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"tanstack-router": {
	id: "tanstack-router";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"vite": {
	id: "vite";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"vuejs": {
	id: "vuejs";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
"vuetify": {
	id: "vuetify";
  collection: "libraries";
  data: InferEntrySchema<"libraries">
};
};
"npm": {
"@gridsome/cli": {
	id: "@gridsome/cli";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"@tanstack/actions": {
	id: "@tanstack/actions";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"@tanstack/react-router": {
	id: "@tanstack/react-router";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"gridsome": {
	id: "gridsome";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"next": {
	id: "next";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"nuxt": {
	id: "nuxt";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"react": {
	id: "react";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"remix": {
	id: "remix";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"solid-js": {
	id: "solid-js";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"vite": {
	id: "vite";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"vue": {
	id: "vue";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
"vuetify": {
	id: "vuetify";
  collection: "npm";
  data: InferEntrySchema<"npm">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../content/config");
}
