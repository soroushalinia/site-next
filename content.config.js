import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: "data",
      source: "en/index.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
    content_fa: defineCollection({
      type: "data",
      source: "fa/index.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
    blog_en: defineCollection({
      type: "page",
      source: {
        include: "en/blog/**",
        prefix: "/blog",
      },
    }),
    blog_fa: defineCollection({
      type: "page",
      source: {
        include: "fa/blog/**",
        prefix: "/blog",
      },
    }),
  },
});
