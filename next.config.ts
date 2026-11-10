import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Keystatic's GitHub mode (dev) redirects the admin to http://127.0.0.1:3000
  // for the OAuth callback; Next 16 blocks dev assets from that origin unless
  // it is allowed here. Dev-only setting, ignored in production.
  allowedDevOrigins: ["127.0.0.1"],
  // `next dev` otherwise writes AGENTS.md / CLAUDE.md into the repo when it
  // detects an AI coding agent. Opt out so they never show up as changes.
  agentRules: false,
  // Blog images are cache-busted with ?v=<hash> (src/lib/blogImages.ts); Next 16
  // blocks query strings on local images unless allowed here.
  images: {
    localPatterns: [{ pathname: "/blog/**" }, { pathname: "/**", search: "" }],
  },
  // Renamed English posts: keep the old URLs working (301-style, permanent).
  async redirects() {
    return [
      {
        source: "/en/blog/nudge-vs-sludge",
        destination: "/en/blog/nudge-vs-sludge-what-is-difference",
        permanent: true,
      },
      {
        source: "/en/blog/nudge-theory-examples-choice-architecture",
        destination: "/en/blog/nudge-theory-examples",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
