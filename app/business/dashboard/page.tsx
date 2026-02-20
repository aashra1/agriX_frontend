"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  Package,
  ShoppingCart,
  Users,
  PlusCircle,
  BarChart3,
  Clock,
  Wallet,
} from "lucide-react";
import BusinessSidebar from "../_components/BusinessSidebar";
import BusinessHeader from "../_components/BusinessHeader";
import { handleGetBusinessDashboard } from "@/lib/actions/dashboard-actions";

type DashboardData = {
  products: any[];
  orders: any[];
  wallet: { balance: number; currency: string };
};

export default function BusinessDashboard() {
  const { user, businessId } = useAuth();
  const [data, setData] = useState<DashboardData>({
    products: [],
    orders: [],
    wallet: { balance: 0, currency: "NPR" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!businessId) return;

      setIsLoading(true);
      setError(null);
      try {
        const result = await handleGetBusinessDashboard();

        if (result.success) {
          setData({
            products: result.products || [],
            orders: result.orders || [],
            wallet: result.wallet || { balance: 0, currency: "NPR" },
          });
        } else {
          setError(result.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId) {
      fetchDashboardData();
    }
  }, [businessId]);

  const getProductImageUrl = (product: any) => {
    if (product.image) {
      const fileName = product.image.split(/[\\/]/).pop();
      return `${baseUrl}/uploads/product-images/${fileName}`;
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getCustomerName = (order: any): string => {
    if (typeof order.user === "object" && order.user !== null) {
      return order.user?.fullName || "N/A";
    }
    return "Customer";
  };

  const formatOrderId = (id: string) => {
    return `#${id.slice(-6)}`;
  };

  const lowStockCount = data.products.filter((p) => (p.stock || 0) < 10).length;
  const pendingOrdersCount = data.orders.filter(
    (o) => o.orderStatus === "pending",
  ).length;
  const uniqueCustomers = new Set(
    data.orders
      .map((order) => {
        if (typeof order.user === "object" && order.user !== null) {
          return order.user?._id;
        }
        return order.user;
      })
      .filter(Boolean),
  ).size;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="relative">
          <div
            className="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent"
            style={{ borderColor: "#0B3D0B", borderTopColor: "transparent" }}
          ></div>
          <div className="absolute inset-0 rounded-full bg-green-100 opacity-20 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader searchPlaceholder="Search products, orders, customers..." />

        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <section className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/images/header.png"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Farm Background"
              priority
            />
            <div
              className="absolute inset-0 flex flex-col justify-center px-12"
              style={{
                background:
                  "linear-gradient(to right, rgba(11, 61, 11, 0.85), rgba(11, 61, 11, 0.3))",
              }}
            >
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Sparkles size={16} className="text-yellow-300" />
                  <span className="text-white text-xs font-medium">
                    {user?.businessName
                      ? `${user.businessName}'s Dashboard`
                      : "Business Dashboard"}
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-white leading-tight mb-3">
                  Welcome back, {user?.name?.split(" ")[0] || "Farmer"}!
                </h1>
                <p className="text-white/95 text-lg max-w-md leading-relaxed">
                  Track orders, manage inventory, and grow your agricultural
                  business.
                </p>
                <div className="flex gap-4 mt-8">
                  <Link
                    href="/business/products/add-products"
                    className="inline-flex items-center gap-3 bg-[#FFDE7C] text-black font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all hover:shadow-2xl group/btn"
                    style={{ backgroundColor: "#FFDE7C" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <PlusCircle size={20} />
                    Add New Product
                    <ArrowRight
                      size={18}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                  <Link
                    href="/business/payments"
                    className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all hover:bg-white/30 group/btn border border-white/30"
                  >
                    <Wallet size={20} />
                    View Payments
                    <ArrowRight
                      size={18}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={<Wallet size={24} />}
              label="Wallet Balance"
              value={formatCurrency(data.wallet.balance)}
              trend="Available balance"
              trendUp={true}
            />
            <StatCard
              icon={<ShoppingCart size={24} />}
              label="Total Orders"
              value={data.orders.length.toString()}
              trend={`${pendingOrdersCount} pending`}
              trendUp={true}
            />
            <StatCard
              icon={<Users size={24} />}
              label="Customers"
              value={uniqueCustomers.toString()}
              trend="unique buyers"
              trendUp={true}
            />
            <StatCard
              icon={<Package size={24} />}
              label="Products"
              value={data.products.length.toString()}
              trend={`${lowStockCount} low stock`}
              trendUp={lowStockCount === 0}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-800 to-emerald-600 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Your Products
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm ml-3">
                    {data.products.length}{" "}
                    {data.products.length === 1 ? "product" : "products"} in
                    your inventory
                  </p>
                </div>
                <Link
                  href="/business/products"
                  className="font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100"
                  style={{ color: "#0B3D0B" }}
                >
                  View All <ChevronRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.products.slice(0, 4).map((product, index) => {
                  const productImageUrl = getProductImageUrl(product);

                  return (
                    <Link
                      key={product._id}
                      href={`/business/products/edit-product/${product._id}`}
                      className="group relative flex flex-col p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#0B3D0B";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb80";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="bg-white rounded-xl p-3 aspect-square flex items-center justify-center mb-3 border border-gray-100">
                        {productImageUrl ? (
                          <img
                            src={productImageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/placeholder-product.png";
                            }}
                          />
                        ) : (
                          <Package size={40} className="text-gray-400" />
                        )}
                      </div>

                      <div className="relative z-10">
                        <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-green-800 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-green-800">
                            {formatCurrency(product.price)}
                          </span>
                          <span
                            className={`text-xs ${(product.stock || 0) < 10 ? "text-red-500 font-medium" : "text-gray-500"}`}
                          >
                            Stock: {product.stock || 0}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-green-800 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
                        <span className="text-xs font-medium">Edit</span>
                        <ArrowRight
                          size={12}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {data.products.length === 0 && (
                <div className="bg-white/90 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start adding products to your store
                  </p>
                  <Link
                    href="/business/products/add-products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B3D0B] text-white font-medium rounded-xl hover:bg-green-900 transition-all"
                  >
                    <PlusCircle size={18} />
                    Add Your First Product
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-emerald-700" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Orders
                  </h2>
                </div>
                <Link
                  href="/business/orders"
                  className="font-semibold flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                  style={{ color: "#0B3D0B" }}
                >
                  View All ({data.orders.length})
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm">
                {data.orders.length > 0 ? (
                  data.orders.slice(0, 5).map((order, index) => (
                    <Link
                      key={order._id}
                      href={`/business/orders/${order._id}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-green-800">
                          {formatOrderId(order._id)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getCustomerName(order)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          {formatCurrency(order.total)}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getStatusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <ShoppingCart
                      size={32}
                      className="mx-auto text-gray-300 mb-2"
                    />
                    <p className="text-gray-500 text-sm">No orders yet</p>
                  </div>
                )}
              </div>

              {lowStockCount > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="text-emerald-800" size={24} />
                    <h3 className="font-bold text-gray-900">Inventory Alert</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Low Stock Items</span>
                      <span className="font-bold text-amber-600">
                        {lowStockCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Products</span>
                      <span className="font-bold text-gray-900">
                        {data.products.length}
                      </span>
                    </div>
                    <Link
                      href="/business/products?filter=low-stock"
                      className="mt-3 text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                    >
                      View low stock items
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
          style={{ backgroundColor: "#0B3D0B15" }}
        >
          <div style={{ color: "#0B3D0B" }}>{icon}</div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
