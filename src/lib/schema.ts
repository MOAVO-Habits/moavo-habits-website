// Central place for structured-data (JSON-LD) builders and site constants.
// Keeping schema separate from page components makes the emitted markup easy
// to audit and update as store links, pricing, or profiles change.

import { getStoreLinks } from "./storeLinks";
import { getPricing } from "./pricing";
import { SOCIAL_LINKS } from "./socialLinks";

export const SITE = {
  url: "https://moavohabits.com",
  name: "MOAVO Habits",
  legalName: "MOAVO", // English brand/legal name
  logo: "https://moavohabits.com/logo/logo-icon.png",
} as const;

// Founder name as used in structured data. Both the site-wide founder node and
// the fuller personSchema() use it, so the two nodes sharing the #founder @id
// can never disagree. (On-page text is written separately in messages/.)
const FOUNDER_NAME = "Jae Dokgo";

type Localized = {
  locale: string;
  path: string; // pathname without domain, e.g. "/about" or "" for home
};

// ---------------------------------------------------------------------------
// Organization — emitted site-wide from the root layout.
// ---------------------------------------------------------------------------
export function organizationSchema({ locale }: Pick<Localized, "locale">) {
  const description =
    locale === "ko"
      ? "모아보해빗은 AI 습관 일기 앱을 만들고, 행동과학과 습관 시스템을 연구합니다."
      : "MOAVO Habits makes an AI habit journal app and studies behavioral science and habit systems.";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: ["MOAVO Habits", "모아보해빗"],
    description,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: SITE.logo,
    },
    founder: { "@id": `${SITE.url}/#founder` },
    sameAs: [
      SOCIAL_LINKS.instagram.url,
      SOCIAL_LINKS.threads.url,
      SOCIAL_LINKS.naverBlog.url,
    ],
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
    alternateName: ["모아보해빗", "MOAVO"],
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: ["en", "ko"],
  };
}

// ---------------------------------------------------------------------------
// Founder (minimal) — emitted site-wide next to Organization so that
// Organization.founder (and BlogPosting.author) always resolve to a node on
// the same page. The About page and blog posts additionally emit the fuller
// personSchema() below under the same @id.
// ---------------------------------------------------------------------------
export function founderSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#founder`,
    name: FOUNDER_NAME,
    worksFor: { "@id": `${SITE.url}/#organization` },
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
    name: FOUNDER_NAME,
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
      ? "한 줄을 쓰면 AI 코치 AVO가 응원과 피드백으로 답해 주는 AI 습관 일기 앱. 기록은 행동 패턴을 보여주는 데이터가 됩니다."
      : "An AI habit journal app. Write one line and AI coach AVO replies with encouragement and feedback; your entries become data that reveals your behavior patterns.";

  const links = getStoreLinks(locale);
  const pricing = getPricing(locale);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#app`,
    name: SITE.name,
    operatingSystem: "iOS, Android",
    applicationCategory: "HealthApplication",
    description,
    url: `${SITE.url}/${locale}/app`,
    downloadUrl: [links.appStore, links.googlePlay],
    author: { "@id": `${SITE.url}/#organization` },
    // Free plan + subscription tiers.
    offers: [
      {
        "@type": "Offer",
        name: locale === "ko" ? "무료 플랜" : "Free plan",
        price: "0",
        priceCurrency: pricing.currency,
      },
      {
        "@type": "Offer",
        name: locale === "ko" ? "월 구독" : "Monthly subscription",
        price: pricing.monthly,
        priceCurrency: pricing.currency,
      },
      {
        "@type": "Offer",
        name: locale === "ko" ? "연 구독" : "Annual subscription",
        price: pricing.yearly,
        priceCurrency: pricing.currency,
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

// ---------------------------------------------------------------------------
// Blog — list pages (Blog) and posts (BlogPosting).
// author/publisher reference the Person/Organization nodes by @id; post pages
// also emit personSchema() so the founder @id resolves on the same page.
// ---------------------------------------------------------------------------
type BlogListItem = {
  headline: string;
  url: string;
  datePublished: string;
};

export function blogSchema({
  locale,
  name,
  description,
  url,
  posts,
}: {
  locale: string;
  name: string;
  description: string;
  url: string;
  posts: BlogListItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/${locale}/blog#blog`,
    name,
    description,
    url,
    inLanguage: locale,
    publisher: { "@id": `${SITE.url}/#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.headline,
      url: p.url,
      datePublished: p.datePublished,
    })),
  };
}

export function blogPostingSchema({
  locale,
  url,
  headline,
  description,
  datePublished,
  dateModified,
  image,
}: {
  locale: string;
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline,
    description,
    datePublished,
    dateModified,
    inLanguage: locale,
    ...(image ? { image } : {}),
    author: { "@id": `${SITE.url}/#founder` },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}
