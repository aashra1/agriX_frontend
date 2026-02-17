import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function GET(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get("count") === "true";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (countOnly) {
      const response = await fetch(`${BASE}/api/cart/count`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const response = await fetch(`${BASE}/api/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch cart",
      },
      { status: 500 },
    );
  }
}

