import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: "data",
      source: "en/index.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        hero: z.object({
          greeting: z.string(),
          description: z.string(),
        }),
      }),
    }),
    content_fa: defineCollection({
      type: "data",
      source: "fa/index.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        hero: z.object({
          greeting: z.string(),
          description: z.string(),
        }),
      }),
    }),
    projects_en: defineCollection({
      type: "data",
      source: "en/projects/*.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        github: z.string().optional(),
        live: z.string().optional(),
      }),
    }),
    projects_fa: defineCollection({
      type: "data",
      source: "fa/projects/*.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        github: z.string().optional(),
        live: z.string().optional(),
      }),
    }),
    blog_en: defineCollection({
      type: "page",
      source: {
        include: "en/blog/**",
        prefix: "/blog",
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
    blog_fa: defineCollection({
      type: "page",
      source: {
        include: "fa/blog/**",
        prefix: "/blog",
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
});
