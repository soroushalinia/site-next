<script setup lang="ts">
import { fetchLocalizedContent } from "../../composables/useFetchLocalized";
import { useLocaleInfo } from "../../composables/useLocaleInfo";

const { t } = useI18n();
const { buildPageTitle } = useSiteSeo();
const { locale, prefix, isFa, toDisplayNumber } = useLocaleInfo();

useScrollReveal();

function extractTextFromMinimark(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) {
    const children =
      node[1] && typeof node[1] === "object" && !Array.isArray(node[1])
        ? node.slice(2)
        : node;
    return children.map(extractTextFromMinimark).join(" ");
  }
  return "";
}

function getReadingTime(body: { value?: unknown }): string {
  const value = body?.value;
  const minutes = Array.isArray(value)
    ? Math.max(
        1,
        Math.ceil(
          extractTextFromMinimark(value).split(/\s+/).filter(Boolean).length /
            275,
        ),
      )
    : 1;
  return toDisplayNumber(minutes);
}

interface BlogPost {
  id?: string;
  title?: string;
  description?: string;
  path?: string;
  date?: string;
  body?: { value: unknown };
  tags?: string[];
}

const { data: posts } = await useAsyncData(
  "blog-index-" + prefix.value,
  async () => {
    const postList =
      (await fetchLocalizedContent<BlogPost[]>("blog", {
        locale: locale.value,
      })) ?? [];
    return postList
      .filter((p) => !p.path?.endsWith("/index"))
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
      );
  },
  { watch: [prefix] },
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
        :to="`${prefix}${post.path}`"
        class="rounded-lg border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md group reveal"
        :dir="isFa ? 'rtl' : 'ltr'"
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
              new Date(post.date).toLocaleDateString(isFa ? "fa" : "en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </time>
          <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <Icon name="lucide:clock" class="size-4.5 self-center -mt-1" />
            {{
              t("blog_post.min_read", { n: getReadingTime(post.body ?? {}) })
            }}
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
            <span class="text-3xl leading-none">{{ isFa ? "←" : "→" }}</span>
          </span>
        </div>
      </NuxtLink>
    </div>

    <p v-else class="text-center text-muted-foreground py-12 reveal">
      {{ t("blog_page.empty") }}
    </p>
  </div>
</template>
