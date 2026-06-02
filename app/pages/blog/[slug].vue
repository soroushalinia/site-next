<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const { locale, t } = useI18n();
const route = useRoute();

const slug = route.params.slug as string;
const blogPath = slug === "index" ? "/blog" : `/blog/${slug}`;

function toPersianDigitsStr(s: string): string {
  return s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

function walkTreeAndConvertFootnotes(node: unknown): unknown {
  if (typeof node === "string" || !Array.isArray(node)) return node;
  if (typeof node[0] === "string" && node[1] && typeof node[1] === "object") {
    const [tag, props, ...children] = node;
    const isFootnoteLink =
      tag === "a" &&
      (props.dataFootnoteRef ||
        props["data-footnote-ref"] ||
        props.dataFootnoteBackref ||
        props["data-footnote-backref"]);
    const newChildren = children.map((child: unknown) => {
      if (isFootnoteLink && typeof child === "string")
        return toPersianDigitsStr(child);
      return walkTreeAndConvertFootnotes(child);
    });
    return [tag, props, ...newChildren];
  }
  return node.map(walkTreeAndConvertFootnotes);
}

const { data: post } = await useAsyncData(
  `blog-${locale.value}-${slug}`,
  async () => {
    const collection = ("blog_" + locale.value) as keyof Collections;
    let content = await queryCollection(collection).path(blogPath).first();
    if (!content && locale.value !== "en") {
      content = await queryCollection("blog_en").path(blogPath).first();
    }
    if (content && locale.value === "fa" && content.body?.value) {
      content = {
        ...content,
        body: {
          ...content.body,
          value: walkTreeAndConvertFootnotes(content.body.value),
        },
      };
    }
    return content;
  },
  { watch: [locale] },
);

function extractTextFromMinimark(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) {
    return node.map(extractTextFromMinimark).join(" ");
  }
  return "";
}

function toPersianDigits(n: number): string {
  return n.toLocaleString("fa-IR");
}

function applyPersianFootnotes() {
  if (!contentRef.value || locale.value !== "fa") return;
  contentRef.value
    .querySelectorAll(
      "a[data-footnote-ref], .footnotes li, a[data-footnote-backref]",
    )
    .forEach((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        walker.currentNode.textContent =
          walker.currentNode.textContent!.replace(
            /\d/g,
            (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)],
          );
      }
    });
}

const readingTime = computed(() => {
  const value = post.value?.body?.value;
  if (!Array.isArray(value)) return 1;
  const text = extractTextFromMinimark(value);
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return locale.value === "fa" ? toPersianDigits(minutes) : String(minutes);
});

function extractTocFromBody(
  node: unknown,
  depth = 0,
): { id: string; depth: number; text: string }[] {
  if (!Array.isArray(node)) return [];
  const links: { id: string; depth: number; text: string }[] = [];
  for (const item of node) {
    if (typeof item !== "object" || !Array.isArray(item)) continue;
    if (typeof item[0] === "string" && item[1] && typeof item[1] === "object") {
      const tag = item[0];
      const props = item[1];
      if (/^h[1-3]$/.test(tag) && props?.id) {
        const hDepth = parseInt(tag[1]);
        const children = item.slice(2);
        const text = extractTextFromMinimark(children);
        links.push({ id: props.id, depth: hDepth, text });
      }
      links.push(...extractTocFromBody(item.slice(2), depth + 1));
    } else {
      links.push(...extractTocFromBody(item, depth + 1));
    }
  }
  return links;
}
const tocLinks = computed(() => {
  const body = post.value?.body?.value;
  if (!body) return [];
  return extractTocFromBody(body);
});

const numberedToc = computed(() => {
  const links = tocLinks.value;
  let h1 = 0,
    h2 = 0,
    h3 = 0;
  return links.map((link) => {
    if (link.depth <= 1) {
      h1++;
      h2 = 0;
      h3 = 0;
      return {
        ...link,
        number: locale.value === "fa" ? toPersianDigits(h1) : String(h1),
      };
    }
    if (link.depth === 2) {
      h2++;
      h3 = 0;
      const a = locale.value === "fa" ? toPersianDigits(h1) : String(h1);
      const b = locale.value === "fa" ? toPersianDigits(h2) : String(h2);
      return { ...link, number: `${a}.${b}` };
    }
    h3++;
    const a = locale.value === "fa" ? toPersianDigits(h1) : String(h1);
    const b = locale.value === "fa" ? toPersianDigits(h2) : String(h2);
    const c = locale.value === "fa" ? toPersianDigits(h3) : String(h3);
    return { ...link, number: `${a}.${b}.${c}` };
  });
});

const tags = computed<string[]>(() => {
  const t = post.value?.tags;
  if (Array.isArray(t)) return t;
  return [];
});

const date = computed(() => post.value?.date ?? "");

const contentRef = ref<HTMLElement | null>(null);

function addLangLabels() {
  if (!contentRef.value || !post.value?.body?.value) return;
  const langs: string[] = [];
  function walk(arr: unknown) {
    if (!Array.isArray(arr)) return;
    for (const item of arr) {
      if (typeof item === "string" || !Array.isArray(item)) continue;
      if (
        typeof item[0] === "string" &&
        item[1] &&
        typeof item[1] === "object"
      ) {
        if (item[0] === "pre" && item[1]?.language)
          langs.push(item[1].language);
        walk(item.slice(2));
      } else {
        walk(item);
      }
    }
  }
  walk(post.value.body.value);
  contentRef.value.querySelectorAll("pre").forEach((pre, i) => {
    if (pre.querySelector(".lang-label")) return;
    const lang = langs[i];
    if (!lang || lang === "text") return;
    const label = document.createElement("div");
    label.className =
      "lang-label absolute top-0 right-0 -translate-y-full px-2 py-0.5 rounded-t-md border border-b-0 text-[11px] font-medium text-muted-foreground bg-muted/50 z-10";
    label.textContent = lang;
    (pre as HTMLElement).style.position = "relative";
    pre.prepend(label);
  });
  applyPersianFootnotes();
}

onMounted(() => {
  addLangLabels();
});

watch(post, () => {
  nextTick(() => addLangLabels());
});

watch(locale, () => {
  nextTick(() => applyPersianFootnotes());
});

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <div v-if="post" class="py-12 px-4">
    <article
      :dir="locale === 'fa' ? 'rtl' : 'ltr'"
      :class="{ 'fa-footnotes': locale === 'fa' }"
    >
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">{{ post.title }}</h1>

        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground"
        >
          <time
            v-if="date"
            class="inline-flex items-baseline gap-1.5 whitespace-nowrap"
          >
            <Icon name="lucide:calendar" class="size-4.5 self-center -mt-1" />
            {{
              new Date(date).toLocaleDateString(locale === "fa" ? "fa" : "en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </time>
          <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <Icon name="lucide:clock" class="size-4.5 self-center -mt-1" />
            {{ t("blog_post.min_read", { n: readingTime }) }}
          </span>
          <span
            v-if="tags.length"
            class="inline-flex items-baseline gap-1.5 flex-wrap"
          >
            <Icon
              name="lucide:tags"
              class="size-4.5 self-center -mt-1 shrink-0"
            />
            <span class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in tags"
                :key="tag"
                class="px-2.5 py-1 rounded-sm text-xs font-medium bg-primary/20 text-accent-foreground"
              >
                {{ tag }}
              </span>
            </span>
          </span>
        </div>
      </header>

      <nav v-if="numberedToc.length" class="mb-8 p-4 rounded-lg border bg-card">
        <p class="text-sm font-semibold mb-2">
          {{ t("blog_post.table_of_contents") }}
        </p>
        <ul class="space-y-1">
          <li v-for="link in numberedToc" :key="link.id" class="text-sm">
            <a
              :href="`#${link.id}`"
              class="text-muted-foreground hover:text-foreground transition-colors"
              :class="{
                'font-semibold text-foreground': link.depth <= 1,
                'pr-4': locale === 'fa' && link.depth === 3,
                'pl-4': locale !== 'fa' && link.depth === 3,
              }"
            >
              <span class="text-primary/60 font-medium tabular-nums ml-1.5"
                >{{ link.number }}.</span
              >
              {{ link.text }}
            </a>
          </li>
        </ul>
      </nav>

      <div
        ref="contentRef"
        class="content-body [&_pre]:!direction-ltr [&_pre]:!text-left [&_code]:!direction-ltr [&_pre_code]:!font-mono [&_code]:!font-mono"
      >
        <ContentRenderer :value="post" />
      </div>
    </article>
  </div>
  <div v-else class="py-12 text-center text-muted-foreground">
    Post not found
  </div>
</template>
