<script setup lang="ts">
const route = useRoute();

const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

const isSearchOpen = ref(false);
const isSidebarOpen = ref(false);

const query = ref("");

const isRtl = computed(() => locale.value === "fa");
const localePrefix = computed(() => (locale.value === "fa" ? "/fa" : ""));

const navigation = computed(() => {
  const p = localePrefix.value;
  return [
    { label: t("navbar.home"), to: p || "/" },
    { label: t("navbar.projects"), to: `${p}/projects` },
    { label: t("navbar.blog"), to: `${p}/blog` },
    { label: t("navbar.contact"), to: `${p}/contact` },
  ];
});

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
            />
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
