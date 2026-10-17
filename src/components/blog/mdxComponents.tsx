import Image from "next/image";
import type { ComponentProps } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";

// Element styling for MDX article bodies, built from the site's colour/type
// tokens (no @tailwindcss/typography). Authors write plain Markdown; headings
// start at ## because the post title is the page's single <h1>.

type MdxComponents = NonNullable<MDXRemoteProps["components"]>;

const headingBase = "scroll-mt-24 text-green-3 break-words";

function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  const cls =
    "font-semibold text-green-3 underline decoration-green-2 underline-offset-4 hover:decoration-green-3";
  // Site-internal links get the locale prefix; everything else opens as-is.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      {...rest}
    >
      {children}
    </a>
  );
}

function Img({ src, alt }: ComponentProps<"img">) {
  if (typeof src !== "string" || !alt || alt.trim() === "") {
    throw new Error(
      `[blog] Every image needs alt text: ![describe the image](${String(src)})`,
    );
  }
  if (!src.startsWith("/")) {
    throw new Error(
      `[blog] Image "${src}" must live under /public (use a path like /blog/photo.png)`,
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="(min-width: 768px) 768px, 100vw"
      style={{ width: "100%", height: "auto" }}
      className="my-8 block rounded-2xl"
    />
  );
}

export const mdxComponents: MdxComponents = {
  h1: (props) => (
    <h2
      {...props}
      className={`${headingBase} mt-12 mb-4 text-subtitle2`}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className={`${headingBase} mt-12 mb-4 text-subtitle2`}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className={`${headingBase} mt-10 mb-3 text-subtitle3`}
    />
  ),
  p: (props) => <p {...props} className="my-5" />,
  a: Anchor,
  strong: (props) => <strong {...props} className="font-bold text-green-3" />,
  ul: (props) => (
    <ul
      {...props}
      className="my-5 list-disc space-y-2 pl-6 marker:text-green-2"
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="my-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-green-2"
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-8 border-l-4 border-green-3 pl-4 text-green-3 [&>p]:my-2"
    />
  ),
  hr: () => <hr className="my-12 border-gray-2" />,
  code: (props) => (
    <code
      {...props}
      className="rounded bg-gray-1 px-1.5 py-0.5 text-[0.9em] break-words"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="my-6 max-w-full overflow-x-auto rounded-xl bg-green-3 p-4 text-sm text-pure-white [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit"
    />
  ),
  img: Img,
};
