import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE } from "./schema";

// Site-wide metadata building blocks. The root layout must NOT set a canonical
// or og:url (they would be inherited by every page); each page sets its own via
// pageMetadata().

const LOGO = `${SITE.url}/logo/logo-icon.png`;

export function openGraphBase({
  locale,
  title,
  description,
  url,
}: {
  locale: string;
  title: string;
  description: string;
  url?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: "MOAVO Habits",
    title,
    description,
    ...(url ? { url } : {}),
    locale: locale === "ko" ? "ko_KR" : "en_US",
    images: [{ url: LOGO, width: 512, height: 512, alt: "MOAVO Habits" }],
  };
}

// Static pages with their own title/description (messages: Metadata.<key>),
// mapped to their pathname without locale ("" is the home page).
const PAGE_PATHS = {
  home: "",
  about: "/about",
  app: "/app",
  faq: "/faq",
} as const;

export type MetadataPage = keyof typeof PAGE_PATHS;

// title, description, canonical, hreflang, og:* and twitter:* for a static page.
export async function pageMetadata(
  locale: string,
  page: MetadataPage,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const path = PAGE_PATHS[page];
  const url = `${SITE.url}/${locale}${path}`;
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE.url}/${l}${path}`]),
        ),
        "x-default": `${SITE.url}/${routing.defaultLocale}${path}`,
      },
    },
    // Page-level openGraph / twitter replace the layout's, so they carry the
    // full set of fields.
    openGraph: openGraphBase({ locale, title, description, url }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [LOGO],
    },
  };
}
