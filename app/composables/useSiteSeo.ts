export function useSiteSeo() {
  const { locale, t } = useI18n();

  const siteName = computed(() =>
    locale.value === "fa" ? "سروش علی نیا" : "Soroush Alinia",
  );

  const brandName = "Soroush Alinia";

  const defaultDescription = computed(() => t("seo.default_description"));
  const buildPageTitle = (pageTitle?: string | null) => {
    if (!pageTitle) return siteName.value;
    return `${siteName.value} - ${pageTitle}`;
  };

  return {
    siteName,
    brandName,
    defaultDescription,
    buildPageTitle,
  };
}
