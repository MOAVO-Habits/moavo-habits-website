// Central place for structured-data (JSON-LD) builders and site constants.
// Keeping schema separate from page components makes the emitted markup easy
// to audit and update as store links, pricing, or profiles change.

export const SITE = {
  url: "https://moavohabits.com",
  name: "MOAVO Habits",
  legalName: "MOAVO", // English brand/legal name
  logo: "https://moavohabits.com/logo/logo-icon.png",
  appStoreUrl:
    "https://apps.apple.com/kr/app/%EB%AA%A8%EC%95%84%EB%B3%B4%ED%95%B4%EB%B9%97-moavo-habits-ai-%EC%8A%B5%EA%B4%80-%EC%BD%94%EC%B9%AD/id6766134993",
  googlePlayUrl:
    "https://play.google.com/store/apps/details?id=com.moavohabits&pcampaignid=web_share",
} as const;

type Localized = {
  locale: string;
  path: string; // pathname without domain, e.g. "/about" or "" for home
};

// ---------------------------------------------------------------------------
// Organization — emitted site-wide from the root layout.
// ---------------------------------------------------------------------------
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: "MOAVO Habits",
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: SITE.logo,
    },
    founder: { "@id": `${SITE.url}/#founder` },
  };
}

// ---------------------------------------------------------------------------
// WebSite — helps search/AI understand the site as a whole.
// ---------------------------------------------------------------------------
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: ["en", "ko"],
  };
}

// ---------------------------------------------------------------------------
// Person — the founder. Emitted on the About page.
// Bilingual descriptions so the right language ships per locale.
// ---------------------------------------------------------------------------
export function personSchema({ locale }: Pick<Localized, "locale">) {
  const jobTitle =
    locale === "ko" ? "행동 시스템 디자이너" : "Behavior System Designer";
  const description =
    locale === "ko"
      ? "모아보해빗(MOAVO Habits)의 창업자이자 행동 시스템 디자이너. 리테일, 레스토랑, 오피스, 병원 등 물리적 공간을 설계한 경험을 바탕으로 '환경이 행동을 만든다'는 원리를 디지털 습관 시스템에 적용했다."
      : "Founder of MOAVO Habits and a behavior system designer. Drawing on years designing physical spaces — retail, restaurants, offices, and hospitals — he applies the principle that environment shapes behavior to digital habit systems.";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#founder`,
    name: "JAE Dokgo",
    legalName: "Jae-Young Dokgo",
    jobTitle,
    description,
    worksFor: { "@id": `${SITE.url}/#organization` },
    url: `${SITE.url}/${locale}/about`,
  };
}

// ---------------------------------------------------------------------------
// SoftwareApplication — the app. Emitted on the App page.
// aggregateRating intentionally omitted until the review sample is large
// enough to represent accurately (small samples risk rich-result penalties).
// ---------------------------------------------------------------------------
export function softwareApplicationSchema({ locale }: Pick<Localized, "locale">) {
  const description =
    locale === "ko"
      ? "매일의 작은 행동을 원하는 정체성으로 바꿔주는 AI 습관 코칭 앱. AI 코치 AVO가 실제 기록에 반응하는 코멘트와 행동분석 리포트를 제공한다."
      : "An AI-powered habit coaching app that turns small daily actions into the identity you want. AI coach AVO responds to your real records with comments and behavioral reports.";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#app`,
    name: SITE.name,
    operatingSystem: "iOS, Android",
    applicationCategory: "HealthApplication",
    description,
    url: `${SITE.url}/${locale}/app`,
    downloadUrl: [SITE.appStoreUrl, SITE.googlePlayUrl],
    author: { "@id": `${SITE.url}/#organization` },
    // Free plan + subscription tiers.
    offers: [
      {
        "@type": "Offer",
        name: locale === "ko" ? "무료 플랜" : "Free plan",
        price: "0",
        priceCurrency: "KRW",
      },
      {
        "@type": "Offer",
        name: locale === "ko" ? "월 구독" : "Monthly subscription",
        price: "3000",
        priceCurrency: "KRW",
      },
      {
        "@type": "Offer",
        name: locale === "ko" ? "연 구독" : "Annual subscription",
        price: "30000",
        priceCurrency: "KRW",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// FAQPage — built from the same translated Q&A the page renders.
// ---------------------------------------------------------------------------
type FaqCategory = {
  title: string;
  items: { q: string; a: string }[];
};

export function faqPageSchema(categories: FaqCategory[]) {
  const questions = categories.flatMap((c) => c.items);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
