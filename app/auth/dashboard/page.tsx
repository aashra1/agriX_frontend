"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Compass,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import UserSidebar from "../_components/UserSidebar";
import UserHeader from "../_components/UserHeader";
import { handleGetAllCategories } from "@/lib/actions/category-actions";
import { Category } from "@/lib/api/category";

const categoryIcons: { [key: string]: string } = {
  "Seeds & Plants": "/icons/seeds.png",
  "Fertilizers & Soil Care": "/icons/fertilizer.png",
  Irrigation: "/icons/water-system.png",
  Pesticides: "/icons/pesticide.png",
  "Animal & Livestock Products": "/icons/sheep.png",
  "Machinery & Equipments": "/icons/tractor.png",
  default: "/icons/category.png",
};

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const result = await handleGetAllCategories();
        if (result.success && result.categories) {
          setCategories(result.categories);
        } else {
          setCategoriesError(result.message || "Failed to load categories");
        }
      } catch (error) {
        setCategoriesError("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
      <UserSidebar activePage="Home" />

      <main className="flex-1 overflow-x-hidden">
        <UserHeader />

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
              ) : categoriesError ? (
                <div className="h-64 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                  <p className="text-red-500">{categoriesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categories.map((cat, index) => (
                    <Link
                      key={cat._id}
                      href={`/auth/categories/${cat._id}`}
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
