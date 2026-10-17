import type { Metadata } from "next";
import type { ReactNode } from "react";

// The site's root layout lives under [locale], so the admin UI gets its own
// <html>/<body>. It must never be indexed.
export const metadata: Metadata = {
  title: "Keystatic",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
