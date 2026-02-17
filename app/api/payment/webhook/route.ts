import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE}/api/payments/khalti/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process webhook",
      },
      { status: 500 },
    );
  }
}
