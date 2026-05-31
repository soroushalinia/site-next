import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/content",
    "@nuxtjs/i18n",
    "@nuxt/ui",
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@tanstack/vue-query"],
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.plugin === "@tailwindcss/vite:generate:build") return;
          warn(warning);
        },
      },
    },
  },
  icon: {
    serverBundle: {
      collections: ["lucide", "simple-icons"],
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
  },
  content: {},
  i18n: {
    baseUrl: "https://soroushalinia.ir",
    locales: [
      {
        code: "en",
        name: "English",
        language: "en-US",
        dir: "ltr",
        file: "en.json",
      },
      {
        code: "fa",
        name: "Farsi",
        language: "fa-IR",
        dir: "rtl",
        file: "fa.json",
      },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "en",
    langDir: "",
  },
});
