import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import StoreButtons from "@/components/StoreButtons";
import { BlogCard } from "@/components/blog/BlogCard";
import { mdxComponents } from "@/components/blog/mdxComponents";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  formatDate,
  getAllPosts,
  getPost,
  getTranslationSlug,
  postUrl,
  related,
  type BlogPost,
} from "@/lib/blog";
import { categoryName } from "@/lib/blogCategories";
import {
  DEFAULT_SOCIAL_IMAGE,
  OG_LOCALE,
  absolute,
  rssAlternate,
} from "@/lib/blogSeo";
import { blogPostingSchema, personSchema, SITE } from "@/lib/schema";

type Props = { params: Promise<{ locale: string; slug: string }> };

const AUTHOR = "JAE Dokgo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ locale, slug: post.slug })),
  );
}

// hreflang pairs exist only for posts that have a translation.
function languageAlternates(post: BlogPost) {
  const translation = getTranslationSlug(post);
  if (!translation) return undefined;
  const other = post.locale === "ko" ? "en" : "ko";
  const urls = {
    [post.locale]: postUrl(post.locale, post.slug),
    [other]: postUrl(other, translation),
  };
  return { ...urls, "x-default": urls.en };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};

  const url = postUrl(locale, post.slug);
  const image = post.cover ? absolute(post.cover) : DEFAULT_SOCIAL_IMAGE;
  const languages = languageAlternates(post);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
      types: rssAlternate(locale),
    },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      title: post.title,
      description: post.description,
      url,
      locale: OG_LOCALE[locale] ?? "en_US",
      publishedTime: `${post.date}T00:00:00Z`,
      modifiedTime: `${post.updated ?? post.date}T00:00:00Z`,
      authors: [AUTHOR],
      section: categoryName(locale, post.category),
      tags: post.tags,
      images: [{ url: image, alt: post.coverAlt ?? post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const home = await getTranslations({ locale, namespace: "HomePage" });

  const url = postUrl(locale, post.slug);
  const translation = getTranslationSlug(post);
  const other = locale === "ko" ? "en" : "ko";
  const relatedPosts = related(post);
  const catName = categoryName(locale, post.category);

  return (
    <>
      <JsonLd
        data={[
          personSchema({ locale }),
          blogPostingSchema({
            locale,
            url,
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            image: post.cover ? absolute(post.cover) : undefined,
          }),
        ]}
      />
      <Header
        locale={locale}
        localeHrefs={{
          [locale]: `/blog/${post.slug}`,
          // Land on the translation when there is one, else the blog index.
          [other]: translation ? `/blog/${translation}` : "/blog",
        }}
      />

      <main>
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <Link
            href="/blog"
            className="text-sm font-semibold text-green-2 hover:text-green-3"
          >
            ← {t("backToBlog")}
          </Link>

          <header className="mt-6">
            <Link
              href={`/blog/category/${post.category}`}
              className="inline-block rounded-full bg-green-1 px-3 py-1 text-sm font-semibold text-green-3 hover:bg-green-1/70"
            >
              {catName}
            </Link>
            <h1 className="mt-4 text-headline3 break-words text-green-3">
              {post.title}
            </h1>
            <p className="mt-4 text-text5 font-medium text-green-3/70">
              {post.description}
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-green-3/70">
              <Link
                href="/about"
                className="text-green-3 underline underline-offset-4 hover:text-green-2"
              >
                {AUTHOR}
              </Link>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatDate(locale, post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{t("minutes", { count: post.readingMinutes })}</span>
              {post.updated && post.updated !== post.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.updated}>
                    {t("updatedOn", { date: formatDate(locale, post.updated) })}
                  </time>
                </>
              )}
            </p>
          </header>

          {post.cover && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-green-1">
              <Image
                src={post.cover}
                alt={post.coverAlt ?? post.title}
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-10 text-[1.0625rem] leading-8 font-medium break-words text-green-3/90">
            <MDXRemote source={post.body} components={mdxComponents} />
          </div>
        </article>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-3xl rounded-3xl bg-green-3 px-6 py-10 text-center md:px-10">
            <h2 className="text-subtitle2 text-pure-white">
              {t("installTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-text5 font-medium text-green-1/90">
              {t("installBody")}
            </p>
            <div className="mt-6 flex justify-center">
              <StoreButtons
                appStoreLabel={home("cta.ctaAppStore")}
                googlePlayLabel={home("cta.ctaGooglePlay")}
                variant="light"
              />
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="bg-gray-1">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <h2 className="text-subtitle2 text-green-3">
                {t("relatedTitle")}
              </h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
