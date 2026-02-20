"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  Mail,
  Printer,
  Download,
} from "lucide-react";
import {
  handleGetOrderById,
  handleUpdateOrderStatus,
} from "@/lib/actions/order-actions";
import { Order } from "@/lib/api/order";
import BusinessSidebar from "../../_components/BusinessSidebar";
import BusinessHeader from "../../_components/BusinessHeader";

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
      return "bg-green-100 text-green-700 border-green-200";
    case "shipped":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "processing":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle2 size={18} />;
    case "shipped":
      return <Truck size={18} />;
    case "processing":
      return <Package size={18} />;
    case "pending":
      return <Clock size={18} />;
    case "cancelled":
      return <XCircle size={18} />;
    default:
      return <AlertCircle size={18} />;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "cod":
      return "Cash on Delivery";
    case "esewa":
      return "eSewa";
    case "khalti":
      return "Khalti";
    case "card":
      return "Credit/Debit Card";
    default:
      return method;
  }
};

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function BusinessOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const { businessId, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

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
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const result = await handleGetOrderById(orderId);

        if (result.success && result.order) {
          setOrder(result.order);
          setSelectedStatus(result.order.orderStatus);
        } else {
          setSnackbar({
            message: result.message || "Failed to load order details",
            type: "error",
          });
        }
      } catch (error: any) {
        console.error("Error fetching order details:", error);
        setSnackbar({
          message: error.message || "Failed to load order details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (businessId && orderId) {
      fetchOrderDetails();
    }
  }, [businessId, orderId]);

  const handleUpdateStatus = async () => {
    if (!order || selectedStatus === order.orderStatus) return;

    setUpdatingStatus(true);
    try {
      const result = await handleUpdateOrderStatus(order._id, {
        orderStatus: selectedStatus as any,
      });

      if (result.success && result.order) {
        setOrder(result.order);
        setSnackbar({
          message: `Order status updated to ${selectedStatus}`,
          type: "success",
        });
      } else {
        setSnackbar({
          message: result.message || "Failed to update order status",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      setSnackbar({
        message: error.message || "Failed to update order status",
        type: "error",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddTracking = async () => {
    if (!trackingNumber.trim()) return;

    setUpdatingStatus(true);
    try {
      const result = await handleUpdateOrderStatus(order!._id, {
        orderStatus: "shipped",
        trackingNumber: trackingNumber,
      });

      if (result.success && result.order) {
        setOrder(result.order);
        setSelectedStatus("shipped");
        setSnackbar({
          message: "Tracking number added successfully",
          type: "success",
        });
        setShowTrackingModal(false);
      } else {
        setSnackbar({
          message: result.message || "Failed to add tracking number",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error adding tracking number:", error);
      setSnackbar({
        message: error.message || "Failed to add tracking number",
        type: "error",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  const calculateItemTotal = (
    price: number,
    quantity: number,
    discount: number = 0,
  ) => {
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice * quantity;
  };

  const handlePrint = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/business/orders"
            className="px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.orderStatus,
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader />

        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Link
                  href="/business/dashboard"
                  className="text-gray-500 hover:text-green-800"
                >
                  Dashboard
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
                <Link
                  href="/business/orders"
                  className="text-gray-500 hover:text-green-800"
                >
                  Orders
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-green-800 font-medium">
                  #{order._id.slice(-8)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
              >
                <Printer size={18} />
                <span className="text-sm font-medium">Print</span>
              </button>
              <Link
                href="/business/orders"
                className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-all"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back to Orders</span>
              </Link>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm px-4 py-2 rounded-full flex items-center gap-2 border ${getStatusColor(order.orderStatus)}`}
                >
                  {getStatusIcon(order.orderStatus)}
                  <span className="capitalize font-medium">
                    {order.orderStatus}
                  </span>
                </span>
                <span
                  className={`text-sm px-4 py-2 rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}
                >
                  {order.paymentMethod === "cod" ? "COD" : order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Update Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-800 disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {selectedStatus !== order.orderStatus && (
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {updatingStatus ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Update
                  </button>
                )}
              </div>
            </div>

            <div className="relative mt-8">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 ${
                          isCompleted
                            ? "bg-green-800 border-green-800 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-green-800/20" : ""}`}
                      >
                        <StepIcon size={18} />
                      </div>
                      <span
                        className={`text-sm mt-2 font-medium ${
                          isCompleted ? "text-green-800" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-blue-700" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Tracking Number
                      </p>
                      <p className="text-lg font-bold text-blue-800">
                        {order.trackingNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-green-800" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={getProductImageUrl(item.image)!}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={30} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Quantity: {item.quantity} ×{" "}
                              {formatCurrency(item.price)}
                            </p>
                            {item.discount > 0 && (
                              <p className="text-xs text-green-600 mt-1">
                                {item.discount}% off
                              </p>
                            )}
                          </div>
                          <p className="font-bold text-green-800">
                            {formatCurrency(
                              calculateItemTotal(
                                item.price,
                                item.quantity,
                                item.discount,
                              ),
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-800">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-green-800" />
                  Order Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  {order.orderStatus !== "pending" && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Processing Started
                        </p>
                        <p className="text-sm text-gray-500">
                          Order is being processed
                        </p>
                      </div>
                    </div>
                  )}
                  {(order.orderStatus === "shipped" ||
                    order.orderStatus === "delivered") && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Truck size={16} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Shipped</p>
                        <p className="text-sm text-gray-500">
                          {order.trackingNumber
                            ? `Tracking: ${order.trackingNumber}`
                            : "Order has been shipped"}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.orderStatus === "delivered" && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={16} className="text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Delivered</p>
                        <p className="text-sm text-gray-500">
                          Order has been delivered
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-green-800" />
                  Customer Information
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-green-700" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && (
                        <>, {order.shippingAddress.addressLine2}</>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>

                {isUserObject(order.user) && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User size={16} className="text-green-700" />
                      Account Details
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {order.user.fullName && (
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} className="text-green-600" />
                          <span className="text-gray-600">
                            {order.user.fullName}
                          </span>
                        </div>
                      )}
                      {order.user.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-green-600" />
                          <span className="text-gray-600">
                            {order.user.email}
                          </span>
                        </div>
                      )}
                      {order.user.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-green-600" />
                          <span className="text-gray-600">
                            {order.user.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-green-800" />
                  Payment Information
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total Amount:</span>
                      <span className="text-green-800 text-xl">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} className="text-green-700" />
                    Order Notes
                  </h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Snackbar />
    </div>
  );
}
