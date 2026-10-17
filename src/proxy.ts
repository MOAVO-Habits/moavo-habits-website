import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
// keystatic: admin UI (/keystatic) lives outside [locale]; api already covers /api/keystatic.
matcher: "/((?!api|trpc|_next|_vercel|keystatic|.*\\..*).*)",
};
