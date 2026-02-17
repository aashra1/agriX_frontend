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
  User,
  Phone,
  MapPin,
  CreditCard,
  Search,
  Filter,
  Download,
} from "lucide-react";
import BusinessSidebar from "../_components/BusinessSidebar";
import BusinessHeader from "../_components/BusinessHeader";
import { getBusinessOrders, updateOrderStatus } from "@/lib/api/order";

// Import the Order type from the API
import { Order as ApiOrder } from "@/lib/api/order";

// Use the imported type directly
type Order = ApiOrder;

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

// Type guard function to check if user is an object
function isUserObject(user: any): user is {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
} {
  return user && typeof user === "object" && "_id" in user;
}

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

export default function BusinessOrdersPage() {
  const router = useRouter();
  const { user, businessId, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
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
    if (!authLoading && !businessId) {
      router.push("/auth/login");
    }
  }, [businessId, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getBusinessOrders(
          pagination.page,
          pagination.limit,
        );
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

    if (businessId) {
      fetchOrders();
    }
  }, [businessId, pagination.page]);

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
      month: "short",
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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { orderStatus: newStatus as any });

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus as any }
            : order,
        ),
      );

      setSnackbar({
        message: `Order status updated to ${newStatus}`,
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      setSnackbar({
        message: error.message || "Failed to update order status",
        type: "error",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderIdMatch = order._id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let customerNameMatch = false;
    let customerEmailMatch = false;

    if (isUserObject(order.user)) {
      customerNameMatch = (order.user.fullName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );
      customerEmailMatch = (order.user.email?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );
    }

    const matchesSearch =
      orderIdMatch || customerNameMatch || customerEmailMatch;
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader searchPlaceholder="Search orders by ID, customer..." />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Business Orders
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and track all customer orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Download size={18} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
              />
            </div>

            {showFilters && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-800"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-16 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No orders found
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "No orders match your search criteria. Try adjusting your filters."
                  : "You haven't received any orders yet."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
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

                    {/* Customer Info - Handle both string and object */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                      {isUserObject(order.user) ? (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <User size={14} className="text-green-700" />
                            <span className="font-medium">
                              {order.user.fullName || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-green-700" />
                            <span>{order.user.phone || "N/A"}</span>
                          </div>
                          {order.user.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <span className="text-xs text-gray-400">
                                {order.user.email}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={14} className="text-green-700" />
                          <span className="font-medium">
                            Customer ID: {order.user}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <div className="flex items-center gap-4 overflow-x-auto pb-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 min-w-[200px]"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              {item.image ? (
                                <img
                                  src={getProductImageUrl(item.image)!}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} ×{" "}
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-green-800">
                          {formatCurrency(order.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-800 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <Link
                          href={`/business/orders/${order._id}`}
                          className="px-4 py-2 text-green-800 hover:text-green-900 font-medium text-sm flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>

                    {/* Tracking Number if available */}
                    {order.trackingNumber && (
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                        <Truck size={12} />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
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

      <style jsx global>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
