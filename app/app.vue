<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead({ dir: true, lang: true, seo: true });
const {
  public: { siteUrl = "https://soroushalinia.ir" },
} = useRuntimeConfig();
const { siteName, defaultDescription, buildPageTitle } = useSiteSeo();
const websiteSchema = computed(() =>
  JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteName.value,
      url: siteUrl,
      sameAs: [
        "https://github.com/soroushalinia",
        "https://linkedin.com/in/soroushalinia",
        "https://x.com/xero_dl",
      ],
      jobTitle: t("home_page.job_title"),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName.value,
      url: siteUrl,
      inLanguage: route.path.startsWith("/fa") ? "fa-IR" : "en-US",
      description: defaultDescription.value,
    },
  ]),
);

useHead(head);
useHead({
  title: () => siteName.value,
  titleTemplate: (titleChunk) => {
    if (!titleChunk || titleChunk === siteName.value) return siteName.value;
    return `${siteName.value} - ${titleChunk}`;
  },
  link: [
    {
      rel: "canonical",
      href: () => new URL(route.path || "/", siteUrl).toString(),
    },
    {
      rel: "preconnect",
      href: "https://api.web3forms.com",
      crossorigin: "",
    },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: "Soroush Alinia",
      href: `${siteUrl}/feed.xml`,
    },
  ],
  script: [
    {
      key: "site-schema",
      type: "application/ld+json",
      textContent: () => websiteSchema.value,
    },
  ],
});

useSeoMeta({
  applicationName: () => siteName.value,
  author: () => siteName.value,
  creator: () => siteName.value,
  publisher: () => siteName.value,
  description: () => defaultDescription.value,
  ogTitle: () => buildPageTitle(),
  ogSiteName: () => siteName.value,
  ogDescription: () => defaultDescription.value,
  ogType: "website",
  ogUrl: () => new URL(route.path || "/", siteUrl).toString(),
  ogLocale: () => (route.path.startsWith("/fa") ? "fa_IR" : "en_US"),
  twitterCard: "summary_large_image",
  twitterTitle: () => buildPageTitle(),
  twitterDescription: () => defaultDescription.value,
});

useHead({
  meta: [
    {
      name: "robots",
      content:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    {
      name: "googlebot",
      content:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
  ],
});
</script>
