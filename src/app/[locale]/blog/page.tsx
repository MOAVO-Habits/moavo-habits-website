import { redirect } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SOCIAL_LINKS } from "@/lib/socialLinks";

export default function BlogPage() {
  const locale = useLocale();

  // The "블로그" menu item points Korean visitors straight at the Naver blog
  // (see Header.tsx / MobileMenu.tsx). Redirect here too, so a direct visit
  // to /ko/blog behaves the same way instead of hitting the EN placeholder.
  if (locale === "ko") {
    redirect(SOCIAL_LINKS.naverBlog.url);
  }

  const t = useTranslations("BlogPage");

  return (
    <>
      <Header locale={locale} />

      <main>
        <section className="bg-green-1">
          <div className="mx-auto max-w-2xl px-6 py-32 text-center md:py-40">
            <h1 className="text-headline2 text-green-3">{t("headline")}</h1>
            <p className="mx-auto mt-6 max-w-xl text-text5 text-gray-4">
              {t("body")}
            </p>
            <div className="mt-10 flex justify-center">
              <a
                href={SOCIAL_LINKS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-3 px-6 py-3 text-text5 font-semibold text-pure-white transition-colors hover:bg-green-3/90"
              >
                {t("instagramCta")}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
