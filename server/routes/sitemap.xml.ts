import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { defineEventHandler, setHeader } from "h3";

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function getBlogEntries(locale: "en" | "fa"): Promise<SitemapEntry[]> {
  const blogDir = join(process.cwd(), "content", locale, "blog");
  const files = await readdir(blogDir);

  return Promise.all(
    files
      .filter((file) => file.endsWith(".md") && file !== "index.md")
      .map(async (file) => {
        const filePath = join(blogDir, file);
        const fileStats = await stat(filePath);
        const slug = file.replace(/\.md$/, "");

        return {
          path: locale === "fa" ? `/fa/blog/${slug}` : `/blog/${slug}`,
          lastmod: fileStats.mtime.toISOString(),
        };
      }),
  );
}

export default defineEventHandler(async (event) => {
  const siteUrl = "https://soroushalinia.ir";
  const staticEntries: SitemapEntry[] = [
    { path: "/" },
    { path: "/about" },
    { path: "/projects" },
    { path: "/blog" },
    { path: "/contact" },
    { path: "/fa" },
    { path: "/fa/about" },
    { path: "/fa/projects" },
    { path: "/fa/blog" },
    { path: "/fa/contact" },
  ];

  const blogEntries = await Promise.all([
    getBlogEntries("en"),
    getBlogEntries("fa"),
  ]);
  const entries = [...staticEntries, ...blogEntries.flat()];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(({ path, lastmod }) => {
    const lines = [
      "  <url>",
      `    <loc>${escapeXml(new URL(path, siteUrl).toString())}</loc>`,
    ];

    if (lastmod) {
      lines.push(`    <lastmod>${lastmod}</lastmod>`);
    }

    lines.push("  </url>");
    return lines.join("\n");
  })
  .join("\n")}
</urlset>`;

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return xml;
});
