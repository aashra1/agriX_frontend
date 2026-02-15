import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 },
      );
    }

    const res = await fetch(`${BASE}/api/product/category/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    const errorText = await res.text();
    return NextResponse.json(
      { success: false, message: errorText || "Backend error occurred" },
      { status: res.status },
    );
  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
