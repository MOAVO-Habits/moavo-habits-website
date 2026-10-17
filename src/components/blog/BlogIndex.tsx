import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { categoryName, type BlogCategorySlug } from "@/lib/blogCategories";
import {
  categoriesWithPosts,
  shouldShowChips,
  type BlogPost,
} from "@/lib/blog";
import { BlogCard, FeaturedCard } from "./BlogCard";

type Props = {
  locale: string;
  title: string;
  intro: string;
  // Every post in this language — decides whether the category chips show.
  allPosts: BlogPost[];
  // Cards for this page.
  posts: BlogPost[];
  featured?: BlogPost;
  activeCategory?: BlogCategorySlug;
  pagination?: { current: number; total: number };
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  // Where the EN/KO switcher goes (defaults to the same path).
  localeHrefs?: Record<string, string>;
};

const chipBase =
  "rounded-full px-4 py-2 text-sm font-semibold transition-colors";

function pageHref(n: number) {
  return n <= 1 ? "/blog" : `/blog/page/${n}`;
}

export default async function BlogIndex({
  locale,
  title,
  intro,
  allPosts,
  posts,
  featured,
  activeCategory,
  pagination,
  jsonLd,
  localeHrefs,
}: Props) {
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const showChips = shouldShowChips(allPosts);
  const empty = allPosts.length === 0;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <Header locale={locale} localeHrefs={localeHrefs} />

      <main>
        <section className="bg-green-1">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
            <h1 className="text-headline2 break-words text-green-3">{title}</h1>
            <p className="mx-auto mt-5 max-w-xl text-text5 text-gray-4">
              {intro}
            </p>
          </div>
        </section>

        <section className="bg-pure-white">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            {empty ? (
              <p className="py-16 text-center text-text5 text-gray-4">
                {t("empty")}
              </p>
            ) : (
              <>
                {showChips && (
                  <nav
                    aria-label={t("categoryNavLabel")}
                    className="mb-10 flex flex-wrap gap-2"
                  >
                    <Link
                      href="/blog"
                      aria-current={activeCategory ? undefined : "page"}
                      className={`${chipBase} ${
                        activeCategory
                          ? "bg-gray-1 text-green-3 hover:bg-gray-2"
                          : "bg-green-3 text-pure-white"
                      }`}
                    >
                      {t("allCategories")}
                    </Link>
                    {categoriesWithPosts(allPosts).map((slug) => (
                      <Link
                        key={slug}
                        href={`/blog/category/${slug}`}
                        aria-current={activeCategory === slug ? "page" : undefined}
                        className={`${chipBase} ${
                          activeCategory === slug
                            ? "bg-green-3 text-pure-white"
                            : "bg-gray-1 text-green-3 hover:bg-gray-2"
                        }`}
                      >
                        {categoryName(locale, slug)}
                      </Link>
                    ))}
                  </nav>
                )}

                {featured && (
                  <div className="mb-10">
                    <FeaturedCard post={featured} label={t("featured")} />
                  </div>
                )}

                {posts.length > 0 && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}

                {pagination && pagination.total > 1 && (
                  <nav
                    aria-label={t("paginationLabel")}
                    className="mt-12 flex flex-wrap items-center justify-center gap-2"
                  >
                    {pagination.current > 1 && (
                      <Link
                        href={pageHref(pagination.current - 1)}
                        rel="prev"
                        className={`${chipBase} bg-gray-1 text-green-3 hover:bg-gray-2`}
                      >
                        {t("prev")}
                      </Link>
                    )}
                    {Array.from({ length: pagination.total }, (_, i) => i + 1).map(
                      (n) => (
                        <Link
                          key={n}
                          href={pageHref(n)}
                          aria-current={n === pagination.current ? "page" : undefined}
                          className={`${chipBase} min-w-10 text-center ${
                            n === pagination.current
                              ? "bg-green-3 text-pure-white"
                              : "bg-gray-1 text-green-3 hover:bg-gray-2"
                          }`}
                        >
                          {n}
                        </Link>
                      ),
                    )}
                    {pagination.current < pagination.total && (
                      <Link
                        href={pageHref(pagination.current + 1)}
                        rel="next"
                        className={`${chipBase} bg-gray-1 text-green-3 hover:bg-gray-2`}
                      >
                        {t("next")}
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}

            <p className="mt-12 text-center text-sm font-semibold">
              <a
                href={`/${locale}/blog/rss.xml`}
                className="text-green-2 underline underline-offset-4 hover:text-green-3"
              >
                {t("rss")}
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
