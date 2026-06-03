import type { Collections } from "@nuxt/content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchLocalizedContent<T = any>(
  collectionBase: string,
  options?: {
    path?: string;
    first?: boolean;
    locale?: string;
  },
): Promise<T | null> {
  const locale = options?.locale ?? "en";
  const collection = `${collectionBase}_${locale}` as keyof Collections;
  let result: T | null = null;

  if (options?.path) {
    result = (await queryCollection(collection)
      .path(options.path)
      .first()) as unknown as T | null;
  } else if (options?.first) {
    result = (await queryCollection(collection).first()) as unknown as T | null;
  } else {
    result = (await queryCollection(collection).all()) as unknown as T | null;
  }

  if (
    (result === null || (Array.isArray(result) && result.length === 0)) &&
    locale !== "en"
  ) {
    const enCollection = `${collectionBase}_en` as keyof Collections;
    if (options?.path) {
      result = (await queryCollection(enCollection)
        .path(options.path)
        .first()) as unknown as T | null;
    } else if (options?.first) {
      result = (await queryCollection(
        enCollection,
      ).first()) as unknown as T | null;
    } else {
      result = (await queryCollection(
        enCollection,
      ).all()) as unknown as T | null;
    }
  }

  return result ?? null;
}
