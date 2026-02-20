"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const sidebarIcons: { [key: string]: string } = {
  Dashboard: "/icons/home.png",
  Products: "/icons/box-3.png",
  Orders: "/icons/orders.png",
  Customers: "/icons/customer.png",
  Profile: "/icons/user.png",
  Payments: "/icons/wallet.png",
  default: "/icons/category.png",
};

export type SidebarItem = {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
};

export default function BusinessSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems: SidebarItem[] = [
    {
      href: "/business/dashboard",
      icon: sidebarIcons.Dashboard,
      label: "Dashboard",
    },
    {
      href: "/business/products",
      icon: sidebarIcons.Products,
      label: "Products",
    },
    { href: "/business/orders", icon: sidebarIcons.Orders, label: "Orders" },
    {
      href: "/business/customers",
      icon: sidebarIcons.Customers,
      label: "Customers",
    },
    {
      href: "/business/payments", // Add this item
      icon: sidebarIcons.Payments,
      label: "Payments",
    },
    { href: "/business/profile", icon: sidebarIcons.Profile, label: "Profile" },
  ];

  const getBusinessDisplayName = () => {
    if (!user) return "Your Store";
    return user.businessName || user.name || "Your Store";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 p-6 sticky top-0 h-screen shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
          {getBusinessDisplayName()}
        </h2>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Business Account
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
          />
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200`}
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
