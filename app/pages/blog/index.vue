<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale, t } = useI18n();
const { buildPageTitle } = useSiteSeo();

useScrollReveal();

const localePrefix = computed(() => (locale.value === "fa" ? "/fa" : ""));

function extractTextFromMinimark(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractTextFromMinimark).join(" ");
  return "";
}

function getReadingTime(body: { value?: unknown }): string {
  const value = body?.value;
  const minutes = Array.isArray(value)
    ? Math.max(
        1,
        Math.ceil(
          extractTextFromMinimark(value).split(/\s+/).filter(Boolean).length /
            200,
        ),
      )
    : 1;
  return locale.value === "fa"
    ? minutes.toLocaleString("fa-IR")
    : String(minutes);
}

const { data: posts } = await useAsyncData(
  "blog-index-" + locale.value,
  async () => {
    const collection = ("blog_" + locale.value) as keyof Collections;
    let data = await queryCollection(collection).all();
    data = data?.filter((p) => !p.path?.endsWith("/index")) ?? [];
    data.sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
    );
    return data;
  },
  { watch: [locale] },
);

useSeoMeta({
  title: t("blog_page.title"),
  description: t("blog_page.description"),
  ogTitle: () => buildPageTitle(t("blog_page.title")),
  twitterTitle: () => buildPageTitle(t("blog_page.title")),
});
</script>

<template>
  <div class="flex flex-col gap-8 py-12">
    <div class="text-center reveal">
      <h1 class="text-3xl sm:text-4xl font-bold">
        {{ t("blog_page.title") }}
      </h1>
    </div>

    <div v-if="posts?.length" class="flex flex-col gap-6">
      <NuxtLink
        v-for="(post, i) in posts"
        :key="post.id"
        :to="`${localePrefix}${post.path}`"
        class="rounded-lg border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md group reveal"
        :style="{ animationDelay: `${i * 100}ms` }"
      >
        <h2
          class="text-lg font-semibold group-hover:text-primary transition-colors"
        >
          {{ post.title }}
        </h2>

        <div
          class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground"
        >
          <time
            v-if="post.date"
            class="inline-flex items-baseline gap-1.5 whitespace-nowrap"
          >
            <Icon name="lucide:calendar" class="size-4.5 self-center -mt-1" />
            {{
              new Date(post.date).toLocaleDateString(
                locale === "fa" ? "fa" : "en",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )
            }}
          </time>
          <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <Icon name="lucide:clock" class="size-4.5 self-center -mt-1" />
            {{ t("blog_post.min_read", { n: getReadingTime(post.body) }) }}
          </span>
        </div>

        <p class="mt-3 text-sm text-muted-foreground line-clamp-2">
          {{ post.description }}
        </p>

        <div
          class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm"
        >
          <span v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-sm text-xs font-medium bg-primary/20 text-accent-foreground"
            >
              {{ tag }}
            </span>
          </span>
          <span class="font-medium text-primary">
            {{ t("blog_page.read_more") }}
            <span class="text-3xl leading-none">{{
              locale === "fa" ? "\u2190" : "\u2192"
            }}</span>
          </span>
        </div>
      </NuxtLink>
    </div>

    <p v-else class="text-center text-muted-foreground py-12 reveal">
      {{ t("blog_page.empty") }}
    </p>
  </div>
</template>
