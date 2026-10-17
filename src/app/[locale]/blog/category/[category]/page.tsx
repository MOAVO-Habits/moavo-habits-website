import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BlogIndex from "@/components/blog/BlogIndex";
import { categoriesWithPosts, categoryUrl, getAllPosts } from "@/lib/blog";
import { categoryName, isBlogCategory } from "@/lib/blogCategories";
import { listSocial, rssAlternate } from "@/lib/blogSeo";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categoriesWithPosts(getAllPosts(locale)).map((category) => ({
      locale,
      category,
    })),
  );
}

// Only categories that have at least one post are real pages.
function load(locale: string, category: string) {
  if (!isBlogCategory(category)) return null;
  const all = getAllPosts(locale);
  const posts = all.filter((p) => p.category === category);
  return posts.length > 0 ? { all, posts, category } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const data = load(locale, category);
  if (!data) return {};
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const name = categoryName(locale, data.category);
  const url = categoryUrl(locale, data.category);
  const title = `${name} – ${t("headline")}`;
  const description = t("categoryMetaDescription", { category: name });

  return {
    title,
    description,
    alternates: { canonical: url, types: rssAlternate(locale) },
    ...listSocial({ locale, title, description, url }),
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { locale, category } = await params;
  const data = load(locale, category);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const name = categoryName(locale, data.category);

  return (
    <BlogIndex
      locale={locale}
      title={name}
      intro={t("categoryMetaDescription", { category: name })}
      allPosts={data.all}
      posts={data.posts}
      activeCategory={data.category}
      // The same category may not exist in the other language.
      localeHrefs={{ en: "/blog", ko: "/blog" }}
    />
  );
}
