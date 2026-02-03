"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  User,
  Lock,
  LogOut,
  Package,
  Truck,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [imageError, setImageError] = useState(false);

  if (loading)
    return <div className="flex justify-center p-20">Loading...</div>;

  const displayName = user?.fullName || user?.name || "Guest";

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  const profileImageUrl = user?.profilePicture
    ? `${baseUrl}/${user.profilePicture.replace(/^\//, "")}`
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-serif">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border-2 border-emerald-900/10 shadow-sm">
          {profileImageUrl && !imageError ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <User size={40} className="text-gray-500" />
          )}
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Hello, {displayName.split(" ")[0]}
        </h1>
      </div>

      <hr className="border-gray-100 mb-6" />

      <div className="grid grid-cols-4 gap-2 mb-10 text-center">
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <Truck
            size={20}
            className="text-emerald-900 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium text-emerald-900">To Ship</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <ShoppingBag
            size={20}
            className="text-emerald-900 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium text-emerald-900">
            Your Order
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <Package
            size={20}
            className="text-emerald-900 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium text-emerald-900">
            To Receive
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <CreditCard
            size={20}
            className="text-emerald-900 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium text-emerald-900">To Pay</span>
        </div>
      </div>

      <div className="space-y-1">
        <Link
          href="/profile/edit"
          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition"
        >
          <User size={22} className="text-gray-700" />
          <span className="text-lg font-medium text-gray-800">
            Edit Your Profile
          </span>
        </Link>

        <hr className="border-gray-50 mx-4" />

        <Link
          href="/profile/change-password"
          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition"
        >
          <Lock size={22} className="text-gray-700" />
          <span className="text-lg font-medium text-gray-800">
            Change Password
          </span>
        </Link>

        <hr className="border-gray-50 mx-4" />

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-lg transition text-left"
        >
          <LogOut size={22} className="text-gray-700" />
          <span className="text-lg font-medium text-gray-800">Logout</span>
        </button>
      </div>
    </div>
  );
}
