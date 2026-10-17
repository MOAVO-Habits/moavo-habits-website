import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogIndex from "@/components/blog/BlogIndex";
import {
  getAllPosts,
  getFeatured,
  pageCount,
  blogUrl,
  postUrl,
  POSTS_PER_PAGE,
} from "@/lib/blog";
import { listSocial, rssAlternate } from "@/lib/blogSeo";
import { blogSchema } from "@/lib/schema";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const url = blogUrl(locale);
  const title = t("headline");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: {
      canonical: url,
      // The two blog indexes are language counterparts of each other.
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, blogUrl(l)])),
        "x-default": blogUrl(routing.defaultLocale),
      },
      types: rssAlternate(locale),
    },
    ...listSocial({ locale, title, description, url }),
    // An empty blog is a placeholder, not something to index.
    robots: getAllPosts(locale).length === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const posts = getAllPosts(locale);
  const featured = getFeatured(posts);
  const grid = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <BlogIndex
      locale={locale}
      title={t("headline")}
      intro={t("intro")}
      allPosts={posts}
      posts={grid.slice(0, POSTS_PER_PAGE)}
      featured={featured}
      pagination={{ current: 1, total: pageCount(grid.length) }}
      jsonLd={blogSchema({
        locale,
        name: t("headline"),
        description: t("metaDescription"),
        url: blogUrl(locale),
        posts: posts.map((p) => ({
          headline: p.title,
          url: postUrl(locale, p.slug),
          datePublished: p.date,
        })),
      })}
    />
  );
}
