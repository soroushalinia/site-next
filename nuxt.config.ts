import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    preset: "github_pages",
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: ["/", "/fa"],
    },
  },
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
      collections: ["lucide", "simple-icons", "heroicons"],
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
  },
  mdc: {
    highlight: {
      theme: {
        default: "catppuccin-mocha",
        dark: "catppuccin-mocha",
        light: "catppuccin-mocha",
      },
      langs: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx",
        "vue",
        "css",
        "html",
        "bash",
        "md",
        "mdc",
        "yaml",
        "scss",
        "typescript",
        "python",
      ],
    },
  },
  content: {
    build: {
      markdown: {
        contentHeading: true,
      },
    },
  },
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
  runtimeConfig: {
    public: {
      web3formsKey: "",
    },
  },
});
