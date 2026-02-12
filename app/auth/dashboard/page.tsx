"use client";

import { useAuth } from "@/context/AuthContext";
import { API } from "@/lib/api/endpoints";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  MapPin,
  ChevronRight,
  Compass,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
  description: string;
  parentCategory: string | null;
};

const categoryIcons: { [key: string]: string } = {
  "Seeds & Plants": "/icons/seeds.png",
  "Fertilizers & Soil Care": "/icons/fertilizer.png",
  Irrigation: "/icons/water-system.png",
  Pesticides: "/icons/pesticide.png",
  "Animal & Livestock Products": "/icons/sheep.png",
  "Machinery & Equipments": "/icons/tractor.png",
  default: "/icons/category.png",
};

const sidebarIcons: { [key: string]: string } = {
  Home: "/icons/home.png",
  Favorites: "/icons/favorite.png",
  "My Cart": "/icons/shopping-cart-2.png",
  Profile: "/icons/user.png",
  default: "/icons/category.png",
};

const DEFAULT_PROFILE_IMAGE = "/images/profile.jpg";

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch(API.CATEGORY.GET_ALL, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.categories || data.data || []);
      } catch (error) {
        setCategoriesError("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getProfileImage = () => {
    if (profileImageError || !user?.profilePicture)
      return DEFAULT_PROFILE_IMAGE;
    const BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
    return `${BASE}/${user.profilePicture.replace(/^\//, "")}`;
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.username || user.email?.split("@")[0] || "User";
  };

  if (loading)
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 p-6 sticky top-0 h-screen shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
            {getUserDisplayName()}
          </h2>
          <p className="text-xs text-gray-500 mt-1">Welcome back!</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink href="#" icon={sidebarIcons.Home} label="Home" active />
          <SidebarLink
            href="/favorites"
            icon={sidebarIcons.Favorites}
            label="Favorites"
          />
          <SidebarLink
            href="/cart"
            icon={sidebarIcons["My Cart"]}
            label="My Cart"
          />
          <SidebarLink
            href="/profile"
            icon={sidebarIcons.Profile}
            label="Profile"
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <Sparkles className="text-green-700 mb-2" size={20} />
            <p className="text-xs font-medium text-gray-700 mb-1">
              Premium Member
            </p>
            <p className="text-xs text-gray-500">
              Unlock exclusive deals & offers
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8 py-4 flex justify-between items-center border-b border-gray-200/50 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search for seeds, fertilizers, or tools..."
              className="w-full bg-white rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all text-sm text-gray-700 border border-gray-200/50 shadow-sm hover:shadow-md focus:shadow-md"
              style={
                {
                  "--tw-ring-color": "#0B3D0B33",
                } as React.CSSProperties
              }
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
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <Link
              href="/profile"
              className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-green-800 transition-all shadow-sm hover:shadow-md"
            >
              <img
                src={getProfileImage()}
                alt="User"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <section className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/images/header.png"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Background"
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
                    Premium Quality Products
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-white leading-tight mb-3">
                  Shop · Tap · Grow
                </h1>
                <p className="text-white/95 text-lg max-w-md leading-relaxed">
                  Premium agricultural supplies delivered directly to your farm
                  doorstep.
                </p>
                <button
                  className="mt-8 text-black font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all w-fit flex items-center gap-3 text-sm group/btn hover:shadow-2xl"
                  style={{ backgroundColor: "#FFDE7C" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#083008";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0B3D0B";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Compass size={20} />
                  Explore Marketplace
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-800 to-emerald-600 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Browse Categories
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm ml-3">
                    Find exactly what your farm needs
                  </p>
                </div>
                <Link
                  href="/categories"
                  className="font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100"
                  style={{ color: "#0B3D0B" }}
                >
                  View All <ChevronRight size={18} />
                </Link>
              </div>

              {categoriesLoading ? (
                <div className="h-64 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                  <div className="relative">
                    <div
                      className="animate-spin rounded-full h-10 w-10 border-3 border-t-transparent"
                      style={{
                        borderColor: "#0B3D0B",
                        borderTopColor: "transparent",
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categories.map((cat, index) => (
                    <Link
                      key={cat._id}
                      href={`/categories/${cat._id}`}
                      className="group relative flex flex-col p-6 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-4 shadow-sm group-hover:shadow-md relative z-10"
                        style={{ backgroundColor: "#0B3D0B15" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#0B3D0B";
                          e.currentTarget.style.transform =
                            "rotate(5deg) scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#0B3D0B15";
                          e.currentTarget.style.transform =
                            "rotate(0deg) scale(1)";
                        }}
                      >
                        <Image
                          src={categoryIcons[cat.name] || categoryIcons.default}
                          width={32}
                          height={32}
                          alt={cat.name}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="relative z-10">
                        <p className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-green-800 transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-green-800 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
                        <span className="text-xs font-medium">Explore</span>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Top Offers */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-amber-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Top Offers
                  </h2>
                </div>
                <button
                  className="font-semibold hover:underline text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                  style={{ color: "#0B3D0B" }}
                >
                  See All
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl overflow-hidden relative h-56 group shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="/images/splash2.png"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Offer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2"
                    style={{ color: "#0B3D0B" }}
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    New Arrival
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="w-full bg-white/95 backdrop-blur-md text-green-800 font-semibold py-3 rounded-xl hover:bg-white transition-colors shadow-lg">
                      Shop Now
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden relative h-56 bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200/50 flex items-center justify-center p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/images/logo-2.png"
                    width={160}
                    height={160}
                    className="object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                    alt="Brand Logo"
                  />
                </div>
              </div>
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
      `}</style>
    </div>
  );
}

// Sidebar Link Component
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
