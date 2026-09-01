import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MultilineText from "@/components/MultilineText";
import StoreButtons from "@/components/StoreButtons";
import JsonLd from "@/components/JsonLd";
import { personSchema } from "@/lib/schema";

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const locale = useLocale();

  const founderHeadlineBlocks = t("founder.headline").split("\n\n");
  const founderNameLines = founderHeadlineBlocks[1]?.split("\n") ?? [];
  const moavoHeadlineParts = t("moavo.headline").split("\n\n");

  return (
    <>
      <JsonLd data={personSchema({ locale })} />
      <Header locale={locale} />

      <main>
        {/* About MOAVO */}
        <section className="bg-green-3">
          <div className="mx-auto max-w-4xl px-6 py-32 md:py-40">
            <Image
              src="/logo/logo-icon.png"
              alt="MOAVO Habits"
              width={512}
              height={512}
              priority
              className="mx-auto h-20 w-20 rounded-2xl"
            />
            <h1 className="mt-6 text-center text-headline2">
              <span className="block whitespace-pre-line text-subtitle2 text-pure-white">
                {moavoHeadlineParts[0]}
              </span>
              <span className="mt-6 block whitespace-pre-line text-banana">
                {moavoHeadlineParts.slice(1).join("\n\n")}
              </span>
            </h1>
            <MultilineText
              text={t("moavo.body")}
              className="mx-auto mt-12 max-w-3xl text-left text-text5 text-green-1/90"
            />
            <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-pure-white/20 bg-pure-white/5 p-8">
              <MultilineText
                text={t("moavo.belief")}
                className="text-left text-text5 text-pure-white"
              />
            </div>
            <MultilineText
              text={t("moavo.slogan")}
              className="mx-auto mt-16 max-w-xl border-l-4 border-banana pl-4 text-left font-display text-subtitle2 text-banana"
            />
          </div>
        </section>

        {/* About JAE Dokgo */}
        <section className="bg-gray-1">
          <div className="mx-auto max-w-4xl px-6 py-32 md:py-40">
            <h2 className="text-center text-headline2 text-green-3">
              <span className="block">{founderHeadlineBlocks[0]}</span>
              <span className="mt-3 block font-normal text-green-3/70">
                {founderNameLines[0]}
              </span>
              <span className="block text-subtitle2 font-medium text-green-3/70">
                {founderNameLines[1]}
              </span>
            </h2>
            <MultilineText
              text={t("founder.body")}
              className="mx-auto mt-12 max-w-3xl text-left text-text5 text-gray-4"
            />
            <MultilineText
              text={t("founder.connector")}
              className="mx-auto mt-12 max-w-3xl text-left text-text3 text-green-3"
            />
            {t("founder.legalName") && (
              <p className="mx-auto mt-14 max-w-3xl text-left text-text5 text-gray-4/70">
                {t("founder.legalName")}
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-3">
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <MultilineText
              as="h2"
              text={t("cta.headline")}
              className="text-display3 text-pure-white"
            />
            <p className="mt-4 text-text3 text-green-1">{t("cta.subtext")}</p>
            <div className="mt-10 flex justify-center">
              <StoreButtons
                appStoreLabel={t("cta.ctaAppStore")}
                googlePlayLabel={t("cta.ctaGooglePlay")}
                variant="light"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
