<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale, t } = useI18n();

const { data: page } = await useAsyncData(
  "about-" + locale.value,
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

const about = computed(() => page.value?.meta?.about);

const experience = computed(
  () =>
    (about.value?.experience ?? []) as {
      period: string;
      title: string;
      company: string;
      description: string;
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

const skills = computed(
  () =>
    (about.value?.skills ?? []) as {
      category: string;
      items: string[];
      icon: string;
    }[],
);

useSeoMeta({
  title: t("about_page.title"),
  description: t("about_page.description"),
});
</script>

<template>
  <div class="flex flex-col gap-16 py-12">
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl font-bold">
        {{ t("about_page.title") }}
      </h1>
      <p class="mt-2 text-muted-foreground">
        {{ t("about_page.description") }}
      </p>
    </div>

    <p
      class="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto"
    >
      {{ t("about_page.bio") }}
    </p>

    <section>
      <h2 class="text-2xl font-semibold mb-8 text-center">
        {{ t("about_page.experience_title") }}
      </h2>

      <div class="relative">
        <div
          class="absolute top-0 bottom-0 w-px bg-border"
          :class="locale === 'fa' ? 'right-3' : 'left-3'"
        />

        <div class="flex flex-col gap-8">
          <div v-for="(item, i) in experience" :key="i" class="flex gap-6">
            <div class="flex flex-col items-center">
              <div
                class="size-6 rounded-full bg-primary flex items-center justify-center z-10"
              >
                <div class="size-2 rounded-full bg-primary-foreground" />
              </div>
            </div>

            <div class="flex-1 rounded-lg border p-5">
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
                <span class="text-xs text-muted-foreground tabular-nums">
                  {{ item.period }}
                </span>
                <span class="font-semibold">{{ item.title }}</span>
                <span class="text-muted-foreground">@</span>
                <span class="text-muted-foreground">{{ item.company }}</span>
              </div>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-8 text-center">
        {{ t("about_page.skills_title") }}
      </h2>

      <div class="flex flex-col gap-4">
        <div
          v-for="group in skills"
          :key="group.category"
          class="rounded-lg border p-5"
        >
          <div class="flex items-center gap-2 mb-3">
            <UIcon :name="group.icon" class="size-5 text-primary" />
            <h3 class="font-semibold">{{ group.category }}</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in group.items"
              :key="skill"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium bg-primary/10 text-primary"
            >
              <UIcon :name="skillIcons[skill] || 'i-lucide-circle'" class="size-3.5" />
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
