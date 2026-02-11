import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken } from "./lib/cookie";

const publicPaths = ["/login", "/register", "/forgot-password"];
const adminPaths = ["/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  if (isAdminPath) {
    if (!user || user.role?.toLowerCase() !== "admin") {
      console.log("Admin Access Denied. Role found:", user?.role);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isPublicPath && user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/login", "/register"],
};
