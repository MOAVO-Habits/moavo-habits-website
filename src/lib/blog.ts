// Blog content loader. Posts are MDX files in content/blog/{locale}/{slug}.mdx
// (file name = slug). Everything here runs on the server at request/build
// time; nothing is shipped to the client.

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse as parseYaml } from "yaml";
import { SITE } from "./schema";
import {
  isBlogCategory,
  BLOG_CATEGORY_SLUGS,
  type BlogCategorySlug,
} from "./blogCategories";

export const POSTS_PER_PAGE = 12;
// Category chips only appear once the blog is big enough to need them.
export const CHIPS_MIN_POSTS = 12;
export const CHIPS_MIN_CATEGORIES = 2;

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
// Slugs that would collide with fixed routes under /blog.
const RESERVED_SLUGS = new Set(["page", "category"]);
const SLUG_RE = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type BlogPost = {
  locale: string;
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  category: BlogCategorySlug;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  featured: boolean;
  draft: boolean;
  translationOf?: string;
  body: string;
  readingMinutes: number;
};

// Drafts are visible in `next dev` only.
export const includeDrafts = () => process.env.NODE_ENV !== "production";

function fail(file: string, message: string): never {
  throw new Error(`[blog] ${file}: ${message}`);
}

function str(file: string, data: Record<string, unknown>, key: string): string {
  const v = data[key];
  if (typeof v !== "string" || v.trim() === "") {
    fail(file, `frontmatter "${key}" is required and must be a non-empty string`);
  }
  return v.trim();
}

function optStr(
  file: string,
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  if (data[key] === undefined || data[key] === null) return undefined;
  return str(file, data, key);
}

function dateStr(
  file: string,
  data: Record<string, unknown>,
  key: string,
  required: boolean,
): string | undefined {
  let v = data[key];
  if (v === undefined || v === null) {
    if (required) fail(file, `frontmatter "${key}" is required (YYYY-MM-DD)`);
    return undefined;
  }
  if (v instanceof Date) v = v.toISOString().slice(0, 10);
  if (typeof v !== "string" || !DATE_RE.test(v) || Number.isNaN(Date.parse(v))) {
    fail(file, `frontmatter "${key}" must be a valid YYYY-MM-DD date`);
  }
  return v;
}

function bool(file: string, data: Record<string, unknown>, key: string) {
  const v = data[key];
  if (v === undefined || v === null) return false;
  if (typeof v !== "boolean") fail(file, `frontmatter "${key}" must be true or false`);
  return v;
}

function readingMinutes(locale: string, body: string): number {
  const text = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ");
  if (locale === "ko") {
    // Korean reads at roughly 500 characters per minute.
    const chars = text.replace(/\s+/g, "").length;
    return Math.max(1, Math.ceil(chars / 500));
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function parsePost(locale: string, fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx$/, "");
  const file = `content/blog/${locale}/${fileName}`;

  if (!SLUG_RE.test(slug)) {
    fail(file, `file name "${slug}" must be letters/digits separated by "-" (e.g. my-first-post)`);
  }
  if (RESERVED_SLUGS.has(slug)) {
    fail(file, `"${slug}" is reserved by the blog routes — pick another file name`);
  }

  const raw = fs
    .readFileSync(path.join(CONTENT_DIR, locale, fileName), "utf-8")
    .replace(/^﻿/, "");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) fail(file, "missing frontmatter block (--- ... ---) at the top of the file");

  let data: Record<string, unknown>;
  try {
    const parsed = parseYaml(m[1]);
    data = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch (e) {
    fail(file, `invalid YAML frontmatter: ${(e as Error).message}`);
  }

  const category = str(file, data, "category");
  if (!isBlogCategory(category)) {
    fail(
      file,
      `unknown category "${category}". Allowed: ${BLOG_CATEGORY_SLUGS.join(", ")}`,
    );
  }

  let tags: string[] = [];
  if (data.tags !== undefined && data.tags !== null) {
    if (!Array.isArray(data.tags) || data.tags.some((t) => typeof t !== "string")) {
      fail(file, 'frontmatter "tags" must be an array of strings');
    }
    tags = data.tags as string[];
  }

  const cover = optStr(file, data, "cover");
  if (cover && !cover.startsWith("/")) {
    fail(file, 'frontmatter "cover" must be a path under /public (e.g. /blog/cover.png)');
  }

  const body = m[2];
  return {
    locale,
    slug,
    title: str(file, data, "title"),
    description: str(file, data, "description"),
    date: dateStr(file, data, "date", true)!,
    updated: dateStr(file, data, "updated", false),
    category,
    tags,
    cover,
    coverAlt: optStr(file, data, "coverAlt"),
    featured: bool(file, data, "featured"),
    draft: bool(file, data, "draft"),
    translationOf: optStr(file, data, "translationOf"),
    body,
    readingMinutes: readingMinutes(locale, body),
  };
}

// All posts for a locale, newest first. Drafts are dropped in production.
export const getAllPosts = cache((locale: string): BlogPost[] => {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parsePost(locale, f))
    .filter((p) => includeDrafts() || !p.draft)
    .sort((a, b) =>
      a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date),
    );
});

export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getPost(locale: string, slug: string): BlogPost | undefined {
  const s = safeDecode(slug);
  return getAllPosts(locale).find((p) => p.slug === s);
}

// Slug of this post's counterpart in the other language, or undefined.
// The link is symmetric: A.translationOf = B, or B.translationOf = A.
export function getTranslationSlug(post: BlogPost): string | undefined {
  const other = post.locale === "ko" ? "en" : "ko";
  const others = getAllPosts(other);
  if (post.translationOf && others.some((p) => p.slug === post.translationOf)) {
    return post.translationOf;
  }
  return others.find((p) => p.translationOf === post.slug)?.slug;
}

export function categoriesWithPosts(posts: BlogPost[]): BlogCategorySlug[] {
  return BLOG_CATEGORY_SLUGS.filter((c) => posts.some((p) => p.category === c));
}

export function shouldShowChips(posts: BlogPost[]): boolean {
  return (
    posts.length >= CHIPS_MIN_POSTS &&
    categoriesWithPosts(posts).length >= CHIPS_MIN_CATEGORIES
  );
}

// Featured post for the top of /blog: newest post flagged `featured`.
export function getFeatured(posts: BlogPost[]): BlogPost | undefined {
  return posts.find((p) => p.featured);
}

export function pageCount(gridPostCount: number): number {
  return Math.max(1, Math.ceil(gridPostCount / POSTS_PER_PAGE));
}

export function related(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts(post.locale)
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
}

export function formatDate(locale: string, iso: string): string {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

// ---- URLs (absolute, for metadata / schema / sitemap / RSS) ----
export const blogUrl = (locale: string, sub = "") =>
  `${SITE.url}/${locale}/blog${sub}`;
export const postUrl = (locale: string, slug: string) =>
  blogUrl(locale, `/${slug}`);
export const categoryUrl = (locale: string, category: string) =>
  blogUrl(locale, `/category/${category}`);
export const pageUrl = (locale: string, n: number) =>
  n <= 1 ? blogUrl(locale) : blogUrl(locale, `/page/${n}`);
