import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// GET business orders
export async function GET(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${BASE}/api/order/business/orders?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching business orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch business orders",
      },
      { status: 500 },
    );
  }
}
