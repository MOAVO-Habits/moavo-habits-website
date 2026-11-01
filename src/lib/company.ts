// Company facts shown on the About page and in the footer, and emitted in the
// Organization structured data. Single source of truth: change them here.
// (Labels and sentences live in messages/{ko,en}.json.)

export const COMPANY = {
  // Registered business name per locale (모두의아보카도 / MOAVO).
  legalName: { ko: "모두의아보카도", en: "MOAVO" },
  businessRegistrationNo: "785-74-00515",
  email: "moavohabits@gmail.com",
  address: { locality: "Seoul", country: "KR" },
} as const;

export function companyLegalName(locale: string): string {
  return locale === "ko" ? COMPANY.legalName.ko : COMPANY.legalName.en;
}
