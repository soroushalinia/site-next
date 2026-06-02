<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const head = useLocaleHead({ dir: true, lang: true, seo: true });
const {
  public: { siteUrl = "https://soroushalinia.ir" },
} = useRuntimeConfig();
const { siteName, defaultDescription, ogImage, buildPageTitle } = useSiteSeo();
const websiteSchema = computed(() =>
  JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteName.value,
      url: siteUrl,
      image: new URL(ogImage, siteUrl).toString(),
      sameAs: [
        "https://github.com/soroushalinia",
        "https://linkedin.com/in/soroushalinia",
        "https://x.com/xero_dl",
      ],
      jobTitle: route.path.startsWith("/fa")
        ? "مهندس نرم‌افزار"
        : "Software Engineer",
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
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  googleBot:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogTitle: () => buildPageTitle(),
  ogSiteName: () => siteName.value,
  ogDescription: () => defaultDescription.value,
  ogImage,
  ogImageAlt: () => siteName.value,
  ogType: "website",
  ogUrl: () => new URL(route.path || "/", siteUrl).toString(),
  ogLocale: () => (route.path.startsWith("/fa") ? "fa_IR" : "en_US"),
  twitterCard: "summary_large_image",
  twitterTitle: () => buildPageTitle(),
  twitterDescription: () => defaultDescription.value,
  twitterImage: ogImage,
  twitterImageAlt: () => siteName.value,
});
</script>
