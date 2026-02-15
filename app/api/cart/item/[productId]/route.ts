import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// PUT update cart item quantity - Requires auth
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const token = await getAuthToken();
    const { productId } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${BASE}/api/cart/item/${productId}`, {
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
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update cart item",
      },
      { status: 500 },
    );
  }
}

// DELETE remove from cart - Requires auth
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const token = await getAuthToken();
    const { productId } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${BASE}/api/cart/item/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to remove from cart",
      },
      { status: 500 },
    );
  }
}
