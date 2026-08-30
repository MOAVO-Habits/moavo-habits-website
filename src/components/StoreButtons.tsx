export const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EB%AA%A8%EC%95%84%EB%B3%B4%ED%95%B4%EB%B9%97-moavo-habits-ai-%EC%8A%B5%EA%B4%80-%EC%BD%94%EC%B9%AD/id6766134993";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.moavohabits&pcampaignid=web_share";

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
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full px-6 py-3 text-text5 font-semibold transition-colors ${primary}`}
      >
        {appStoreLabel}
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full px-6 py-3 text-text5 font-semibold transition-colors ${secondary}`}
      >
        {googlePlayLabel}
      </a>
    </div>
  );
}
