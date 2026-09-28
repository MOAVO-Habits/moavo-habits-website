// Single source of truth for social links.
// Used by <Footer /> (per-locale display) and organizationSchema() (JSON-LD
// sameAs, which always lists every profile regardless of locale).

export const SOCIAL_LINKS = {
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/moavo_habits/",
  },
  threads: {
    label: "Threads",
    url: "https://www.threads.com/@moavo_habits",
  },
  naverBlog: {
    label: "Naver Blog",
    url: "https://blog.naver.com/moavohabits",
  },
} as const;

export function getSocialLinks(locale: string) {
  const { instagram, threads, naverBlog } = SOCIAL_LINKS;
  return locale === "ko" ? [instagram, threads, naverBlog] : [instagram];
}
