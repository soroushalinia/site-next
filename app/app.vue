<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const head = useLocaleHead({ dir: true, lang: true, seo: true });
useHead(head);
</script>
