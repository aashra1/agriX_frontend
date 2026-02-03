import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  console.log("--- Middleware Execution ---");
  console.log("Path:", pathname);
  console.log("Token Present:", !!token);

  if (pathname.startsWith("/admin")) {
    if (!token) {
      console.log("No token! Redirecting to /login...");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
