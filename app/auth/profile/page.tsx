"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  LogOut,
  Package,
  Truck,
  CreditCard,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  ChevronRight,
  ShoppingCart,
  Heart,
  Shield,
} from "lucide-react";
import UserSidebar from "../_components/UserSidebar";
import UserHeader from "../_components/UserHeader";
import { getUserOrders } from "@/lib/api/order";
import { Order } from "@/lib/api/order";

type OrderStats = {
  toPay: number;
  toShip: number;
  toReceive: number;
  completed: number;
  total: number;
};

type SnackbarState = {
  message: string;
  type: "success" | "error" | "info" | null;
};

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [orderStats, setOrderStats] = useState<OrderStats>({
    toPay: 0,
    toShip: 0,
    toReceive: 0,
    completed: 0,
    total: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrderStats = async () => {
      if (!user) return;

      setLoadingOrders(true);
      try {
        const response = await getUserOrders(1, 100);
        const orders = response.orders || [];

        const stats: OrderStats = {
          toPay: 0,
          toShip: 0,
          toReceive: 0,
          completed: 0,
          total: orders.length,
        };

        orders.forEach((order: Order) => {
          if (order.paymentStatus === "pending") {
            stats.toPay += 1;
          }

          switch (order.orderStatus) {
            case "pending":
            case "processing":
              stats.toShip += 1;
              break;
            case "shipped":
              stats.toReceive += 1;
              break;
            case "delivered":
              stats.completed += 1;
              break;
          }
        });

        setOrderStats(stats);
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrderStats();
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const userData = useMemo(() => {
    return {
      displayName: user?.fullName || user?.name || "Guest User",
      email: user?.email || "email@example.com",
      phone: user?.phone || user?.phoneNumber || "Not provided",
      address: user?.address || "Not provided",
      memberSince: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "2025",
      profileImageUrl: user?.profilePicture
        ? `${baseUrl}/${user.profilePicture.replace(/^\//, "")}`
        : null,
    };
  }, [user, baseUrl]);

  const orderStatCards = [
    {
      label: "To Pay",
      value: orderStats.toPay,
      icon: CreditCard,
      color: "text-amber-600",
      bg: "bg-amber-50",
      filter: "pending-payment",
    },
    {
      label: "To Ship",
      value: orderStats.toShip,
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      filter: "processing",
    },
    {
      label: "To Receive",
      value: orderStats.toReceive,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      filter: "shipped",
    },
    {
      label: "Completed",
      value: orderStats.completed,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
      filter: "delivered",
    },
  ];

  const accountLinks = [
    {
      href: "/auth/wishlist",
      icon: Heart,
      label: "Wishlist",
      description: "View your saved items",
    },
    {
      href: "/auth/cart",
      icon: ShoppingCart,
      label: "My Cart",
      description: "View and manage your cart",
    },
    {
      href: "/auth/orders",
      icon: Package,
      label: "My Orders",
      description: `View all ${orderStats.total} orders`,
    },
  ];

  if (loading || !user) {
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <UserSidebar activePage="Profile" />
      <main className="flex-1 overflow-x-hidden">
        <UserHeader />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/auth/dashboard"
              className="text-gray-500 hover:text-green-800"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">My Profile</span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  {userData.profileImageUrl && !imageError ? (
                    <img
                      src={userData.profileImageUrl}
                      alt={userData.displayName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-emerald-700">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {userData.displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail size={16} className="text-green-700" />
                    {userData.email}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <Phone size={16} className="text-green-700" />
                    {userData.phone}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <MapPin size={16} className="text-green-700" />
                    {userData.address}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} className="text-green-700" />
                    Member since {userData.memberSince}
                  </span>
                </div>
              </div>

              <Link
                href="/auth/profile/edit"
                className="px-6 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg"
              >
                <Edit size={20} /> Edit Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {loadingOrders
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))
              : orderStatCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Link
                      key={index}
                      href={`/auth/orders?filter=${stat.filter}`}
                      className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:shadow-md transition-all group"
                    >
                      <div
                        className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={20} className={stat.color} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </Link>
                  );
                })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-green-800 to-emerald-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Account Information
                </h2>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-medium text-gray-900">
                      {userData.displayName}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-gray-900">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium text-gray-900">
                      {userData.phone}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium text-gray-900">
                      {userData.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-emerald-800" size={24} />
                  <h3 className="font-bold text-gray-900">Security</h3>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/auth/change-password"
                    className="flex items-center justify-between text-sm p-3 bg-white/50 rounded-xl hover:bg-white transition-colors"
                  >
                    <span className="text-gray-600">Change Password</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {accountLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      className="flex items-center justify-between p-4 hover:bg-green-50/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <Icon
                            size={20}
                            className="text-gray-700 group-hover:text-green-800"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-green-800">
                            {link.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-green-800 group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      {isLoggingOut ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <LogOut size={20} className="text-red-600" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-red-600">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-red-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {snackbar.type && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 font-crimsonPro text-sm ${
            snackbar.type === "success"
              ? "bg-green-600 text-white"
              : snackbar.type === "error"
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
