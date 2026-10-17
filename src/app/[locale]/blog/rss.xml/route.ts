import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { blogUrl, getAllPosts, postUrl } from "@/lib/blog";
import { categoryName } from "@/lib/blogCategories";

// Per-language RSS feed: /ko/blog/rss.xml and /en/blog/rss.xml.
// Drafts never appear in production (getAllPosts drops them).

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const xml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response("Not found", { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const posts = getAllPosts(locale);
  const feedUrl = blogUrl(locale, "/rss.xml");

  const items = posts
    .map(
      (p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${postUrl(locale, p.slug)}</link>
      <guid isPermaLink="true">${postUrl(locale, p.slug)}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <category>${xml(categoryName(locale, p.category))}</category>
      <description>${xml(p.description)}</description>
    </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(t("headline"))}</title>
    <link>${blogUrl(locale)}</link>
    <description>${xml(t("metaDescription"))}</description>
    <language>${locale}</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />${
      posts.length ? `\n    <lastBuildDate>${rfc822(posts[0].updated ?? posts[0].date)}</lastBuildDate>` : ""
    }
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
