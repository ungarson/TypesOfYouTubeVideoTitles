import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  // When visiting titles.* subdomain, map root to /titles and preserve subpaths under /titles
  if (host.startsWith("titles.")) {
    // Root → /titles
    if (url.pathname === "/" || url.pathname === "") {
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = "/titles";
      return NextResponse.rewrite(rewriteUrl);
    }

    // Any other path → /titles/<path> (if not already under /titles)
    if (!url.pathname.startsWith("/titles")) {
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = `/titles${url.pathname}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals and common static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
