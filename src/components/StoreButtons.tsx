import { useLocale } from "next-intl";
import { getStoreLinks } from "@/lib/storeLinks";

type StoreButtonsProps = {
  appStoreLabel: string;
  googlePlayLabel: string;
  variant?: "dark" | "light";
};

export default function StoreButtons({
  appStoreLabel,
  googlePlayLabel,
  variant = "dark",
}: StoreButtonsProps) {
  const links = getStoreLinks(useLocale());
  const primary =
    variant === "dark"
      ? "bg-green-3 text-pure-white hover:bg-green-3/90"
      : "bg-banana text-green-3 hover:bg-banana/90";
  const secondary =
    variant === "dark"
      ? "border border-green-3 text-green-3 hover:bg-green-3/5"
      : "border border-pure-white text-pure-white hover:bg-pure-white/10";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={links.appStore}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full px-6 py-3 text-text5 font-semibold transition-colors ${primary}`}
      >
        {appStoreLabel}
      </a>
      <a
        href={links.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full px-6 py-3 text-text5 font-semibold transition-colors ${secondary}`}
      >
        {googlePlayLabel}
      </a>
    </div>
  );
}
