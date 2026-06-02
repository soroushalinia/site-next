export function useSiteSeo() {
  const { locale, t } = useI18n();

  const siteName = computed(() =>
    locale.value === "fa" ? "سروش علی نیا" : "Soroush Alinia",
  );

  // Wordmark shown in the navbar/footer — always rendered in English/mono
  // regardless of the active locale.
  const brandName = "Soroush Alinia";

  const defaultDescription = computed(() => t("seo.default_description"));
  const ogImage = "/avatar.jpg";
  const buildPageTitle = (pageTitle?: string | null) => {
    if (!pageTitle) return siteName.value;
    return `${siteName.value} - ${pageTitle}`;
  };

  return {
    siteName,
    brandName,
    defaultDescription,
    ogImage,
    buildPageTitle,
  };
}
