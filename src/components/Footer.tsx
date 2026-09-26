import { useLocale, useTranslations } from "next-intl";
import Logo from "./Logo";

const LEGAL_BASE = "https://api.moavohabits.com/v1";

function legalUrl(path: "privacy" | "tos", locale: string) {
  return locale === "ko"
    ? `${LEGAL_BASE}/${path}`
    : `${LEGAL_BASE}/${path}?lang=en`;
}

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  const linkClass =
    "text-sm text-pure-white/60 underline-offset-4 transition-colors hover:text-pure-white hover:underline";

  return (
    <footer className="bg-rich-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <Logo className="[&_span]:text-pure-white" />
        <p className="text-text5 text-pure-white/60">
          © {new Date().getFullYear()} MOAVO Habits
        </p>
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
