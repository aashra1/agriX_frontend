import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function forward(req: Request, params: { path: string[] }) {
  const token = (await cookies()).get("auth_token")?.value;
  const tail = params.path.join("/");

  const isPublicAction = tail === "login" || tail === "register";

  if (!token && !isPublicAction) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const backendUrl = `${BASE}/api/users/${tail}${url.search}`;

  const res = await fetch(backendUrl, {
    method: req.method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    cache: "no-store",
  });

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(req, await params);
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(req, await params);
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(req, await params);
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(req, await params);
}
