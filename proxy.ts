import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken } from "./lib/cookie";

const publicPaths = ["/login", "/register", "/forgot-password"];
const adminPaths = ["/admin"];
const protectedPaths = ["/profile", "/auth"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (user?.role?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath && token) {
    if (user?.role?.toLowerCase() === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/auth/dashboard", req.url));
  }

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/login", "/register"],
};
