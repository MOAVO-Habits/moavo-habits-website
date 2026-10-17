// Blog categories. The slug is shared by both languages; only the display
// name is localized. A post whose frontmatter `category` is not listed here
// fails the build (see parsePost in blog.ts).

export const BLOG_CATEGORY_SLUGS = [
  "behavioral-science",
  "habit-system",
  "health",
  "self-development",
  "moavo-habits",
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORY_SLUGS)[number];

export const BLOG_CATEGORY_NAMES: Record<
  "en" | "ko",
  Record<BlogCategorySlug, string>
> = {
  en: {
    "behavioral-science": "Behavioral Science",
    "habit-system": "Habit System",
    health: "Health",
    "self-development": "Self-development",
    "moavo-habits": "MOAVO Habits",
  },
  ko: {
    "behavioral-science": "행동과학",
    "habit-system": "습관 시스템",
    health: "건강",
    "self-development": "자기개발",
    "moavo-habits": "모아보해빗",
  },
};

export function isBlogCategory(value: string): value is BlogCategorySlug {
  return (BLOG_CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function categoryName(locale: string, slug: BlogCategorySlug): string {
  const names = locale === "ko" ? BLOG_CATEGORY_NAMES.ko : BLOG_CATEGORY_NAMES.en;
  return names[slug];
}
