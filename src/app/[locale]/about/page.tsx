import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MultilineText from "@/components/MultilineText";
import StoreButtons from "@/components/StoreButtons";
import JsonLd from "@/components/JsonLd";
import { personSchema } from "@/lib/schema";
import { COMPANY } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "about");
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const locale = useLocale();

  const founderHeadlineBlocks = t("founder.headline").split("\n\n");
  const founderNameLines = founderHeadlineBlocks[1]?.split("\n") ?? [];
  const moavoHeadlineParts = t("moavo.headline").split("\n\n");

  // Company facts: labels/values from messages, registration number from the
  // shared COMPANY constants.
  const companyRows: [string, string][] = [
    [t("company.nameLabel"), t("company.nameValue")],
    [t("company.registrationLabel"), COMPANY.businessRegistrationNo],
    [t("company.locationLabel"), t("company.locationValue")],
    [t("company.representativeLabel"), t("company.representativeValue")],
  ];

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
            <p className="mx-auto mt-4 max-w-xl pl-5 text-left text-sm font-semibold leading-normal text-pure-white/60">
              {t("moavo.research")}
            </p>
          </div>
        </section>

        {/* About Jae Dokgo */}
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

        {/* Company */}
        <section className="bg-pure-white">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <h2 className="text-center text-headline3 text-green-3">
              {t("company.headline")}
            </h2>
            <dl className="mt-10 divide-y divide-gray-2 overflow-hidden rounded-2xl border border-gray-2">
              {companyRows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
                >
                  <dt className="text-sm font-semibold text-green-3/70">
                    {label}
                  </dt>
                  <dd className="text-text5 break-words text-green-3">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-1">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
            <h2 className="text-headline3 text-green-3">
              {t("contact.headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-text5 text-gray-4">
              {t("contact.body")}
            </p>
            <p className="mt-8 text-sm font-semibold text-green-3/70">
              {t("contact.emailLabel")}
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="mt-2 inline-block max-w-full rounded-full bg-green-3 px-6 py-3 text-text5 font-semibold break-all text-pure-white transition-colors hover:bg-green-3/90"
            >
              {COMPANY.email}
            </a>
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
