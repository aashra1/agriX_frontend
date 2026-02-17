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
  Save,
  Camera,
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orderStats, setOrderStats] = useState<OrderStats>({
    toPay: 0,
    toShip: 0,
    toReceive: 0,
    completed: 0,
    total: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        address: user.address || "",
      });

      if (user.profilePicture) {
        const fileName = user.profilePicture.split(/[\\/]/).pop();
        setPreviewUrl(`${baseUrl}/uploads/profile-images/${fileName}`);
      }
    }
  }, [user, baseUrl]);

  // Fetch orders and calculate stats
  useEffect(() => {
    const fetchOrderStats = async () => {
      if (!user) return;

      setLoadingOrders(true);
      try {
        const response = await getUserOrders(1, 100); // Get up to 100 orders
        const orders = response.orders || [];

        const stats: OrderStats = {
          toPay: 0,
          toShip: 0,
          toReceive: 0,
          completed: 0,
          total: orders.length,
        };

        orders.forEach((order: Order) => {
          // Check payment status for "to pay" (pending payment)
          if (order.paymentStatus === "pending") {
            stats.toPay += 1;
          }

          // Check order status for others
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
            // cancelled orders are not counted in any category
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement update profile API call
      setSnackbar({
        message: "Profile updated successfully!",
        type: "success",
      });
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSnackbar({ message: "", type: null }), 3000);
    }
  };

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

          {/* Profile Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden border-4 border-white shadow-lg ${isEditing ? "cursor-pointer" : ""}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  {previewUrl && !imageError ? (
                    <img
                      src={previewUrl}
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
                {isEditing && (
                  <div
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors shadow-md flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={16} />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
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

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg"
                >
                  <Edit size={20} /> Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      if (user) {
                        setFormData({
                          fullName: user.fullName || user.name || "",
                          email: user.email || "",
                          phone: user.phone || user.phoneNumber || "",
                          address: user.address || "",
                        });
                        if (user.profilePicture) {
                          const fileName = user.profilePicture
                            .split(/[\\/]/)
                            .pop();
                          setPreviewUrl(
                            `${baseUrl}/uploads/profile-images/${fileName}`,
                          );
                        }
                      }
                    }}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save size={20} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {loadingOrders
              ? // Loading skeletons
                Array(4)
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
                  Account Settings
                </h2>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User size={20} className="text-green-800" />
                  Personal Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="Your full name"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {userData.displayName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="your@email.com"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        {userData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="+977 98XXXXXXXX"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        {userData.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="Your address"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {userData.address}
                      </p>
                    )}
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Two-Factor Auth</span>
                    <span className="text-emerald-700 font-medium">
                      Disabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Login</span>
                    <span className="text-gray-900 font-medium">
                      Today, 10:30 AM
                    </span>
                  </div>
                  <Link
                    href="/auth/security"
                    className="mt-4 text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                  >
                    Manage security settings <ChevronRight size={12} />
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
