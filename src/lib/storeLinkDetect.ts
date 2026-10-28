import { STORE_LINKS } from "./storeLinks";

// Recognises links to OUR app in the stores, whatever shape the URL has
// (region code /kr/ vs /us/, trailing app name, extra query params, markdown
// escapes like "\&hl=en"). Parsed with new URL(): host + app id, never a
// substring check — so links to someone else's app are not counted.

export type StoreKind = "app_store" | "google_play";

const APPLE_HOSTS = new Set(["apps.apple.com", "itunes.apple.com"]);
const PLAY_HOST = "play.google.com";

// "\&" is a Markdown escape that should have become "&"; undo it if it reached
// the href literally, otherwise it would stick to the previous query value.
const clean = (href: string) => href.trim().replace(/\\&/g, "&");

function parse(href: string, base?: string): URL | null {
  try {
    return new URL(clean(href), base);
  } catch {
    return null;
  }
}

// App Store: the id is a path segment like "id6766134993".
function appleId(url: URL): string | null {
  if (!APPLE_HOSTS.has(url.hostname)) return null;
  const seg = url.pathname.split("/").find((s) => /^id\d+$/.test(s));
  return seg ?? null;
}

// Google Play: the id is the ?id= query parameter (a package name).
function playId(url: URL): string | null {
  if (url.hostname !== PLAY_HOST) return null;
  if (!url.pathname.startsWith("/store/apps/details")) return null;
  return url.searchParams.get("id");
}

// Our own ids, read from the same constants the buttons use.
const OWN_APPLE_IDS = new Set<string>();
const OWN_PLAY_IDS = new Set<string>();
for (const links of Object.values(STORE_LINKS)) {
  const a = parse(links.appStore);
  const p = parse(links.googlePlay);
  const aid = a && appleId(a);
  const pid = p && playId(p);
  if (aid) OWN_APPLE_IDS.add(aid);
  if (pid) OWN_PLAY_IDS.add(pid);
}

export function detectStoreLink(href: string, base?: string): StoreKind | null {
  const url = parse(href, base);
  if (!url) return null;
  const apple = appleId(url);
  if (apple && OWN_APPLE_IDS.has(apple)) return "app_store";
  const play = playId(url);
  if (play && OWN_PLAY_IDS.has(play)) return "google_play";
  return null;
}
