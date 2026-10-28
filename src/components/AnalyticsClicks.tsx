"use client";

import { useEffect } from "react";
import { detectStoreLink } from "@/lib/storeLinkDetect";

// GA4 click events for app-install links, using ONE delegated listener instead
// of touching every link (post bodies are Markdown, so most links aren't ours
// to edit). Renders nothing.
//
//  app_download_click  any link to our App Store / Google Play listing
//  blog_app_cta_click  links inside the app box at the bottom of a blog post
//                      (store links + the link to the app page)

type Location = "home" | "app_page" | "blog_post" | "other";
type CtaPosition = "post_box" | "post_body" | "site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const BOX = "[data-blog-app-cta]";
const BODY = "[data-blog-post-body]";

function where(pathname: string): { location: Location; slug?: string } {
  // /{locale}, /{locale}/app, /{locale}/blog/{slug}
  const seg = pathname.split("/").filter(Boolean);
  if (seg.length === 1) return { location: "home" };
  if (seg.length === 2 && seg[1] === "app") return { location: "app_page" };
  if (
    seg.length === 3 &&
    seg[1] === "blog" &&
    seg[2] !== "page" &&
    seg[2] !== "category"
  ) {
    let slug = seg[2];
    try {
      slug = decodeURIComponent(slug);
    } catch {}
    return { location: "blog_post", slug };
  }
  return { location: "other" };
}

function send(name: string, params: Record<string, string>) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[ga] ${name}`, params);
    }
    if (typeof window.gtag === "function") {
      // beacon: survives same-tab navigation away from the page
      window.gtag("event", name, { ...params, transport_type: "beacon" });
    }
  } catch {
    // analytics must never break the page
  }
}

export default function AnalyticsClicks({ locale }: { locale: string }) {
  useEffect(() => {
    function handle(event: MouseEvent) {
      try {
        // left click (click) and middle click (auxclick, button 1)
        if (event.type === "auxclick" && event.button !== 1) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const anchor = target.closest("a[href]");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href) return;

        const store = detectStoreLink(href, window.location.href);
        const inBox = anchor.closest(BOX) !== null;
        const url = (() => {
          try {
            return new URL(href, window.location.href);
          } catch {
            return null;
          }
        })();
        const isAppPage =
          !!url &&
          url.origin === window.location.origin &&
          url.pathname.replace(/\/$/, "") === `/${locale}/app`;
        if (!store && !(inBox && isAppPage)) return;

        const { location, slug } = where(window.location.pathname);
        const position: CtaPosition = inBox
          ? "post_box"
          : anchor.closest(BODY)
            ? "post_body"
            : "site";

        if (store) {
          const params: Record<string, string> = {
            store,
            location,
            locale,
            page_path: window.location.pathname,
            cta_position: position,
          };
          if (location === "blog_post" && slug) params.post_slug = slug;
          send("app_download_click", params);
        }

        if (inBox && slug) {
          send("blog_app_cta_click", {
            post_slug: slug,
            locale,
            target: store ?? "app_page",
          });
        }
      } catch {
        // never interfere with navigation
      }
    }

    // capture phase: still runs if another handler stops propagation
    document.addEventListener("click", handle, true);
    document.addEventListener("auxclick", handle, true);
    return () => {
      document.removeEventListener("click", handle, true);
      document.removeEventListener("auxclick", handle, true);
    };
  }, [locale]);

  return null;
}
