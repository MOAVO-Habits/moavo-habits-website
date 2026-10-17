import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Keystatic keeps the file name when an image is replaced (cover.png stays
// cover.png), and next/image caches optimized output by URL — with no way to
// invalidate it. So the same URL keeps serving the OLD image (browser reload
// does not help; the stale copy lives in <distDir>/cache/images).
//
// Appending a content hash makes the URL change exactly when the file does.
// Requires images.localPatterns to allow a query string on /blog/** (see
// next.config.ts). Non-local or missing files are returned unchanged.

const PUBLIC_DIR = path.join(process.cwd(), "public");
const hashes = new Map<string, string>(); // "file:mtime:size" -> hash

export function versionedSrc(src: string): string {
  if (!src.startsWith("/") || src.includes("?")) return src;
  try {
    const file = path.join(PUBLIC_DIR, decodeURIComponent(src));
    if (!file.startsWith(PUBLIC_DIR + path.sep)) return src;
    const stat = fs.statSync(file);
    const key = `${file}:${stat.mtimeMs}:${stat.size}`;
    let hash = hashes.get(key);
    if (!hash) {
      hash = crypto
        .createHash("md5")
        .update(fs.readFileSync(file))
        .digest("hex")
        .slice(0, 10);
      hashes.set(key, hash);
    }
    return `${src}?v=${hash}`;
  } catch {
    return src;
  }
}
