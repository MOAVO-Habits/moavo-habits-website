type LogoProps = {
  className?: string;
  iconOnly?: boolean;
};

export default function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/logo-icon.png"
        alt="MOAVO Habits"
        className="h-8 w-8 shrink-0 rounded-lg"
      />
      {!iconOnly && (
        <span className="text-lg font-extrabold tracking-tight text-green-3">
          MOAVO HABITS
        </span>
      )}
    </span>
  );
}
