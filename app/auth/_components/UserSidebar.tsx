"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const sidebarIcons: { [key: string]: string } = {
  Home: "/icons/home.png",
  Favorites: "/icons/favorite.png",
  "My Cart": "/icons/shopping-cart-2.png",
  Profile: "/icons/user.png",
  Orders: "/icons/orders.png",
  default: "/icons/category.png",
};

interface SidebarLinkProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({ href, icon, label, active = false }: SidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active ? "shadow-md" : ""
      }`}
      style={{
        backgroundColor: active
          ? "#0B3D0B"
          : isHovered
            ? "#f0fdf4"
            : "transparent",
        borderRadius: "12px",
        transform: isHovered && !active ? "translateX(4px)" : "translateX(0)",
      }}
      onMouseEnter={() => !active && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <Image
          src={icon}
          width={20}
          height={20}
          alt={label}
          className="transition-all duration-200"
          style={{
            filter: active
              ? "brightness(0) invert(1)"
              : isHovered
                ? "brightness(0.3)"
                : "brightness(0) opacity(0.7)",
          }}
        />
      </div>
      <span
        className="font-semibold text-sm transition-colors duration-200"
        style={{
          color: active ? "#FFFFFF" : isHovered ? "#0B3D0B" : "#6B7280",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

interface UserSidebarProps {
  activePage?: string;
  showPremiumCard?: boolean;
  className?: string;
  navigationItems?: Array<{
    href: string;
    icon: string;
    label: string;
  }>;
}

export default function UserSidebar({
  activePage = "Home",
  showPremiumCard = true,
  className = "",
  navigationItems = [
    { href: "/auth/dashboard", icon: sidebarIcons.Home, label: "Home" },
    { href: "/auth/cart", icon: sidebarIcons["My Cart"], label: "My Cart" },
    { href: "/auth/profile", icon: sidebarIcons.Profile, label: "Profile" },
    { href: "/auth/orders", icon: sidebarIcons.Orders, label: "Orders" },
  ],
}: UserSidebarProps) {
  const { user } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.username || user.email?.split("@")[0] || "User";
  };

  return (
    <aside
      className={`hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 p-6 sticky top-0 h-screen shadow-sm ${className}`}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
          {getUserDisplayName()}
        </h2>
        <p className="text-xs text-gray-500 mt-1">Welcome back!</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => (
          <SidebarLink
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={activePage === item.label}
          />
        ))}
      </nav>
    </aside>
  );
}
