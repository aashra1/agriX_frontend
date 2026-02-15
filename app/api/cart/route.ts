import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// GET cart - Requires auth
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

    // If countOnly is true, fetch only the count
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

    // Otherwise fetch the full cart
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
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch cart",
      },
      { status: 500 },
    );
  }
}

// POST add to cart - Requires auth
export async function POST(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${BASE}/api/cart/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to add to cart",
      },
      { status: 500 },
    );
  }
}

// DELETE clear cart - Requires auth
export async function DELETE(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${BASE}/api/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to clear cart",
      },
      { status: 500 },
    );
  }
}
