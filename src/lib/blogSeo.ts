import type { Metadata } from "next";
import { SITE } from "./schema";
import { blogUrl } from "./blog";

// Shared metadata pieces for blog pages. Each blog page sets its own
// `alternates` / `openGraph` / `twitter`; Next replaces (not merges) these
// objects from the root layout, so nothing from the layout's site-wide
// canonical or hreflang leaks into blog URLs.

export const OG_LOCALE: Record<string, string> = { ko: "ko_KR", en: "en_US" };

export const DEFAULT_SOCIAL_IMAGE = `${SITE.url}/logo/logo-icon.png`;

export const absolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE.url}${path}`;

export const rssAlternate = (locale: string) => ({
  "application/rss+xml": blogUrl(locale, "/rss.xml"),
});

// Blog index family (/blog, /blog/page/n, /blog/category/x): website-type OG.
export function listSocial({
  locale,
  title,
  description,
  url,
}: {
  locale: string;
  title: string;
  description: string;
  url: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url,
      locale: OG_LOCALE[locale] ?? "en_US",
      images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 512, height: 512, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}
