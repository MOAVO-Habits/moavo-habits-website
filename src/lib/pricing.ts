// Subscription prices per locale (ko = KRW, en = USD store prices).
// Feeds the JSON-LD offers in softwareApplicationSchema(). The visible
// pricing copy lives in messages/*.json (AppPage.pricing, FaqPage) — keep the
// numbers here in sync with it when prices change.

export const PRICING = {
  ko: { currency: "KRW", monthly: "3000", yearly: "30000" },
  en: { currency: "USD", monthly: "2.99", yearly: "28.99" },
} as const;

export function getPricing(locale: string) {
  return PRICING[locale as keyof typeof PRICING] ?? PRICING.en;
}
