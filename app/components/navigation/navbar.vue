<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();

const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

const isSearchOpen = ref(false);
const isSidebarOpen = ref(false);

const query = ref("");
const results = ref<
  { title: string; description: string; path: string; type: string }[]
>([]);
const searching = ref(false);
let debounceTimer: ReturnType<typeof setTimeout>;

const isRtl = computed(() => locale.value === "fa");
const localePrefix = computed(() => (locale.value === "fa" ? "/fa" : ""));

const navigation = computed(() => {
  const p = localePrefix.value;
  return [
    { label: t("navbar.home"), to: p || "/" },
    { label: t("navbar.about"), to: `${p}/about` },
    { label: t("navbar.projects"), to: `${p}/projects` },
    { label: t("navbar.blog"), to: `${p}/blog` },
    { label: t("navbar.contact"), to: `${p}/contact` },
  ];
});

const doSearch = async () => {
  const term = query.value.trim();
  if (!term) {
    results.value = [];
    return;
  }

  searching.value = true;

  try {
    const blogCollection = ("blog_" + locale.value) as keyof Collections;
    const projectCollection = ("projects_" + locale.value) as keyof Collections;

    const [blogResults, projectResults] = await Promise.all([
      queryCollection(blogCollection)
        .where("title", "LIKE", `%${term}%`)
        .all()
        .catch(() => []),
      queryCollection(projectCollection)
        .where("title", "LIKE", `%${term}%`)
        .all()
        .catch(() => []),
    ]);

    interface ResultItem {
      title: string;
      description?: string;
      path?: string;
      id?: string;
    }

    const mappedBlog = (blogResults || [])
      .filter((p: ResultItem) => !p.path?.endsWith("/index"))
      .map((p: ResultItem) => ({
        title: p.title,
        description: p.description || "",
        path: `${localePrefix.value}${p.path || `/blog/${p.id}`}`,
        type: "blog" as const,
      }));

    const mappedProjects = (projectResults || []).map((p: ResultItem) => ({
      title: p.title,
      description: p.description || "",
      path: `${localePrefix.value}/projects`,
      type: "project" as const,
    }));

    results.value = [...mappedBlog, ...mappedProjects].slice(0, 8);
  } catch {
    results.value = [];
  } finally {
    searching.value = false;
  }
};

const onQueryInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(doSearch, 300);
};

const closeSearch = () => {
  isSearchOpen.value = false;
  query.value = "";
  results.value = [];
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const switchLocale = () => {
  const current = (locale.value ?? "en") as "en" | "fa";
  setLocale(current === "fa" ? "en" : "fa");
};

const isActiveRoute = (path: string) => {
  return route.path === path;
};

const navLinkClass = (path: string) => {
  const isActive = isActiveRoute(path);

  return [
    "relative h-9 px-4 inline-flex items-center justify-center",
    "rounded-lg text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
  ];
};
</script>

<template>
  <nav>
    <div class="w-full border-b backdrop-blur-sm justify-center flex">
      <div class="max-w-7xl w-full px-4 h-14 flex items-center gap-2">
        <div class="flex-1">
          <NuxtLink
            :to="localePrefix || '/'"
            class="font-mono text-lg max-sm:text-sm font-semibold h-9 inline-flex items-center whitespace-nowrap"
          >
            Soroush Alinia
          </NuxtLink>
        </div>

        <div class="hidden lg:flex items-center gap-2">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            :class="navLinkClass(item.to)"
          >
            <div
              class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-linear-to-b from-white/5 to-transparent dark:from-white/10 pointer-events-none"
            />

            <span class="relative z-10 text-center">
              {{ item.label }}
            </span>
          </NuxtLink>
        </div>

        <div class="flex-1 flex justify-end">
          <div class="flex items-center gap-1 sm:gap-2">
            <UButton
              variant="soft"
              color="neutral"
              square
              @click="isSearchOpen = true"
            >
              <UIcon
                name="i-heroicons-magnifying-glass-20-solid"
                class="size-5"
              />
            </UButton>

            <UButton
              variant="soft"
              color="neutral"
              square
              class="max-sm:hidden"
              @click="switchLocale"
            >
              <UIcon name="i-heroicons-language-20-solid" class="size-5" />
            </UButton>

            <UButton
              variant="soft"
              color="neutral"
              square
              class="max-sm:hidden"
              @click="toggleTheme"
            >
              <UIcon
                :name="
                  colorMode.value === 'dark'
                    ? 'i-heroicons-sun-20-solid'
                    : 'i-heroicons-moon-20-solid'
                "
                class="size-5"
              />
            </UButton>

            <UButton
              class="lg:hidden"
              variant="soft"
              color="neutral"
              square
              @click="isSidebarOpen = true"
            >
              <UIcon name="i-heroicons-bars-3-20-solid" class="size-5" />
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <USlideover v-model:open="isSidebarOpen" :side="isRtl ? 'left' : 'right'">
      <template #content>
        <div class="p-6 flex flex-col h-full">
          <div class="flex items-center justify-between mb-8">
            <NuxtLink
              :to="localePrefix || '/'"
              class="font-mono font-semibold ltr:text-left rtl:text-right"
              >Soroush Alinia</NuxtLink
            >
            <UButton
              variant="ghost"
              color="neutral"
              square
              @click="isSidebarOpen = false"
            >
              <UIcon name="i-heroicons-x-mark-20-solid" class="size-5" />
            </UButton>
          </div>

          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              :class="[
                'h-11 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200',
                isActiveRoute(item.to)
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              ]"
              @click="isSidebarOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <div class="mt-auto pt-6 border-t">
            <div class="grid grid-cols-2 gap-2">
              <UButton
                variant="soft"
                color="neutral"
                class="justify-center"
                @click="switchLocale"
              >
                <UIcon name="i-heroicons-language-20-solid" class="size-5" />
              </UButton>
              <UButton
                variant="soft"
                color="neutral"
                class="justify-center"
                @click="toggleTheme"
              >
                <UIcon
                  :name="
                    colorMode.value === 'dark'
                      ? 'i-heroicons-sun-20-solid'
                      : 'i-heroicons-moon-20-solid'
                  "
                  class="size-5"
                />
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </USlideover>

    <UModal v-model:open="isSearchOpen">
      <template #content>
        <div class="p-5">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="size-10 rounded-lg bg-muted flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-magnifying-glass-20-solid"
                class="size-5"
              />
            </div>

            <div>
              <p class="font-semibold">
                {{ t("navbar.search") }}
              </p>
            </div>
          </div>

          <div class="relative">
            <UIcon
              name="i-heroicons-magnifying-glass-20-solid"
              class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />

            <UInput
              v-model="query"
              size="xl"
              autofocus
              :placeholder="t('navbar.search_placeholder')"
              class="w-full"
              :ui="{
                base: 'rounded-lg',
              }"
              @update:model-value="onQueryInput"
            />
          </div>

          <div
            v-if="searching"
            class="mt-4 text-center text-sm text-muted-foreground"
          >
            Searching...
          </div>

          <div
            v-else-if="results.length"
            class="mt-4 flex flex-col gap-2 max-h-80 overflow-y-auto"
          >
            <NuxtLink
              v-for="result in results"
              :key="result.path + result.type"
              :to="result.path"
              class="flex flex-col gap-1 rounded-lg border bg-card p-3 transition-all duration-200 hover:border-primary/50 hover:bg-muted/50"
              @click="closeSearch"
            >
              <div class="flex items-center gap-2">
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
                  :class="
                    result.type === 'blog'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-secondary-foreground'
                  "
                >
                  {{ result.type }}
                </span>
                <p class="text-sm font-medium truncate">{{ result.title }}</p>
              </div>
              <p
                v-if="result.description"
                class="text-xs text-muted-foreground line-clamp-1"
              >
                {{ result.description }}
              </p>
            </NuxtLink>
          </div>

          <div
            v-else-if="query && !searching"
            class="mt-4 text-center text-sm text-muted-foreground"
          >
            No results found.
          </div>

          <div
            class="mt-4 flex items-center justify-between text-xs text-muted-foreground"
          >
            <span>
              {{ t("navbar.search_hint") }}
            </span>

            <kbd class="px-2 py-1 rounded-md border bg-muted font-mono">
              ESC
            </kbd>
          </div>
        </div>
      </template>
    </UModal>
  </nav>
</template>
