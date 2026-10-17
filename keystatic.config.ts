import { config, collection, fields } from "@keystatic/core";

// Admin UI for blog posts (/keystatic). Posts are saved as plain files in
// content/blog/{ko,en}/<slug>.mdx — exactly what src/lib/blog.ts reads, so the
// blog needs no changes. Local dev writes straight to disk; production
// commits through the GitHub API.

const GITHUB_REPO = "MOAVO-Habits/moavo-habits-website";

// Keep in sync with src/lib/blogCategories.ts (unknown slugs fail the blog build).
const CATEGORY_LABELS = {
  ko: {
    "behavioral-science": "행동과학",
    "habit-system": "습관 시스템",
    health: "건강",
    "self-development": "자기개발",
    "moavo-habits": "모아보해빗",
  },
  en: {
    "behavioral-science": "Behavioral Science",
    "habit-system": "Habit System",
    health: "Health",
    "self-development": "Self-development",
    "moavo-habits": "MOAVO Habits",
  },
} as const;

// Lowercase ASCII slug with hyphens, not colliding with the /blog/page and
// /blog/category routes. A strict subset of what blog.ts accepts, so an admin
// typo can never break the blog build.
const SLUG_PATTERN = /^(?!(?:page|category)$)[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function posts(lang: "ko" | "en") {
  const ko = lang === "ko";
  const L = (kor: string, eng: string) => (ko ? kor : eng);

  return collection({
    label: ko ? "한국어 글 (ko)" : "English posts (en)",
    slugField: "title",
    path: `content/blog/${lang}/*`,
    format: { contentField: "content" },
    entryLayout: "content",
    schema: {
      title: fields.slug({
        name: {
          label: L("제목", "Title"),
          validation: { isRequired: true },
        },
        slug: {
          label: L("주소(slug)", "URL slug"),
          description: L(
            "영문 소문자·숫자·하이픈만 사용하세요. 예: one-line-habit-journal (한글 제목이면 직접 영문으로 입력)",
            "Lowercase letters, numbers and hyphens only. Example: one-line-habit-journal",
          ),
          generate: slugify,
          validation: {
            length: { min: 1 },
            pattern: {
              regex: SLUG_PATTERN,
              message: L(
                "영문 소문자, 숫자, 하이픈만 사용할 수 있습니다 (page, category 제외).",
                "Use lowercase letters, numbers and hyphens only (not 'page' or 'category').",
              ),
            },
          },
        },
      }),
      description: fields.text({
        label: L("설명 (검색 결과 요약)", "Description (search snippet)"),
        description: L(
          "검색 결과에 보이는 설명, 한글 80자 안팎",
          "Shown in search results, around 150 characters",
        ),
        multiline: true,
        validation: { isRequired: true },
      }),
      date: fields.date({
        label: L("작성일", "Published date"),
        defaultValue: { kind: "today" },
        validation: { isRequired: true },
      }),
      updated: fields.date({
        label: L("수정일 (선택)", "Updated date (optional)"),
      }),
      category: fields.select({
        label: L("카테고리", "Category"),
        options: Object.entries(CATEGORY_LABELS[lang]).map(([value, label]) => ({
          value,
          label,
        })),
        defaultValue: "moavo-habits",
      }),
      tags: fields.array(
        fields.text({ label: L("태그", "Tag") }),
        {
          label: L("태그 (선택)", "Tags (optional)"),
          itemLabel: (props) => props.value,
        },
      ),
      cover: fields.image({
        label: L("대표 이미지 (선택)", "Cover image (optional)"),
        description: L(
          "목록 카드와 글 상단에 표시됩니다. 대체 텍스트는 글 제목이 사용됩니다.",
          "Shown on the card and above the post. The post title is used as alt text.",
        ),
        directory: "public/blog",
        publicPath: "/blog/",
      }),
      featured: fields.checkbox({
        label: L("추천 글", "Featured"),
        description: L(
          "블로그 맨 위 큰 카드로 노출됩니다 (여러 개면 가장 최근 글 1개).",
          "Shown as the large card at the top (the newest featured post if several).",
        ),
        defaultValue: false,
      }),
      draft: fields.checkbox({
        label: L("초안 (비공개)", "Draft"),
        description: L(
          "체크되어 있으면 사이트에 공개되지 않습니다. 공개하려면 체크를 해제하세요.",
          "While checked, the post is not published on the site. Uncheck to publish.",
        ),
        defaultValue: true,
      }),
      translationOf: fields.text({
        label: L("번역 짝 (선택)", "Translation of (optional)"),
        description: L(
          "반대 언어의 같은 글 slug",
          "Slug of the same post in the other language",
        ),
      }),
      content: fields.mdx({
        label: L("본문", "Body"),
        extension: "mdx",
        options: {
          image: {
            directory: "public/blog",
            publicPath: "/blog/",
          },
        },
      }),
    },
  });
}

// Storage: local files in `next dev` by default, GitHub everywhere else.
// To use GitHub mode in dev (e.g. to create the GitHub App from the admin UI),
// start the dev server with NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github. The
// NEXT_PUBLIC_ prefix is required: this file is also bundled for the browser.
const useGithub =
  process.env.NODE_ENV !== "development" ||
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github";

export default config({
  storage: useGithub
    ? { kind: "github", repo: GITHUB_REPO }
    : { kind: "local" },
  ui: { brand: { name: "MOAVO Habits" } },
  collections: {
    postsKo: posts("ko"),
    postsEn: posts("en"),
  },
});
