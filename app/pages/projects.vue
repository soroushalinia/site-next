<script setup lang="ts">
import { fetchLocalizedContent } from "../composables/useFetchLocalized";
import { useLocaleInfo } from "../composables/useLocaleInfo";

const { t } = useI18n();
const { buildPageTitle } = useSiteSeo();
const { prefix } = useLocaleInfo();

useScrollReveal();

interface Project {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

const { data: projects } = await useAsyncData(
  "projects-" + prefix.value,
  () => fetchLocalizedContent<Project[]>("projects"),
  { watch: [prefix] },
);

useSeoMeta({
  title: t("projects_page.title"),
  description: t("projects_page.description"),
  ogTitle: () => buildPageTitle(t("projects_page.title")),
  twitterTitle: () => buildPageTitle(t("projects_page.title")),
});
</script>

<template>
  <div class="flex flex-col gap-8 py-12">
    <div class="text-center reveal">
      <h1 class="text-3xl sm:text-4xl font-bold">
        {{ t("projects_page.title") }}
      </h1>
    </div>

    <div v-if="projects?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(project, i) in projects"
        :key="project.id"
        class="flex flex-col rounded-lg border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md reveal"
        :style="{ animationDelay: `${i * 100}ms` }"
      >
        <h3 class="text-lg font-semibold">
          {{ project.title }}
        </h3>
        <p class="mt-2 text-sm text-muted-foreground grow">
          {{ project.description }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="px-2.5 py-1 rounded-sm text-xs font-medium bg-primary/20 text-accent-foreground"
          >
            {{ tag }}
          </span>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <UIcon name="i-lucide-github" class="size-4" />
            {{ t("projects_page.source") }}
          </a>
          <a
            v-if="project.live"
            :href="project.live"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <UIcon name="i-lucide-external-link" class="size-4" />
            {{ t("projects_page.live") }}
          </a>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-muted-foreground py-12 reveal">
      {{ t("projects_page.empty") }}
    </p>
  </div>
</template>
