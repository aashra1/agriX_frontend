import { getAuthToken } from "@/lib/cookie";
import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

// POST /api/payment - Initiate Khalti payment
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

    const response = await fetch(`${BASE}/api/payments/khalti/initiate`, {
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
    console.error("Error initiating payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to initiate payment",
      },
      { status: 500 },
    );
  }
}

// GET /api/payment - Get user payments
export async function GET(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status") || "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let url = `${BASE}/api/payments/user?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch payments",
      },
      { status: 500 },
    );
  }
}
