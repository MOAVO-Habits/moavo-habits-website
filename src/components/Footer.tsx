import { useLocale, useTranslations } from "next-intl";
import Logo from "./Logo";
import { getSocialLinks } from "@/lib/socialLinks";

const LEGAL_BASE = "https://api.moavohabits.com/v1";

function legalUrl(path: "privacy" | "tos", locale: string) {
  return locale === "ko"
    ? `${LEGAL_BASE}/${path}`
    : `${LEGAL_BASE}/${path}?lang=en`;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  Threads: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c5.2 0 8.5 3.2 8.5 8.6v2.8c0 5.4-3.3 8.6-8.5 8.6s-8.5-3.2-8.5-8.6v-2.8C3.5 5.2 6.8 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.7 10.2c0-1.6 1.3-2.6 3.1-2.6 2.3 0 3.8 1.4 3.9 3.7.1 2.6-.4 5-3.6 5.2-1.9.1-3.1-.8-3.2-2.2-.1-1.6 1.4-2.4 3.3-2.5 1.6-.1 3 .1 3.6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  "Naver Blog": (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.2 7.5v9h2.6v-4.9l3.9 4.9h2.6v-9h-2.6v4.9l-3.9-4.9H7.2Z"
        fill="currentColor"
      />
    </svg>
  ),
};

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const socialLinks = getSocialLinks(locale);

  const linkClass =
    "text-sm text-pure-white/60 underline-offset-4 transition-colors hover:text-pure-white hover:underline";

  return (
    <footer className="bg-rich-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <Logo className="[&_span]:text-pure-white" />
        <p className="text-text5 text-pure-white/60">
          © {new Date().getFullYear()} MOAVO Habits
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-pure-white/60 transition-colors hover:text-pure-white"
            >
              <span className="block h-5 w-5">{SOCIAL_ICONS[social.label]}</span>
            </a>
          ))}
        </div>
        <nav
          aria-label={t("legalNavLabel")}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          <a
            href={legalUrl("privacy", locale)}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("privacy")}
          </a>
          <a
            href={legalUrl("tos", locale)}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("terms")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
