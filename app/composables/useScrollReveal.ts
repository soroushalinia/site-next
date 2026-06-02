export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null);
  const mo = ref<MutationObserver | null>(null);
  const observedElements = new Set<Element>();

  function scan() {
    if (!observer.value) return;
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
      if (!observedElements.has(el)) {
        observer.value!.observe(el);
        observedElements.add(el);
      }
    });
  }

  onMounted(() => {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.value!.unobserve(entry.target);
            observedElements.delete(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );

    scan();

    mo.value = new MutationObserver(scan);
    mo.value.observe(document.body, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    observedElements.forEach((el) => {
      el.classList.remove("visible");
    });
    observer.value?.disconnect();
    mo.value?.disconnect();
  });
}
