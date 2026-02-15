import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/cookie";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// GET product by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log("Fetching product with ID:", id);
    console.log("Token:", token ? "Present" : "Missing");

    const response = await fetch(`${BASE}/api/product/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch product",
        error: error.toString(),
      },
      { status: 500 },
    );
  }
}

// UPDATE product by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log("Updating product with ID:", id);
    console.log("Token:", token ? "Present" : "Missing");

    const formData = await request.formData();

    // Log form data for debugging
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof File) {
        console.log(
          key,
          `File: ${value.name}, Size: ${value.size}, Type: ${value.type}`,
        );
      } else {
        console.log(key, value);
      }
    }

    const response = await fetch(`${BASE}/api/product/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend error response:", data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update product",
        error: error.toString(),
      },
      { status: 500 },
    );
  }
}

// DELETE product by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log("Deleting product with ID:", id);
    console.log("Token:", token ? "Present" : "Missing");

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
        error: error.toString(),
      },
      { status: 500 },
    );
  }
}
