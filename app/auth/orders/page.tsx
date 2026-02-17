"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import UserSidebar from "../_components/UserSidebar";
import UserHeader from "../_components/UserHeader";
import { getUserOrders } from "@/lib/api/order";

type OrderItem = {
  product: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  business: string;
  image?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  paymentMethod: "cod" | "card" | "esewa" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  trackingNumber?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
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
      return <CheckCircle2 size={16} />;
    case "shipped":
      return <Truck size={16} />;
    case "processing":
      return <Package size={16} />;
    case "pending":
      return <Clock size={16} />;
    case "cancelled":
      return <XCircle size={16} />;
    default:
      return <AlertCircle size={16} />;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
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
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders(pagination.page, pagination.limit);
        setOrders(response.orders);
        setPagination(response.pagination);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        setSnackbar({
          message: error.message || "Failed to load orders",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, pagination.page]);

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
    });
  };

  const getProductImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    const fileName = imagePath.split(/[\\/]/).pop();
    return `${baseUrl}/uploads/product-images/${fileName}`;
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
            <span className="text-green-800 font-medium">My Orders</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-500 mt-1">
                {pagination.total} {pagination.total === 1 ? "order" : "orders"}{" "}
                found
              </p>
            </div>
            <button
              onClick={() => router.push("/auth/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-16 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No orders yet
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to place your
                first order.
              </p>
              <Link
                href="/auth/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/auth/orders/${order._id}`}
                  className="block bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-gray-500">
                          #{order._id.slice(-8)}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(
                            order.orderStatus,
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">
                            {order.orderStatus}
                          </span>
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${getPaymentStatusColor(
                            order.paymentStatus,
                          )}`}
                        >
                          {order.paymentMethod === "cod"
                            ? "COD"
                            : order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white overflow-hidden"
                          >
                            {item.image ? (
                              <img
                                src={getProductImageUrl(item.image)!}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Total: {formatCurrency(order.total)}
                        </p>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-green-800 group-hover:translate-x-1 transition-all"
                      />
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <CreditCard size={14} />
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod.toUpperCase()}
                      </span>
                      {order.trackingNumber && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Truck size={14} />
                            Tracking: {order.trackingNumber}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:border-green-800 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.pages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:border-green-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Snackbar />
    </div>
  );
}
