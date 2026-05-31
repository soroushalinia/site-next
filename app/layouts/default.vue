<template>
  <div class="h-screen w-full flex flex-col">
    <div><Navbar /></div>
    <div class="h-full w-full flex justify-center">
      <div class="max-w-7xl w-full px-4 py-8"><slot /></div>
    </div>
    <div><Footer /></div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/navigation/navbar.vue";
import Footer from "~/components/navigation/footer.vue";
</script>
