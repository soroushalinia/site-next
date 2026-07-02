import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { defineEventHandler, setHeader } from "h3";

interface FeedItem {
  title: string;
  description: string;
  url: string;
  date: string;
  tags: string[];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match)
    return { title: "", description: "", date: "", tags: [] as string[] };

  const yaml = match[1]!;
  const fields: Record<string, string> = {};
  const tags: string[] = [];

  for (const line of yaml.split("\n")) {
    const kvMatch = line.match(/^(\w+):\s*(.+)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1]!;
    let value = kvMatch[2]!.trim();

    if (key === "tags") {
      const tagMatch = value.match(/\[([\s\S]*?)\]/);
      if (tagMatch) {
        const raw = tagMatch[1]!;
        for (const t of raw.split(",")) {
          const tag = t.trim().replace(/^["']|["']$/g, "");
          if (tag) tags.push(tag);
        }
      }
      continue;
    }

    value = value.replace(/^["']|["']$/g, "");
    fields[key] = value;
  }

  return {
    title: fields.title || "",
    description: fields.description || "",
    date: fields.date || "",
    tags,
  };
}

function formatRssDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export default defineEventHandler(async (event) => {
  const siteUrl = "https://soroushalinia.ir";
  const blogDir = join(process.cwd(), "content", "en", "blog");
  const files = await readdir(blogDir);

  const items: FeedItem[] = (
    await Promise.all(
      files
        .filter((f) => f.endsWith(".md"))
        .map(async (file) => {
          const content = await readFile(join(blogDir, file), "utf-8");
          const { title, description, date, tags } = parseFrontmatter(content);
          const slug = file.replace(/\.md$/, "");
          const fileStats = await stat(join(blogDir, file));

          return {
            title,
            description,
            url: `${siteUrl}/blog/${slug}`,
            date: date || fileStats.mtime.toISOString(),
            tags,
          };
        }),
    )
  ).filter((item) => item.title);

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Soroush Alinia</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Thoughts on software engineering, security, and Linux</description>
    <language>en</language>
    <lastBuildDate>${items.length ? items[0]!.date : new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatRssDate(item.date)}</pubDate>
      ${item.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`,
      )
      .join("\n")}
  </channel>
</rss>`;

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return xml;
});
