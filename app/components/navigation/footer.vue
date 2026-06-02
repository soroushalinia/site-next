<script setup lang="ts">
const { t, locale } = useI18n();
const { brandName } = useSiteSeo();

const localePrefix = computed(() => (locale.value === "fa" ? "/fa" : ""));

const year = computed(() => {
  const currentYear = new Date();
  return new Intl.DateTimeFormat(locale.value === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
  }).format(currentYear);
});

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

const socials = [
  {
    icon: "i-lucide-github",
    href: "https://github.com/soroushalinia",
    label: "GitHub",
  },
  {
    icon: "i-lucide-linkedin",
    href: "https://linkedin.com/in/soroushalinia",
    label: "LinkedIn",
  },
  {
    icon: "i-simple-icons-x",
    href: "https://x.com/xero_dl",
    label: "X",
  },
];
</script>

<template>
  <footer class="w-full border-t">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-col items-center gap-4 sm:flex-row">
        <div class="sm:flex-1">
          <NuxtLink
            :to="localePrefix || '/'"
            class="font-mono text-sm font-semibold text-center sm:ltr:text-left sm:rtl:text-right"
            dir="ltr"
          >
            {{ brandName }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="sm:flex-1 flex justify-end">
          <div class="flex items-center gap-3">
            <a
              href="mailto:soroushalinia.dev@gmail.com"
              class="text-muted-foreground hover:text-foreground transition-colors duration-200"
              dir="ltr"
            >
              <UIcon name="i-lucide-mail" class="size-4" />
            </a>
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <UIcon :name="social.icon" class="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-4 text-center text-xs text-muted-foreground">
        &copy; {{ year }} {{ t("footer.copyright") }}
      </div>
    </div>
  </footer>
</template>
