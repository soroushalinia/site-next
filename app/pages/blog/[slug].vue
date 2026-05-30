<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale } = useI18n();
const route = useRoute();

const slug = route.params.slug as string;

const blogPath = slug === "index" ? "/blog" : `/blog/${slug}`;

const { data: post } = await useAsyncData(
  `blog-${locale.value}-${slug}`,
  async () => {
    const collection = ("blog_" + locale.value) as keyof Collections;
    let content = await queryCollection(collection).path(blogPath).first();

    if (!content && locale.value !== "en") {
      content = await queryCollection("blog_en").path(blogPath).first();
    }

    return content;
  },
  {
    watch: [locale],
  },
);

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
  <div v-else>Post not found</div>
</template>
