import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// GET order by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const token = await getAuthToken();
    const { orderId } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${BASE}/api/order/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch order",
      },
      { status: 500 },
    );
  }
}
