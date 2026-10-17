import Image from "next/image";
import type { ComponentProps } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { versionedSrc } from "@/lib/blogImages";

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
  if (typeof src !== "string") {
    throw new Error("[blog] Image is missing a src");
  }
  // A missing alt must not break the deploy (posts are written in the admin UI):
  // render an empty alt and warn while developing.
  const text = alt?.trim() ?? "";
  if (text === "" && process.env.NODE_ENV !== "production") {
    console.warn(
      `[blog] Image has no alt text: ![describe the image](${src}) — rendering alt=""`,
    );
  }
  if (!src.startsWith("/")) {
    throw new Error(
      `[blog] Image "${src}" must live under /public (use a path like /blog/photo.png)`,
    );
  }
  return (
    <Image
      src={versionedSrc(src)}
      alt={text}
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
  // GFM tables (remark-gfm). The wrapper scrolls sideways when a table is
  // wider than the column, so the page itself never overflows at 320px.
  table: (props) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-gray-2">
      <table
        {...props}
        className="w-full border-collapse text-left text-sm leading-normal"
      />
    </div>
  ),
  thead: (props) => <thead {...props} className="bg-green-1" />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => (
    <tr {...props} className="border-t border-gray-2 first:border-t-0" />
  ),
  th: (props) => (
    <th
      {...props}
      className="px-4 py-3 align-top font-semibold break-words text-green-3"
    />
  ),
  td: (props) => (
    <td
      {...props}
      className="px-4 py-3 align-top font-medium break-words text-green-3/90"
    />
  ),
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
