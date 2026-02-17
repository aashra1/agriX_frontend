import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// PUT update order status
export async function PUT(
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

    const body = await request.json();

    const response = await fetch(`${BASE}/api/order/${orderId}/status`, {
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
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update order status",
      },
      { status: 500 },
    );
  }
}
