import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/cookie";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log("Fetching business products");
    console.log("Token:", token ? "Present" : "Missing");

    const response = await fetch(`${BASE}/api/product/business`, {
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
    console.error("Error fetching business products:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch products",
        error: error.toString(),
      },
      { status: 500 },
    );
  }
}
