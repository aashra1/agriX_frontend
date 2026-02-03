import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API } from "@/lib/api/endpoints";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 },
      );
    }

    const res = await fetch(`${BASE}${API.USER.GET_PROFILE(userId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await res.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { success: false, message: "Backend Error" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const res = await fetch(`${BASE}${API.USER.GET_PROFILE(userId)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await res.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { success: false, message: "Backend Error" },
        { status: res.status },
      );
    }

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
