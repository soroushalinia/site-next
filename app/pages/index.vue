<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale, t } = useI18n();

const emailUser = t("contact_page.email_user");
const emailDomain = t("contact_page.email_domain");

useScrollReveal();

const localePrefix = computed(() => (locale.value === "fa" ? "/fa" : ""));

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
  { watch: [locale] },
);

const { data: featuredProjects } = await useAsyncData(
  "featured-projects-" + locale.value,
  async () => {
    const collection = ("projects_" + locale.value) as keyof Collections;
    let projects = await queryCollection(collection).all();
    if (projects.length === 0 && locale.value !== "en") {
      projects = await queryCollection("projects_en").all();
    }
    return projects?.slice(0, 2) ?? [];
  },
  { watch: [locale] },
);

const { data: recentPosts } = await useAsyncData(
  "recent-posts-" + locale.value,
  async () => {
    const collection = ("blog_" + locale.value) as keyof Collections;
    let data = await queryCollection(collection).all();
    data = data?.filter((p) => !p.path?.endsWith("/index")) ?? [];
    data.sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
    );
    return data?.slice(0, 2) ?? [];
  },
  { watch: [locale] },
);

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <div class="flex flex-col pb-12">
    <section
      class="flex flex-col items-center text-center gap-6 min-h-screen justify-center px-4 -mt-16 sm:-mt-24"
    >
      <div
        class="size-28 sm:size-36 rounded-full bg-gradient-to-tr from-primary/30 via-primary/10 to-primary/30 p-0.5 reveal"
        :style="{ animationDelay: '0ms' }"
      >
        <div
          class="size-full rounded-full bg-background flex items-center justify-center text-4xl sm:text-5xl font-bold text-primary"
        >
          S
        </div>
      </div>

      <div class="space-y-1 reveal" :style="{ animationDelay: '100ms' }">
        <h1 class="text-4xl sm:text-5xl font-bold">
          {{ page?.hero?.greeting }}
        </h1>
        <p class="text-muted-foreground">{{ t("home_page.job_title") }}</p>
      </div>

      <div
        class="flex items-center justify-center gap-1.5 text-sm sm:text-base text-muted-foreground flex-wrap reveal"
        :style="{ animationDelay: '200ms' }"
      >
        <UIcon name="i-lucide-map-pin" class="size-4 sm:size-5 shrink-0" />
        <span>{{ t("home_page.location") }}</span>
        <span class="text-muted-foreground/50">|</span>
        <span>{{ t("home_page.remote_available") }}</span>
      </div>

      <div
        class="flex flex-col sm:flex-row items-center gap-3 pt-2 reveal"
        :style="{ animationDelay: '300ms' }"
      >
        <a
          href="/cv.pdf"
          download
          class="btn btn--primary w-full sm:w-auto min-w-36 justify-center"
        >
          <UIcon name="i-lucide-download" class="size-4" />
          {{ t("home_page.download_cv") }}
        </a>
        <NuxtLink
          :to="`${localePrefix}/contact`"
          class="btn btn--outline w-full sm:w-auto min-w-36 justify-center"
        >
          {{ t("home_page.cta_contact") }}
        </NuxtLink>
      </div>

      <div
        class="flex items-center gap-4 pt-2 reveal"
        :style="{ animationDelay: '400ms' }"
      >
        <a
          href="https://github.com/soroushalinia"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <UIcon name="i-lucide-github" class="size-5" />
        </a>
        <a
          href="https://linkedin.com/in/soroushalinia"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <UIcon name="i-lucide-linkedin" class="size-5" />
        </a>
        <a
          href="https://x.com/xero_dl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          <UIcon name="i-simple-icons-x" class="size-5" />
        </a>
      </div>
    </section>

    <section class="mt-6 sm:mt-8">
      <div class="text-center mb-8 reveal">
        <h2 class="text-2xl font-semibold">
          {{ t("about_page.title") }}
        </h2>
        <div
          class="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        />
      </div>

      <p
        class="text-muted-foreground text-center max-w-2xl mx-auto reveal"
        :style="{ animationDelay: '100ms' }"
      >
        {{ t("home_page.bio") }}
      </p>

      <div class="text-center mt-6 reveal" :style="{ animationDelay: '200ms' }">
        <NuxtLink
          :to="`${localePrefix}/about`"
          class="text-sm text-primary hover:underline font-medium"
        >
          {{ t("about_page.description") }}
          <UIcon name="i-lucide-arrow-right" class="size-5 inline" />
        </NuxtLink>
      </div>
    </section>

    <section v-if="featuredProjects?.length" class="mt-16 sm:mt-20">
      <div class="text-center mb-8 reveal">
        <h2 class="text-2xl font-semibold">
          {{ t("home_page.recent_projects") }}
        </h2>
        <div
          class="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="(project, i) in featuredProjects"
          :key="project.id"
          :to="`${localePrefix}/projects`"
          class="group rounded-lg border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg reveal"
          :style="{ animationDelay: `${i * 100 + 100}ms` }"
        >
          <h3
            class="text-lg font-semibold group-hover:text-primary transition-colors"
          >
            {{ project.title }}
          </h3>
          <p class="mt-2 text-sm text-muted-foreground line-clamp-2">
            {{ project.description }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {{ tag }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section v-if="recentPosts?.length" class="mt-16 sm:mt-20">
      <div class="text-center mb-8 reveal">
        <h2 class="text-2xl font-semibold">
          {{ t("blog_page.recent_posts") }}
        </h2>
        <div
          class="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        />
      </div>

      <div class="flex flex-col gap-4">
        <NuxtLink
          v-for="(post, i) in recentPosts"
          :key="post.id"
          :to="`${localePrefix}${post.path}`"
          class="rounded-lg border p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-md group reveal"
          :style="{ animationDelay: `${i * 100 + 100}ms` }"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3
                class="font-semibold group-hover:text-primary transition-colors"
              >
                {{ post.title }}
              </h3>
              <p class="mt-1 text-sm text-muted-foreground line-clamp-1">
                {{ post.description }}
              </p>
            </div>
            <time
              v-if="post.date"
              class="text-xs text-muted-foreground tabular-nums shrink-0"
            >
              {{
                new Date(post.date).toLocaleDateString(
                  locale === "fa" ? "fa" : "en",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                )
              }}
            </time>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="mt-16 sm:mt-20">
      <div class="text-center mb-8 reveal">
        <h2 class="text-2xl font-semibold">
          {{ t("home_page.github_activity") }}
        </h2>
        <div
          class="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        />
      </div>
      <div class="reveal" :style="{ animationDelay: '100ms' }">
        <HomeGitHubContributions />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <a
          href="https://github.com/soroushalinia/infra-template"
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          class="rounded-lg border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group flex flex-col reveal"
          :style="{ animationDelay: '200ms' }"
        >
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-book" class="size-4 text-primary shrink-0" />
            <span
              class="font-medium truncate group-hover:text-primary transition-colors"
              >infra-template</span
            >
          </div>
          <p class="text-xs text-muted-foreground line-clamp-2 flex-1">
            How to guide to set up a basic infrastructure for common self-hosted
            services.
          </p>
          <div
            class="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground"
          >
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="size-3.5" />
              3
            </span>
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-git-fork" class="size-3.5" />
              1
            </span>
            <span>Shell</span>
          </div>
        </a>
        <a
          href="https://github.com/soroushalinia/hosting-demo-pwa"
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          class="rounded-lg border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group flex flex-col reveal"
          :style="{ animationDelay: '300ms' }"
        >
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-book" class="size-4 text-primary shrink-0" />
            <span
              class="font-medium truncate group-hover:text-primary transition-colors"
              >hosting-demo-pwa</span
            >
          </div>
          <p class="text-xs text-muted-foreground line-clamp-2 flex-1">
            VPS hosting PWA demo using Next.js
          </p>
          <div
            class="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-muted-foreground"
          >
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="size-3.5" />
              0
            </span>
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-git-fork" class="size-3.5" />
              0
            </span>
            <span>TypeScript</span>
          </div>
        </a>
      </div>
    </section>

    <section
      class="rounded-lg border p-8 text-center relative overflow-hidden mt-16 sm:mt-20"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none"
      />
      <div class="relative space-y-4">
        <h2 class="text-2xl font-semibold reveal">
          {{ t("home_page.contact_heading") }}
        </h2>
        <p
          class="text-muted-foreground max-w-lg mx-auto reveal"
          :style="{ animationDelay: '100ms' }"
        >
          {{ t("home_page.contact_send_hint") }}
        </p>
        <div class="reveal" :style="{ animationDelay: '200ms' }">
          <a
            :href="`mailto:${emailUser}@${emailDomain}`"
            class="btn btn--primary btn--sm inline-flex"
          >
            <UIcon name="i-lucide-mail" class="size-4" />
            {{ t("home_page.contact_send") }}
          </a>
        </div>
        <p
          class="text-sm text-muted-foreground pt-2 reveal"
          :style="{ animationDelay: '300ms' }"
        >
          <NuxtLink
            :to="`${localePrefix}/contact`"
            class="text-primary hover:underline font-medium"
          >
            {{ t("home_page.contact_alt_cta") }}
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>
