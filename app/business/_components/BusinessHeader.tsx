"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, MapPin, ArrowLeft } from "lucide-react";

const DEFAULT_PROFILE_IMAGE = "/images/profile.jpg";

interface BusinessHeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  searchPlaceholder?: string;
}

export default function BusinessHeader({
  showBackButton = false,
  backUrl = "/business/dashboard",
  searchPlaceholder = "Search products, orders, customers...",
}: BusinessHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [profileImageError, setProfileImageError] = useState(false);

  const getProfileImage = () => {
    if (profileImageError || !user?.profilePicture)
      return DEFAULT_PROFILE_IMAGE;
    const BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
    return `${BASE}/${user.profilePicture.replace(/^\//, "")}`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8 py-4 flex justify-between items-center border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>
        )}
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-white rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all text-sm text-gray-700 border border-gray-200/50 shadow-sm hover:shadow-md focus:shadow-md"
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 0 3px #0B3D0B15";
              e.target.style.borderColor = "#0B3D0B";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "#e5e7eb80";
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden xl:flex items-center gap-2 text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200/50">
          <MapPin size={18} style={{ color: "#0B3D0B" }} />
          <span className="text-sm font-medium">
            {user?.address || "Bouddha, Kathmandu"}
          </span>
        </div>
        <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all relative group">
          <Bell
            size={20}
            className="text-gray-600 group-hover:text-green-800"
          />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        <Link
          href="/business/profile"
          className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-green-800 transition-all shadow-sm hover:shadow-md"
        >
          <img
            src={getProfileImage()}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setProfileImageError(true)}
          />
        </Link>
      </div>
    </header>
  );
}
