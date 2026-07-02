<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}>();
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :title="title"
    :width="width ? Number(width) : undefined"
    :height="height ? Number(height) : undefined"
    format="webp"
    loading="lazy"
    class="rounded-lg"
  />
</template>
