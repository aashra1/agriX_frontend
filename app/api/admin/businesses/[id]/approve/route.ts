// app/api/business/admin/approve/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Must be a Promise in Next 15
) {
  try {
    const { id } = await params; // Await the ID
    const cookieStore = await cookies(); // Await the cookies
    const token = cookieStore.get("auth_token")?.value;

    // IMPORTANT: Check your terminal (where you ran npm run dev) for this log
    console.log("Next.js Proxy - ID:", id);
    console.log("Next.js Proxy - Token Found:", !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing!" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${BASE}/api/business/admin/approve/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
