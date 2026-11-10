import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ko"],
  defaultLocale: "en",
  // hreflang is emitted by us (page metadata + sitemap), where blog slugs can
  // differ per language. next-intl's automatic Link header assumes the same
  // path in every locale and would advertise URLs that don't exist.
  alternateLinks: false,
});
