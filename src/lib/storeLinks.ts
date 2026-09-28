// Single source of truth for App Store / Google Play links.
// Used by <StoreButtons /> (UI) and softwareApplicationSchema() (JSON-LD).

export const STORE_LINKS = {
  ko: {
    appStore:
      "https://apps.apple.com/kr/app/%EB%AA%A8%EC%95%84%EB%B3%B4%ED%95%B4%EB%B9%97-moavo-habits-ai-%EC%8A%B5%EA%B4%80-%EC%BD%94%EC%B9%AD/id6766134993",
    googlePlay:
      "https://play.google.com/store/apps/details?id=com.moavohabits&pcampaignid=web_share",
  },
  en: {
    appStore:
      "https://apps.apple.com/us/app/moavo-habits-ai-coaching/id6766134993",
    googlePlay:
      "https://play.google.com/store/apps/details?id=com.moavohabits&hl=en",
  },
} as const;

export function getStoreLinks(locale: string) {
  return STORE_LINKS[locale as keyof typeof STORE_LINKS] ?? STORE_LINKS.en;
}
