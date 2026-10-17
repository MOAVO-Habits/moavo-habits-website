import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BlogIndex from "@/components/blog/BlogIndex";
import {
  getAllPosts,
  getFeatured,
  pageCount,
  pageUrl,
  POSTS_PER_PAGE,
} from "@/lib/blog";
import { listSocial, rssAlternate } from "@/lib/blogSeo";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; n: string }> };

// Numbered pages exist only when the grid overflows one page.
function gridFor(locale: string) {
  const posts = getAllPosts(locale);
  const featured = getFeatured(posts);
  return {
    posts,
    grid: featured ? posts.filter((p) => p.slug !== featured.slug) : posts,
  };
}

function parsePage(n: string, total: number): number | null {
  const num = Number(n);
  return Number.isInteger(num) && num >= 2 && num <= total ? num : null;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const total = pageCount(gridFor(locale).grid.length);
    return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
      locale,
      n: String(i + 2),
    }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, n } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const page = parsePage(n, pageCount(gridFor(locale).grid.length));
  if (!page) return {};
  const url = pageUrl(locale, page);
  const title = `${t("headline")} – ${t("pageTitle", { n: page })}`;
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: { canonical: url, types: rssAlternate(locale) },
    ...listSocial({ locale, title, description, url }),
  };
}

export default async function BlogPageNumber({ params }: Props) {
  const { locale, n } = await params;
  const { posts, grid } = gridFor(locale);
  const total = pageCount(grid.length);
  const page = parsePage(n, total);
  if (!page) notFound();

  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const start = (page - 1) * POSTS_PER_PAGE;

  return (
    <BlogIndex
      locale={locale}
      title={t("headline")}
      intro={t("intro")}
      allPosts={posts}
      posts={grid.slice(start, start + POSTS_PER_PAGE)}
      pagination={{ current: page, total }}
      // Page numbers don't line up across languages.
      localeHrefs={{ en: "/blog", ko: "/blog" }}
    />
  );
}
