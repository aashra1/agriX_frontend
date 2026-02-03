import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function forward(req: Request, params: { path: string[] }) {
  const token = (await cookies()).get("auth_token")?.value;
  const tail = params.path.join("/");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);

  let backendPath = "";

  if (tail === "users") {
    backendPath = "/api/user";
  } else if (tail === "businesses") {
    backendPath = "/api/business/admin/all";
  } else if (tail.startsWith("business/approve/")) {
    const businessId = tail.split("/")[2];
    backendPath = `/api/business/admin/approve/${businessId}`;
  } else if (tail === "user") {
    backendPath = "/api/user";
  } else if (tail.startsWith("business/")) {
    backendPath = `/api/${tail}`;
  } else {
    backendPath = `/api/${tail}`;
  }

  const backendUrl = `${BASE}${backendPath}${url.search}`;

  const res = await fetch(backendUrl, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    cache: "no-store",
  });

  const responseText = await res.text();

  return new NextResponse(responseText, {
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
