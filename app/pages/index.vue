<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale, t } = useI18n();

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

const about = computed(() => page.value?.meta?.about);

const skills = computed(
  () =>
    (about.value?.skills ?? []) as {
      category: string;
      items: string[];
      icon: string;
    }[],
);

const skillIcons: Record<string, string> = {
  Python: "i-simple-icons-python",
  Golang: "i-simple-icons-go",
  JavaScript: "i-simple-icons-javascript",
  Bash: "i-lucide-terminal",
  TypeScript: "i-simple-icons-typescript",
  Linux: "i-simple-icons-linux",
  Docker: "i-simple-icons-docker",
  Kubernetes: "i-simple-icons-kubernetes",
  Terraform: "i-simple-icons-terraform",
  Ansible: "i-simple-icons-ansible",
  Nginx: "i-simple-icons-nginx",
  Traefik: "i-simple-icons-traefikproxy",
  "GitLab CI/CD": "i-simple-icons-gitlab",
  ArgoCD: "i-simple-icons-argo",
  Prometheus: "i-simple-icons-prometheus",
  Grafana: "i-simple-icons-grafana",
  "ELK Stack": "i-simple-icons-elasticsearch",
  RabbitMQ: "i-simple-icons-rabbitmq",
  Kafka: "i-simple-icons-apachekafka",
  NATS: "i-simple-icons-natsdotio",
  Nexus: "i-simple-icons-sonatype",
  PostgreSQL: "i-simple-icons-postgresql",
  MySQL: "i-simple-icons-mysql",
  MongoDB: "i-simple-icons-mongodb",
  Redis: "i-simple-icons-redis",
  FastAPI: "i-simple-icons-fastapi",
  Django: "i-simple-icons-django",
  Gin: "i-simple-icons-gin",
  "Gorilla Mux": "i-lucide-route",
  Nuxt: "i-simple-icons-nuxtdotjs",
  Vue: "i-simple-icons-vuedotjs",
  "Next.js": "i-simple-icons-nextdotjs",
  React: "i-simple-icons-react",
};

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <div class="flex flex-col gap-16 sm:gap-20 py-12">
    <section class="flex flex-col items-center text-center gap-5">
      <div
        class="size-20 sm:size-24 rounded-full bg-gradient-to-tr from-primary/30 via-primary/10 to-primary/30 p-0.5"
      >
        <div
          class="size-full rounded-full bg-background flex items-center justify-center text-3xl sm:text-4xl font-bold text-primary"
        >
          S
        </div>
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-bold">
          {{ page?.hero?.greeting }}
        </h1>
        <p class="text-xl sm:text-2xl text-muted-foreground font-medium">
          {{ page?.hero?.subtitle }}
        </p>
      </div>

      <p class="max-w-2xl text-muted-foreground">
        {{ page?.hero?.description }}
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <NuxtLink
          :to="`${localePrefix}/projects`"
          class="btn btn--primary btn--sm w-full sm:w-auto"
        >
          {{ t("home_page.cta_projects") }}
        </NuxtLink>
        <NuxtLink
          :to="`${localePrefix}/contact`"
          class="btn btn--outline btn--sm w-full sm:w-auto"
        >
          {{ t("home_page.cta_contact") }}
        </NuxtLink>
      </div>
    </section>

    <section v-if="skills.length">
      <div class="flex flex-col gap-6">
        <div class="text-center">
          <h2 class="text-2xl font-semibold">
            {{ t("about_page.skills_title") }}
          </h2>
        </div>

        <div
          v-for="group in skills"
          :key="group.category"
          class="rounded-lg border p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center gap-2 mb-4">
            <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UIcon :name="group.icon" class="size-4 text-primary" />
            </div>
            <h3 class="font-semibold">{{ group.category }}</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in group.items"
              :key="skill"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              <UIcon :name="skillIcons[skill] || 'i-lucide-circle'" class="size-3.5" />
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="featuredProjects?.length">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold">
          {{ t("home_page.featured_title") }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="project in featuredProjects"
          :key="project.id"
          :to="`${localePrefix}/projects`"
          class="group rounded-lg border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="h-1 w-10 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 mb-4"
          />
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

    <section class="rounded-lg border p-8 text-center relative overflow-hidden">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none"
      />
      <div class="relative">
        <h2 class="text-2xl font-semibold mb-3">
          {{ t("home_page.cta_contact") }}
        </h2>
        <p class="text-muted-foreground mb-6 max-w-lg mx-auto">
          {{ t("about_page.bio") }}
        </p>
        <NuxtLink
          :to="`${localePrefix}/contact`"
          class="btn btn--primary btn--sm"
        >
          {{ t("home_page.cta_contact") }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
