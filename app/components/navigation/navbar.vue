<script setup lang="ts">
import type { Collections } from "@nuxt/content";
import { useLocaleInfo } from "../../composables/useLocaleInfo";

const route = useRoute();
const router = useRouter();

const colorMode = useColorMode();
const { locale, t } = useI18n();
const { prefix, isFa } = useLocaleInfo();
const switchLocalePath = useSwitchLocalePath();
const { brandName } = useSiteSeo();

const isSearchOpen = ref(false);
const isSidebarOpen = ref(false);

const query = ref("");
interface SearchResult {
  title: string;
  description: string;
  path: string;
  type: "blog" | "project";
  score?: number;
  matches?: boolean;
  id?: string;
}
const results = ref<SearchResult[]>([]);
const searching = ref(false);
let debounceTimer: ReturnType<typeof setTimeout>;

const isRtl = computed(() => isFa.value);
const localePrefix = prefix;

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

function extractTextFromMinimark(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractTextFromMinimark).join(" ");
  return "";
}

function normalizeSearchText(value: string): string {
  return value.toLocaleLowerCase(locale.value).replace(/\s+/g, " ").trim();
}

function buildSearchScore(
  title: string,
  searchableText: string,
  terms: string[],
) {
  const normalizedTitle = normalizeSearchText(title);
  return terms.reduce((score, term) => {
    let nextScore = score;

    if (normalizedTitle === term) nextScore += 120;
    else if (normalizedTitle.startsWith(term)) nextScore += 60;
    else if (normalizedTitle.includes(term)) nextScore += 35;

    const matchCount = searchableText.split(term).length - 1;
    nextScore += matchCount * 10;

    return nextScore;
  }, 0);
}

interface ContentItem {
  title: string;
  description?: string;
  path?: string;
  id?: string;
  tags?: string[];
  body?: { value: unknown };
}

const cachedSearchData = ref<{
  blog: ContentItem[] | null;
  projects: ContentItem[] | null;
}>({ blog: null, projects: null });

watch(locale, () => {
  cachedSearchData.value.blog = null;
  cachedSearchData.value.projects = null;
});

const doSearch = async () => {
  const term = query.value.trim();
  if (!term) {
    results.value = [];
    return;
  }

  searching.value = true;

  try {
    const terms = normalizeSearchText(term).split(" ").filter(Boolean);
    const blogCollection = ("blog_" + locale.value) as keyof Collections;
    const projectCollection = ("projects_" + locale.value) as keyof Collections;

    if (!cachedSearchData.value.blog || !cachedSearchData.value.projects) {
      const [blogResults, projectResults] = await Promise.all([
        queryCollection(blogCollection)
          .all()
          .catch(() => []),
        queryCollection(projectCollection)
          .all()
          .catch(() => []),
      ]);
      cachedSearchData.value.blog = blogResults || [];
      cachedSearchData.value.projects = projectResults || [];
    }

    const blogResults = cachedSearchData.value.blog as ContentItem[];
    const projectResults = cachedSearchData.value.projects as ContentItem[];

    const mappedBlog = (blogResults || [])
      .filter((p: ContentItem) => !p.path?.endsWith("/index"))
      .map((p: ContentItem) => {
        const searchableText = normalizeSearchText(
          [
            p.title,
            p.description || "",
            (p.tags || []).join(" "),
            extractTextFromMinimark(p.body?.value),
          ].join(" "),
        );

        return {
          title: p.title,
          description: p.description || "",
          path: p.path || `/blog/${p.id || ""}`,
          id: p.id,
          type: "blog" as const,
          score: buildSearchScore(p.title, searchableText, terms),
          matches: terms.every((searchTerm) =>
            searchableText.includes(searchTerm),
          ),
        };
      })
      .filter((p) => p.matches)
      .sort((a, b) => b.score - a.score)
      .map((p: SearchResult) => ({
        title: p.title,
        description: p.description || "",
        path: `${localePrefix.value}${p.path}`,
        type: "blog" as const,
      }));

    const mappedProjects = (projectResults || [])
      .map((p: ContentItem) => {
        const searchableText = normalizeSearchText(
          [p.title, p.description || "", (p.tags || []).join(" ")].join(" "),
        );

        return {
          title: p.title,
          description: p.description || "",
          path: `${localePrefix.value}/projects`,
          type: "project" as const,
          score: buildSearchScore(p.title, searchableText, terms),
          matches: terms.every((searchTerm) =>
            searchableText.includes(searchTerm),
          ),
        };
      })
      .filter((p) => p.matches)
      .sort((a, b) => b.score - a.score)
      .map((p) => ({
        title: p.title,
        description: p.description,
        path: p.path,
        type: p.type,
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

const openSearch = () => {
  isSearchOpen.value = true;
};

const closeSearch = () => {
  isSearchOpen.value = false;
  query.value = "";
  results.value = [];
};

const openSidebar = () => {
  isSidebarOpen.value = true;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const isBlogPostRoute = computed(() => {
  return (
    typeof route.params.slug === "string" &&
    /^\/(?:fa\/)?blog\/[^/]+$/.test(route.path)
  );
});

const getBlogIndexPath = (targetLocale: "en" | "fa") => {
  return targetLocale === "fa" ? "/fa/blog" : "/blog";
};

const switchLocale = async () => {
  const current = (locale.value ?? "en") as "en" | "fa";
  const targetLocale = current === "fa" ? "en" : "fa";

  isSidebarOpen.value = false;

  if (isBlogPostRoute.value) {
    const slug = route.params.slug as string;
    const blogCollection = ("blog_" + targetLocale) as keyof Collections;
    const translatedPost = await queryCollection(blogCollection)
      .path(`/blog/${slug}`)
      .first()
      .catch(() => null);

    if (!translatedPost) {
      await router.push(getBlogIndexPath(targetLocale));
      return;
    }
  }

  const targetPath = switchLocalePath(targetLocale);

  if (targetPath) {
    await router.push(targetPath);
    return;
  }

  const pathWithoutLocale = route.path.replace(/^\/fa(?=\/|$)/, "") || "/";
  const fallbackPath =
    targetLocale === "fa"
      ? pathWithoutLocale === "/"
        ? "/fa"
        : `/fa${pathWithoutLocale}`
      : pathWithoutLocale;

  await router.push(fallbackPath);
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
            dir="ltr"
          >
            {{ brandName }}
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
              aria-label="Search"
              @click="openSearch"
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
              :aria-label="
                locale === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'
              "
              @click="switchLocale"
            >
              <UIcon name="i-heroicons-language-20-solid" class="size-5" />
            </UButton>

            <UButton
              variant="soft"
              color="neutral"
              square
              class="max-sm:hidden"
              :aria-label="
                colorMode.value === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
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
              aria-label="Open menu"
              @click="openSidebar"
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
              dir="ltr"
              >{{ brandName }}</NuxtLink
            >
            <UButton
              variant="ghost"
              color="neutral"
              square
              aria-label="Close menu"
              @click="closeSidebar"
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
              @click="closeSidebar"
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
                :aria-label="
                  locale === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'
                "
                @click="switchLocale"
              >
                <UIcon name="i-heroicons-language-20-solid" class="size-5" />
              </UButton>
              <UButton
                variant="soft"
                color="neutral"
                class="justify-center"
                :aria-label="
                  colorMode.value === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                "
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
            {{ t("navbar.search_no_results") }}
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
