<template>
  <div class="min-h-screen w-full flex flex-col">
    <div
      class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -start-20 top-10 size-72 animate-blob rounded-full bg-primary/5 blur-3xl"
      />
      <div
        class="absolute -end-20 top-10 size-72 animate-blob rounded-full bg-primary/5 blur-3xl"
        style="animation-delay: 6s"
      />
    </div>
    <div><Navbar /></div>
    <div class="flex-1 w-full flex justify-center">
      <div class="max-w-4xl w-full px-4 py-8"><slot /></div>
    </div>
    <div><Footer /></div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/navigation/navbar.vue";
import Footer from "~/components/navigation/footer.vue";
</script>
