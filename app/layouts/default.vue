<template>
  <div class="min-h-screen w-full flex flex-col">
    <div
      class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        v-if="showBlobs"
        class="absolute -start-20 -top-20 size-96 animate-blob-fish rounded-full bg-gradient-to-br from-primary/25 to-primary/5 blur-3xl"
      />
      <div
        v-if="showBlobs"
        class="absolute -end-20 -bottom-20 size-96 animate-blob rounded-full bg-gradient-to-tl from-primary/20 to-primary/5 blur-3xl"
        style="animation-delay: 6s"
      />
    </div>
    <div><Navbar /></div>
    <main class="flex-1 w-full flex justify-center">
      <div class="max-w-4xl w-full px-4 py-8"><slot /></div>
    </main>
    <div><Footer /></div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/navigation/navbar.vue";
import Footer from "~/components/navigation/footer.vue";

const route = useRoute();
const showBlobs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  return !segments.includes("blog");
});
</script>
