import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // If on topics subdomain, route everything to /topics page
  if (hostname.startsWith("topics.")) {
    // Allow Next.js internals and static assets to pass through
    if (
      url.pathname.startsWith("/_next") ||
      url.pathname === "/favicon.ico" ||
      url.pathname.startsWith("/public/")
    ) {
      return NextResponse.next();
    }

    if (url.pathname !== "/topics") {
      url.pathname = "/topics";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
