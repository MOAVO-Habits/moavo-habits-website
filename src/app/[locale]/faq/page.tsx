import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Accordion from "@/components/Accordion";

type Category = {
  title: string;
  items: { q: string; a: string }[];
};

export default function FaqPage() {
  const t = useTranslations("FaqPage");
  const locale = useLocale();

  const categories = t.raw("categories") as Category[];

  return (
    <>
      <Header locale={locale} />

      <main>
        {/* Hero */}
        <section className="bg-green-1">
          <div className="mx-auto max-w-4xl px-6 pt-32 pb-12 text-center md:pt-40 md:pb-16">
            <h1 className="text-headline1 text-green-3">{t("headline")}</h1>
            <p className="mt-3 text-text3 font-semibold tracking-widest text-green-2 uppercase">
              FAQ
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-pure-white">
          <div className="mx-auto max-w-3xl px-6 pt-12 pb-32 md:pt-16 md:pb-40">
            <div className="space-y-20">
              {categories.map((category, i) => (
                <div key={i}>
                  <h2 className="text-subtitle2 font-bold text-green-3">
                    {category.title}
                  </h2>
                  <div className="mt-8">
                    <Accordion items={category.items} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
