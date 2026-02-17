"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pidx = searchParams.get("pidx");
        const orderIdParam = searchParams.get("purchase_order_id");
        const paymentStatus = searchParams.get("status");

        setOrderId(orderIdParam);

        if (paymentStatus === "Completed" && pidx && orderIdParam) {
          // Use the cookie-based API route
          const response = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pidx, orderId: orderIdParam }),
          });

          const data = await response.json();

          if (response.status === 401) {
            router.push("/auth/login?redirect=auth/payment/verify");
            return;
          }

          if (data.success) {
            setStatus("success");
            setMessage("Payment successful! Your order has been placed.");
          } else {
            setStatus("failed");
            setMessage(data.message || "Payment verification failed");
          }
        } else if (
          paymentStatus === "Failed" ||
          paymentStatus === "Cancelled"
        ) {
          setStatus("failed");
          setMessage(
            paymentStatus === "Failed"
              ? "Payment failed. Please try again."
              : "Payment was cancelled.",
          );
        } else {
          setStatus("failed");
          setMessage("Invalid payment response");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage(error.message || "Payment verification failed");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link
          href="/auth/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-800 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          {status === "verifying" && (
            <div className="text-center">
              <Loader2
                className="animate-spin text-green-800 mx-auto mb-4"
                size={48}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Payment
              </h2>
              <p className="text-gray-500">
                Please wait while we verify your payment...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-500 mb-6">{message}</p>
              {orderId && (
                <Link
                  href={`/auth/orders/${orderId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span>View Order</span>
                </Link>
              )}
            </div>
          )}

          {status === "failed" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-500 mb-6">{message}</p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/auth/cart"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span>Back to Cart</span>
                </Link>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
