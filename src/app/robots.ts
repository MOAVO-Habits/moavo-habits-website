import type { MetadataRoute } from "next";
import { SITE } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic", "/api/keystatic"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
