export function useLocaleInfo() {
  const { locale } = useI18n();

  const isFa = computed(() => locale.value === "fa");
  const prefix = computed(() => (isFa.value ? "/fa" : ""));
  const langCode = computed(() => (isFa.value ? "fa-IR" : "en-US"));

  const toPersianDigits = (n: number): string => {
    return n.toLocaleString("fa-IR");
  };

  const toDisplayNumber = (n: number): string => {
    return isFa.value ? toPersianDigits(n) : String(n);
  };

  return {
    isFa,
    prefix,
    langCode,
    toPersianDigits,
    toDisplayNumber,
  };
}
