import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { categoryName } from "@/lib/blogCategories";
import { formatDate, type BlogPost } from "@/lib/blog";

// Thumbnail, or a brand-colour placeholder when the post has no cover.
function Thumb({
  post,
  sizes,
  className,
}: {
  post: BlogPost;
  sizes: string;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-green-1 ${className}`}>
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.coverAlt ?? post.title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/logo/logo-icon.png"
            alt=""
            width={96}
            height={96}
            className="h-16 w-16 rounded-2xl opacity-60"
          />
        </div>
      )}
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="h-full overflow-hidden rounded-2xl bg-gray-1 transition-shadow focus-within:shadow-md hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <Thumb
          post={post}
          sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
          className="aspect-[16/9]"
        />
        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm font-semibold text-green-2">
            {categoryName(post.locale, post.category)}
          </p>
          <h3 className="mt-2 text-text2 break-words text-green-3">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-normal text-green-3/70">
            {post.description}
          </p>
          <time
            dateTime={post.date}
            className="mt-auto pt-4 text-sm font-medium text-green-3/60"
          >
            {formatDate(post.locale, post.date)}
          </time>
        </div>
      </Link>
    </article>
  );
}

export function FeaturedCard({
  post,
  label,
}: {
  post: BlogPost;
  label: string;
}) {
  return (
    <article className="overflow-hidden rounded-3xl bg-green-1 transition-shadow focus-within:shadow-md hover:shadow-md">
      <Link
        href={`/blog/${post.slug}`}
        className="grid md:grid-cols-2 md:items-stretch"
      >
        <Thumb
          post={post}
          sizes="(min-width: 1152px) 576px, (min-width: 768px) 50vw, 100vw"
          className="aspect-[16/9] md:aspect-auto md:min-h-72"
        />
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-sm font-semibold text-green-3">
            <span className="rounded-full bg-banana px-3 py-1">{label}</span>
            <span className="ml-3 text-green-2">
              {categoryName(post.locale, post.category)}
            </span>
          </p>
          <h2 className="mt-4 text-subtitle2 break-words text-green-3 md:text-title3">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-text5 font-medium text-green-3/80">
            {post.description}
          </p>
          <time
            dateTime={post.date}
            className="mt-5 text-sm font-medium text-green-3/60"
          >
            {formatDate(post.locale, post.date)}
          </time>
        </div>
      </Link>
    </article>
  );
}
