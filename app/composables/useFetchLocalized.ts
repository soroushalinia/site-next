import type { Collections } from "@nuxt/content";

interface ContentItem extends Record<string, unknown> {
  id?: string;
  title?: string;
}

export async function fetchLocalizedContent<
  T extends ContentItem = ContentItem,
>(
  collectionBase: string,
  options?: {
    path?: string;
    first?: boolean;
  },
): Promise<T | null> {
  const { locale } = useI18n();

  const collection = `${collectionBase}_${locale.value}` as keyof Collections;
  let result: T | null = null;

  if (options?.path) {
    result = (await queryCollection(collection)
      .path(options.path)
      .first()) as T | null;
  } else if (options?.first) {
    result = (await queryCollection(collection).first()) as T | null;
  } else {
    result = (await queryCollection(collection).all()) as T | null;
  }

  // Fallback to English if not found or if an empty localized collection is returned
  if (
    (result === null || (Array.isArray(result) && result.length === 0)) &&
    locale.value !== "en"
  ) {
    const enCollection = `${collectionBase}_en` as keyof Collections;
    if (options?.path) {
      result = (await queryCollection(enCollection)
        .path(options.path)
        .first()) as T | null;
    } else if (options?.first) {
      result = (await queryCollection(enCollection).first()) as T | null;
    } else {
      result = (await queryCollection(enCollection).all()) as T | null;
    }
  }

  return result ?? null;
}
