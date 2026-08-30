import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LottiePlayer from "@/components/LottiePlayer";
import MultilineText from "@/components/MultilineText";
import StoreButtons from "@/components/StoreButtons";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const locale = useLocale();

  const problemPoints = t.raw("problem.points") as string[];
  const features = t.raw("features.items") as {
    title: string;
    description: string;
  }[];
  const audience = t.raw("audience.items") as {
    title: string;
    description: string;
  }[];

  // AVO character stills — see public/characters/ for the full emotion set.
  const featureIcons = [
    { src: "/characters/감정1-평온(초록).png", w: 129, h: 143 },
    { src: "/characters/감정8-기쁨(초록).png", w: 123, h: 179 },
    { src: "/characters/감정9-매우기쁨(초록).png", w: 147, h: 185 },
    { src: "/characters/감정7-놀람(초록).png", w: 113, h: 150 },
  ];
  const audienceIcons = [
    { src: "/characters/감정13-얼어죽기-직전(1).png", w: 162, h: 134 },
    { src: "/characters/노랑-커피.png", w: 266, h: 243 },
  ];
  const pointIcons = [
    { src: "/characters/감정5-슬픔(노랑).png", w: 121, h: 118 },
    { src: "/characters/감정2-기다림(초록).png", w: 142, h: 103 },
    { src: "/characters/감정3-기다리다-지침(초록).png", w: 111, h: 155 },
  ];

  const problemParagraphs = t("problem.body").split("\n\n");
  const solutionParagraphs = t("solution.body").split("\n\n");

  return (
    <>
      <Header locale={locale} />

      <main>
        {/* Hero */}
        <section className="bg-green-1">
          <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-6 py-20 md:flex-row md:py-28">
            <div className="flex flex-1 flex-col items-start gap-6 text-left">
              <h1 className="text-display3 text-green-3 md:text-display1">
                {t("hero.headline")}
              </h1>
              <p className="max-w-md text-text5 text-green-2">
                {t("hero.subheadline")}
              </p>
              <StoreButtons
                appStoreLabel={t("hero.ctaAppStore")}
                googlePlayLabel={t("hero.ctaGooglePlay")}
              />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <LottiePlayer
                path="/lottie/character-5.json"
                className="w-full max-w-sm"
              />
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="bg-pure-white">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h2 className="text-headline3 text-green-3">
              {t("problem.headline")}
            </h2>
            <div className="mx-auto mt-6 max-w-2xl space-y-4">
              {problemParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={`whitespace-pre-line ${
                    i === problemParagraphs.length - 1
                      ? "text-text2 font-bold text-green-3"
                      : "text-text5 text-gray-4"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {problemPoints.map((point, i) => (
                <div
                  key={point}
                  className="rounded-2xl bg-green-1 p-6 text-text5 font-semibold text-green-3"
                >
                  <Image
                    src={pointIcons[i].src}
                    alt=""
                    width={pointIcons[i].w}
                    height={pointIcons[i].h}
                    className="mx-auto h-14 w-auto"
                  />
                  <p className="mt-3">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution — sector 1 */}
        <section className="bg-green-3">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-28">
            <MultilineText
              as="h2"
              text={t("solution.headline")}
              className="text-headline3 text-pure-white"
            />
            <div className="mx-auto mt-6 max-w-2xl space-y-6 text-text5 text-green-1/90">
              <p className="whitespace-pre-line">{solutionParagraphs[0]}</p>
              <div className="mt-12 flex justify-center">
                <Image
                  src="/characters/온보딩2.png"
                  alt="습관을 기록하는 모아보해빗 앱 화면"
                  width={257}
                  height={249}
                  className="h-[9.6rem] w-auto rounded-2xl sm:h-[12rem]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Solution — sector 2 */}
        <section className="bg-gray-1">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:py-28">
            <div className="flex flex-1 items-center justify-center">
              <LottiePlayer
                path="/lottie/character-2.json"
                className="w-full max-w-sm"
              />
            </div>
            <div className="flex flex-1 flex-col items-start gap-6 text-left">
              <div className="max-w-xl space-y-6 text-text5 text-green-3/90">
                {solutionParagraphs.slice(1).map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="max-w-xl border-l-4 border-green-3 pl-4 font-display text-subtitle2 text-green-3">
                {t("solution.positioning")}
              </p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="bg-pure-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-headline3 text-green-3">
              {t("features.headline")}
            </h2>
            <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((item, i) => (
                <div
                  key={item.title}
                  className="flex h-full flex-col rounded-2xl bg-gray-1 p-6"
                >
                  <div className="flex h-24 items-end">
                    <Image
                      src={featureIcons[i].src}
                      alt=""
                      width={featureIcons[i].w}
                      height={featureIcons[i].h}
                      className={`w-auto shrink-0 object-contain ${
                        i === 1 || i === 2 ? "h-[4.6rem]" : "h-16"
                      }`}
                    />
                  </div>
                  <h3 className="mt-3 text-text2 text-green-3">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-text5 text-gray-4">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="bg-green-1">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-center text-headline3 text-green-3">
              {t("audience.headline")}
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {audience.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-pure-white p-8 shadow-sm"
                >
                  <Image
                    src={audienceIcons[i].src}
                    alt=""
                    width={audienceIcons[i].w}
                    height={audienceIcons[i].h}
                    className="h-20 w-auto"
                  />
                  <h3 className="mt-4 text-text2 text-green-3">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-text5 text-gray-4">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AVO */}
        <section className="bg-banana/20">
          <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-6 py-20 md:flex-row md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-title1 text-green-3">
                {t("avo.headline")}
              </h2>
              <MultilineText
                text={t("avo.body")}
                className="mx-auto mt-6 max-w-2xl text-text5 text-green-3/80 md:mx-0"
              />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <LottiePlayer
                path="/lottie/character-3.json"
                className="w-64 md:w-80"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-3">
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="text-display3 text-pure-white">
              {t("cta.headline")}
            </h2>
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
