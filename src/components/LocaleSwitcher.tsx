"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher({ current }: { current: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm font-semibold">
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-3">/</span>}
          <Link
            href={pathname}
            locale={locale}
            className={
              locale === current
                ? "text-green-3"
                : "text-green-2 hover:text-green-3"
            }
          >
            {locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
