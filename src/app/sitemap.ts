import type { MetadataRoute } from "next";
import { SITE } from "@/lib/schema";
import { routing } from "@/i18n/routing";
import {
  categoriesWithPosts,
  categoryUrl,
  blogUrl,
  getAllPosts,
  getFeatured,
  getTranslationSlug,
  pageCount,
  pageUrl,
  postUrl,
} from "@/lib/blog";

// Pages that currently exist under [locale]. "" is the home page.
const PATHS = ["", "/about", "/app", "/faq"] as const;

const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

// Blog URLs. Everything is derived from the published posts (drafts are
// already excluded in production), so empty languages / categories add nothing.
function blogEntries(): MetadataRoute.Sitemap {
  const byLocale = Object.fromEntries(
    routing.locales.map((l) => [l, getAllPosts(l)]),
  );
  const bothHavePosts = routing.locales.every((l) => byLocale[l].length > 0);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const posts = byLocale[locale];
    if (posts.length === 0) continue;

    // Index — hreflang only while both language indexes are real pages.
    entries.push({
      url: blogUrl(locale),
      lastModified: asDate(posts[0].updated ?? posts[0].date),
      changeFrequency: "weekly",
      priority: 0.7,
      ...(bothHavePosts && {
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, blogUrl(l)]),
          ),
        },
      }),
    });

    // Numbered pages (only when the grid overflows one page).
    const featured = getFeatured(posts);
    const grid = featured ? posts.length - 1 : posts.length;
    for (let n = 2; n <= pageCount(grid); n++) {
      entries.push({
        url: pageUrl(locale, n),
        lastModified: asDate(posts[0].updated ?? posts[0].date),
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }

    // Categories that have posts.
    for (const category of categoriesWithPosts(posts)) {
      const inCategory = posts.filter((p) => p.category === category);
      entries.push({
        url: categoryUrl(locale, category),
        lastModified: asDate(inCategory[0].updated ?? inCategory[0].date),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    // Posts — hreflang only for posts that have a translation.
    for (const post of posts) {
      const translation = getTranslationSlug(post);
      const other = locale === "ko" ? "en" : "ko";
      entries.push({
        url: postUrl(locale, post.slug),
        lastModified: asDate(post.updated ?? post.date),
        changeFrequency: "monthly",
        priority: 0.6,
        ...(translation && {
          alternates: {
            languages: {
              [locale]: postUrl(locale, post.slug),
              [other]: postUrl(other, translation),
            },
          },
        }),
      });
    }
  }
  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE.url}/${l}${path}`]),
        ),
      },
    })),
  );

  return [...pages, ...blogEntries()];
}
