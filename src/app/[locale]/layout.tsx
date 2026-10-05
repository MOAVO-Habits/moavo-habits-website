import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script"; // ★ 추가
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { pretendard, lobster, plaster } from "@/fonts";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, webSiteSchema, SITE } from "@/lib/schema";
import "../globals.css";

const GA_ID = "G-HSK22G9S6M"; // ★ 추가

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("title");
  const description = t("description");

  // Per-locale canonical + hreflang alternates so Google treats /en and /ko
  // as language variants of one page rather than duplicate content.
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE.url}/${l}`]),
  );

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    alternates: {
      canonical: `${SITE.url}/${locale}`,
      languages: {
        ...languages,
        "x-default": `${SITE.url}/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "MOAVO Habits",
      title,
      description,
      url: `${SITE.url}/${locale}`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: [
        {
          url: `${SITE.url}/logo/logo-icon.png`,
          width: 512,
          height: 512,
          alt: "MOAVO Habits",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.url}/logo/logo-icon.png`],
    },
    verification: {
      other: {
        "naver-site-verification": "2b0bec4705d11d28b01e23b7f4d428185b5ef572",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${pretendard.variable} ${lobster.variable} ${plaster.variable}`}
    >
      <body className="min-h-screen bg-pure-white font-sans text-rich-black antialiased">
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        {/* ★ 추가: Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
