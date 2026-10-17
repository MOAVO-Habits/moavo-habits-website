import type { NextRequest } from "next/server";
import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// In GitHub mode makeRouteHandler throws at creation time when the
// KEYSTATIC_* environment variables are missing. Build it on the first request
// instead of at import time, so `next build` works without those variables
// (the admin simply returns an error until they are configured).
export const dynamic = "force-dynamic";

let handler: ReturnType<typeof makeRouteHandler> | undefined;
const getHandler = () => (handler ??= makeRouteHandler({ config }));

export const GET = (request: NextRequest) => getHandler().GET(request);
export const POST = (request: NextRequest) => getHandler().POST(request);
