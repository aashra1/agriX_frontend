import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// GET product by ID - Public route (no auth required)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log("Fetching product with ID:", id);

    const response = await fetch(`${BASE}/api/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    // Pass through the status code from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}

// UPDATE product by ID - Requires auth (keep this)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getAuthToken();
    const { id } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const response = await fetch(`${BASE}/api/product/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update product",
      },
      { status: 500 },
    );
  }
}

// DELETE product by ID - Requires auth (keep this)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getAuthToken();
    const { id } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${BASE}/api/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete product",
      },
      { status: 500 },
    );
  }
}
