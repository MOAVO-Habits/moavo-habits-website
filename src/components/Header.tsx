import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-50 bg-pure-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-green-3 hover:text-green-2"
          >
            {t("home")}
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-green-3 hover:text-green-2"
          >
            {t("about")}
          </Link>
          <Link
            href="/app"
            className="text-sm font-semibold text-green-3 hover:text-green-2"
          >
            {t("app")}
          </Link>
          <Link
            href="/faq"
            className="text-sm font-semibold text-green-3 hover:text-green-2"
          >
            {t("faq")}
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-green-3 hover:text-green-2"
          >
            {t("blog")}
          </Link>
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
