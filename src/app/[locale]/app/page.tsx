import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MultilineText from "@/components/MultilineText";
import StoreButtons from "@/components/StoreButtons";
import FeatureRow from "@/components/FeatureRow";

type PillarItem = {
  subtitle: string;
  body: string;
};

// KO-only for now — screenshots live under /screenshots/ko/ and /screenshots/en/,
// so this can become locale-aware once English placement is confirmed.
const SCREENSHOTS = {
  hero: "/screenshots/ko/1_시스템.png",
  pillar1: "/screenshots/ko/2_정체성기반.png",
  pillar2: [
    "/screenshots/ko/4_AI러닝메이트.png",
    "/screenshots/ko/5_AI분석리포트.png",
    "/screenshots/ko/7_축하애니메이션.png",
    "/screenshots/ko/8_AVO스마트위젯.png",
  ],
  pillar3: ["/screenshots/ko/3_히트맵성취감.png", "/screenshots/ko/6_통계.png"],
};

export default function AppPage() {
  const t = useTranslations("AppPage");
  const locale = useLocale();

  const pillar2Items = t.raw("pillar2.items") as PillarItem[];
  const pillar3Items = t.raw("pillar3.items") as PillarItem[];
  const audienceItems = t.raw("audience.items") as string[];

  return (
    <>
      <Header locale={locale} />

      <main>
        {/* Hero */}
        <section className="bg-green-1">
          <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-6 py-32 md:flex-row md:py-40">
            <div className="flex flex-1 flex-col items-start gap-6 text-left">
              <MultilineText
                as="h1"
                text={t("hero.headline")}
                className="text-headline1 text-green-3"
              />
              <MultilineText
                text={t("hero.body")}
                className="max-w-md text-text5 text-gray-4"
              />
              <StoreButtons
                appStoreLabel={t("hero.ctaAppStore")}
                googlePlayLabel={t("hero.ctaGooglePlay")}
              />
            </div>
            <div className="flex flex-1 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SCREENSHOTS.hero}
                alt="모아보해빗 앱 시스템 소개 화면"
                className="w-full max-w-[16rem] rounded-3xl shadow-xl md:max-w-[19rem]"
              />
            </div>
          </div>
        </section>

        {/* Pillar 1: Identity */}
        <section className="bg-pure-white">
          <div className="mx-auto max-w-5xl px-6 py-32 md:py-40">
            <h2 className="text-center text-headline2 text-green-3">
              {t("pillar1.headline")}
            </h2>
            <div className="mt-16 flex flex-col items-center gap-10 md:flex-row md:gap-16">
              <div className="flex-1 space-y-6 text-left">
                {t("pillar1.body")
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p
                      key={i}
                      className={`whitespace-pre-line text-text5 ${
                        paragraph.startsWith("Step")
                          ? "font-bold text-green-3"
                          : "text-gray-4"
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
              <div className="flex flex-1 justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SCREENSHOTS.pillar1}
                  alt={t("pillar1.headline")}
                  className="w-full max-w-[14rem] rounded-3xl shadow-xl md:max-w-[17rem]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pillar 2: Running mate */}
        <section className="bg-gray-1">
          <div className="mx-auto max-w-5xl px-6 py-32 md:py-40">
            <h2 className="text-center text-headline2 text-green-3">
              {t("pillar2.headline")}
            </h2>
            <div className="mt-20 space-y-20 md:space-y-28">
              {pillar2Items.map((item, i) => (
                <FeatureRow
                  key={i}
                  subtitle={item.subtitle}
                  body={item.body}
                  imageSrc={SCREENSHOTS.pillar2[i]}
                  imageAlt={item.subtitle}
                  reverse={i % 2 === 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pillar 3: Visible progress */}
        <section className="bg-green-1">
          <div className="mx-auto max-w-5xl px-6 py-32 md:py-40">
            <h2 className="text-center text-headline2 text-green-3">
              {t("pillar3.headline")}
            </h2>
            <div className="mt-20 space-y-20 md:space-y-28">
              {pillar3Items.map((item, i) => (
                <FeatureRow
                  key={i}
                  subtitle={item.subtitle}
                  body={item.body}
                  imageSrc={SCREENSHOTS.pillar3[i]}
                  imageAlt={item.subtitle}
                  reverse={i % 2 === 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="bg-pure-white">
          <div className="mx-auto max-w-5xl px-6 py-32 text-center md:py-40">
            <h2 className="text-headline2 text-green-3">
              {t("audience.headline")}
            </h2>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {audienceItems.map((item, i) => (
                <span
                  key={i}
                  className="rounded-full border border-green-2 bg-green-1/40 px-5 py-2 text-text5 text-green-3"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-green-3">
          <div className="mx-auto max-w-4xl px-6 py-32 text-center md:py-40">
            <h2 className="text-headline2 text-pure-white">
              {t("pricing.headline")}
            </h2>
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-pure-white/20 bg-pure-white/5 p-8 text-left">
                <p className="text-text2 text-banana">
                  {t("pricing.free.label")}
                </p>
                <p className="mt-3 text-text5 text-green-1/90">
                  {t("pricing.free.description")}
                </p>
              </div>
              <div className="rounded-2xl border border-banana bg-pure-white/5 p-8 text-left">
                <p className="text-text2 text-banana">
                  {t("pricing.premium.label")}
                </p>
                <p className="mt-3 text-text5 text-green-1/90">
                  {t("pricing.premium.description")}
                </p>
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <StoreButtons
                appStoreLabel={t("pricing.ctaAppStore")}
                googlePlayLabel={t("pricing.ctaGooglePlay")}
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
