import type { ElementType, ComponentPropsWithoutRef } from "react";

type MultilineTextProps<T extends ElementType> = {
  as?: T;
  text: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export default function MultilineText<T extends ElementType = "p">({
  as,
  text,
  className,
  ...rest
}: MultilineTextProps<T>) {
  const Component = as ?? "p";
  const paragraphs = text.split("\n\n");

  if (paragraphs.length === 1) {
    return (
      <Component className={`whitespace-pre-line ${className ?? ""}`} {...rest}>
        {text}
      </Component>
    );
  }

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      {paragraphs.map((paragraph, i) => (
        <Component key={i} className="whitespace-pre-line" {...rest}>
          {paragraph}
        </Component>
      ))}
    </div>
  );
}
