import MultilineText from "./MultilineText";

type FeatureRowProps = {
  subtitle: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function FeatureRow({
  subtitle,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureRowProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 md:gap-16 ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div className="flex-1 text-left">
        <h3 className="whitespace-pre-line text-text2 text-green-3">
          {subtitle}
        </h3>
        <MultilineText text={body} className="mt-4 text-text5 text-gray-4" />
      </div>
      <div className="flex flex-1 justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full max-w-[14rem] rounded-3xl shadow-xl md:max-w-[17rem]"
        />
      </div>
    </div>
  );
}
