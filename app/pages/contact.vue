<script setup lang="ts">
const { t } = useI18n();

useScrollReveal();

const emailAddr = `${t("contact_page.email_user")}@${t("contact_page.email_domain")}`;
const emailAlt = `${t("contact_page.email_alt_user")}@${t("contact_page.email_alt_domain")}`;

const links = [
  {
    label: t("contact_page.email"),
    value: emailAddr,
    icon: "i-lucide-mail",
    href: `mailto:${emailAddr}`,
  },
  {
    label: t("contact_page.email"),
    value: emailAlt,
    icon: "i-lucide-mail",
    href: `mailto:${emailAlt}`,
  },
  {
    label: t("contact_page.github"),
    value: "github.com/soroushalinia",
    icon: "i-lucide-github",
    href: "https://github.com/soroushalinia",
  },
  {
    label: t("contact_page.linkedin"),
    value: "linkedin.com/in/soroushalinia",
    icon: "i-lucide-linkedin",
    href: "https://linkedin.com/in/soroushalinia",
  },
];

const name = ref("");
const email = ref("");
const message = ref("");
const status = ref<"idle" | "sending" | "success" | "error">("idle");

const {
  public: { web3formsKey },
} = useRuntimeConfig();

const submitForm = async () => {
  status.value = "sending";

  if (!web3formsKey) {
    console.warn(
      "[contact] runtimeConfig keys:",
      Object.keys(useRuntimeConfig().public),
    );
    status.value = "error";
    return;
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3formsKey,
        name: name.value,
        email: email.value,
        message: message.value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      status.value = "success";
      name.value = "";
      email.value = "";
      message.value = "";
    } else {
      console.warn("[contact] Web3Forms error:", data);
      status.value = "error";
    }
  } catch (err) {
    console.warn("[contact] fetch error:", err);
    status.value = "error";
  }
};

useSeoMeta({
  title: t("contact_page.title"),
  description: t("contact_page.description"),
});
</script>

<template>
  <div class="flex flex-col gap-8 py-12">
    <div class="text-center reveal">
      <h1 class="text-3xl sm:text-4xl font-bold">
        {{ t("contact_page.title") }}
      </h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="ltr">
      <a
        v-for="(link, i) in links"
        :key="link.label"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-4 rounded-lg border p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-md group reveal"
        :style="{ animationDelay: `${i * 100}ms` }"
      >
        <div
          class="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0"
        >
          <UIcon
            :name="link.icon"
            class="size-5 text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium">{{ link.label }}</p>
          <p class="text-sm text-muted-foreground truncate">{{ link.value }}</p>
        </div>
      </a>
    </div>

    <form
      class="rounded-lg border p-6 space-y-4 reveal"
      @submit.prevent="submitForm"
    >
      <div class="space-y-1.5">
        <label class="text-sm font-medium">{{
          t("contact_page.form_name")
        }}</label>
        <input
          v-model="name"
          :placeholder="t('contact_page.form_placeholder_name')"
          required
          class="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">{{
          t("contact_page.form_email")
        }}</label>
        <input
          v-model="email"
          type="email"
          :placeholder="t('contact_page.form_placeholder_email')"
          required
          class="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">{{
          t("contact_page.form_message")
        }}</label>
        <textarea
          v-model="message"
          :placeholder="t('contact_page.form_placeholder_message')"
          required
          rows="4"
          class="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="status === 'sending'"
        class="btn btn--primary btn--sm w-full"
      >
        <span
          v-if="status === 'sending'"
          class="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        ></span>
        {{ t("contact_page.form_submit") }}
      </button>

      <p
        v-if="status === 'success'"
        class="text-sm text-green-600 dark:text-green-400 text-center"
      >
        {{ t("contact_page.form_success") }}
      </p>
      <p
        v-else-if="status === 'error'"
        class="text-sm text-destructive text-center"
      >
        {{ t("contact_page.form_error") }}
      </p>
    </form>
  </div>
</template>
