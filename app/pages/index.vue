<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale } = useI18n();

const { data: page } = await useAsyncData(
  "page-index-" + locale.value,
  async () => {
    const collection = ("content_" + locale.value) as keyof Collections;
    let content = await queryCollection(collection).first();

    if (!content && locale.value !== "en") {
      content = await queryCollection("content_en").first();
    }

    return content;
  },
  {
    watch: [locale],
  },
);

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
  </div>
  <div v-else>Home not found</div>
</template>
