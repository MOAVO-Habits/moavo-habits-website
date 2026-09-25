import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("Nav");

  const links = [
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold whitespace-nowrap text-green-3 hover:text-green-2"
            >
              {link.label}
            </Link>
          ))}
          <LocaleSwitcher current={locale} />
        </nav>
        <MobileMenu
          links={links}
          locale={locale}
          openLabel={t("menuOpen")}
          closeLabel={t("menuClose")}
        />
      </div>
    </header>
  );
}
