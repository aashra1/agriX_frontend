"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar,
  Download,
  Printer,
} from "lucide-react";
import UserSidebar from "../../_components/UserSidebar";
import UserHeader from "../../_components/UserHeader";
import { getOrderById } from "@/lib/api/order";

type OrderItem = {
  product: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  business: string;
  image?: string;
};

type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card" | "esewa" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-purple-100 text-purple-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle2 size={20} />;
    case "shipped":
      return <Truck size={20} />;
    case "processing":
      return <Package size={20} />;
    case "pending":
      return <Clock size={20} />;
    case "cancelled":
      return <XCircle size={20} />;
    default:
      return <AlertCircle size={20} />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "shipped":
      return "Shipped";
    case "processing":
      return "Processing";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(
        () => setSnackbar({ message: "", type: null }),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(orderId);
        setOrder(response.order);
      } catch (error: any) {
        console.error("Error fetching order:", error);
        setSnackbar({
          message: error.message || "Failed to load order details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    const fileName = imagePath.split(/[\\/]/).pop();
    return `${baseUrl}/uploads/product-images/${fileName}`;
  };

  const getItemPrice = (item: OrderItem) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return price * item.quantity;
  };

  const handleTrackPackage = () => {
    if (order?.trackingNumber) {
      window.open(
        `https://track.courier.com/${order.trackingNumber}`,
        "_blank",
      );
    }
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download
    console.log("Download invoice for order:", orderId);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const Snackbar = () => {
    if (!snackbar.type) return null;
    return (
      <div
        className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-right-5 duration-300 ${
          snackbar.type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {snackbar.type === "success" ? (
          <CheckCircle2 size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
        <span className="text-sm font-medium">{snackbar.message}</span>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
        <Loader2 className="animate-spin text-green-800" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
        <UserSidebar activePage="Orders" />
        <main className="flex-1 overflow-x-hidden">
          <UserHeader />
          <div className="p-8 max-w-7xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-16">
              <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Order not found
              </h2>
              <p className="text-gray-500 mb-6">
                The order you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <button
                onClick={() => router.push("/auth/orders")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Orders
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <UserSidebar activePage="Orders" />

      <main className="flex-1 overflow-x-hidden">
        <UserHeader />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/auth/dashboard"
              className="text-gray-500 hover:text-green-800"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link
              href="/auth/orders"
              className="text-gray-500 hover:text-green-800"
            >
              Orders
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">
              Order #{order._id.slice(-8)}
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                <span className="font-mono">#{order._id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(order.createdAt)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintOrder}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Printer size={18} />
                <span className="text-sm font-medium">Print</span>
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Download size={18} />
                <span className="text-sm font-medium">Invoice</span>
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div
            className={`mb-8 p-6 rounded-2xl flex items-center gap-4 ${getStatusColor(
              order.orderStatus,
            )}`}
          >
            {getStatusIcon(order.orderStatus)}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                Order {getStatusText(order.orderStatus)}
              </h2>
              <p className="text-sm opacity-90">
                {order.orderStatus === "delivered" &&
                  "Your order has been delivered. Thank you for shopping with us!"}
                {order.orderStatus === "shipped" &&
                  `Your order is on the way${
                    order.trackingNumber
                      ? ` (Tracking: ${order.trackingNumber})`
                      : ""
                  }`}
                {order.orderStatus === "processing" &&
                  "Your order is being processed and will be shipped soon."}
                {order.orderStatus === "pending" &&
                  "Your order has been placed and is awaiting confirmation."}
                {order.orderStatus === "cancelled" &&
                  "This order has been cancelled."}
              </p>
            </div>
            {order.trackingNumber && order.orderStatus === "shipped" && (
              <button
                onClick={handleTrackPackage}
                className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                Track Package
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-6 flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
                        {getProductImageUrl(item.image) ? (
                          <img
                            src={getProductImageUrl(item.image)!}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.discount > 0 ? (
                            <>
                              <span className="font-bold text-green-800">
                                {formatCurrency(getItemPrice(item))}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                {item.discount}% off
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-green-800">
                              {formatCurrency(getItemPrice(item))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-green-800" />
                    Shipping Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.shippingAddress.addressLine1}
                      </p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.addressLine2}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                        <Phone size={14} />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (13% VAT)</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-800">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </span>
                  </div>
                  {order.notes && (
                    <div className="pt-2">
                      <p className="text-sm text-gray-500">Notes:</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help? */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your order, please contact our
                  support team.
                </p>
                <Link
                  href="/auth/support"
                  className="text-green-800 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Contact Support
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Snackbar />
    </div>
  );
}
