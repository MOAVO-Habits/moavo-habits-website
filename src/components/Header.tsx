import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";

type HeaderProps = {
  locale: string;
  // Where the EN/KO switcher should go when the same path doesn't exist in the
  // other language (e.g. a blog post). Keys are locales, values are pathnames.
  localeHrefs?: Record<string, string>;
};

export default function Header({ locale, localeHrefs }: HeaderProps) {
  const t = useTranslations("Nav");

  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/app", label: t("app") },
    { href: "/faq", label: t("faq") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-pure-white shadow-sm">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold whitespace-nowrap text-green-3 hover:text-green-2"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold whitespace-nowrap text-green-3 hover:text-green-2"
              >
                {link.label}
              </Link>
            ),
          )}
          <LocaleSwitcher current={locale} hrefs={localeHrefs} />
        </nav>
        <MobileMenu
          links={links}
          locale={locale}
          localeHrefs={localeHrefs}
          openLabel={t("menuOpen")}
          closeLabel={t("menuClose")}
        />
      </div>
    </header>
  );
}
