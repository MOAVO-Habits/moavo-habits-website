import type { MetadataRoute } from "next";
import { SITE } from "@/lib/schema";
import { routing } from "@/i18n/routing";

// Pages that currently exist under [locale]. "" is the home page.
const PATHS = ["", "/about", "/app", "/faq"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE.url}/${l}${path}`]),
        ),
      },
    })),
  );
}
