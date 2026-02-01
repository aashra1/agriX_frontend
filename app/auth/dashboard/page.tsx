"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function UserDashboard() {
  const { user, loading } = useAuth();

  const categories = [
    { name: "Seeds & Plants", icon: "/icons/seeds.png" },
    { name: "Fertilizers & Soil Care", icon: "/icons/fertilizer.png" },
    { name: "Irrigation", icon: "/icons/water-system.png" },
    { name: "Pesticides", icon: "/icons/pesticide.png" },
    { name: "Animal & Livestock Products", icon: "/icons/sheep.png" },
    { name: "Machinery & Equipments", icon: "/icons/tractor.png" },
  ];

  if (loading)
    return <div className="p-10 text-center font-crimsonpro">Loading...</div>;

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen bg-white font-crimsonpro pb-24">
      <div className="relative w-full h-[400px] rounded-b-[40px] overflow-hidden">
        <Image
          src="/images/header.png"
          fill
          className="object-cover"
          alt="Green Header Background"
          priority
        />

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <Image
                src="/icons/address.png"
                width={24}
                height={24}
                alt="Location"
              />
              <div>
                <p className="text-sm font-medium text-emerald-900 leading-none mb-1">
                  Your location
                </p>
                <p className="text-lg font-bold text-emerald-950">
                  {user?.address || "Bouddha, Kathmandu"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative">
                <Image
                  src="/icons/bell.png"
                  width={32}
                  height={32}
                  alt="Notifications"
                />
              </button>
              <Link
                href="/profile"
                className="border-2 border-white rounded-full overflow-hidden"
              >
                <Image
                  src="/images/profile.jpg"
                  width={40}
                  height={40}
                  alt="User Profile"
                />
              </Link>
            </div>
          </div>

          <div className="mb-10 space-y-6">
            <div>
              <h1 className="text-4xl font-black text-emerald-950 leading-tight">
                SHOP . TAP . GROW
              </h1>
              <button className="mt-4 bg-[#FCD34D] hover:bg-yellow-500 text-emerald-950 font-bold px-12 py-3 rounded-2xl shadow-md transition-all">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="px-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, index) => (
            <button
              key={index}
              className="flex items-center justify-between p-4 bg-[#F5F5F5] hover:bg-emerald-50 rounded-2xl transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Image src={cat.icon} width={40} height={40} alt={cat.name} />
                </div>
                <span className="font-semibold text-gray-700 text-left">
                  {cat.name}
                </span>
              </div>
              <Image
                src="/icons/to-right.png"
                width={16}
                height={16}
                alt="Go"
                className="opacity-40 group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 mt-12 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Exciting Offers</h2>
          <button className="text-emerald-800 font-bold">view all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[35px] overflow-hidden relative h-48 shadow-md">
            <Image
              src="/images/splash2.png"
              fill
              className="object-cover"
              alt="Offer 1"
            />
            <div className="absolute bottom-4 left-6">
              <span className="bg-white/80 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-emerald-900">
                NEW ARRIVAL
              </span>
            </div>
          </div>
          <div className="rounded-[35px] overflow-hidden relative h-48 shadow-md">
            <Image
              src="/images/logo-2.png"
              fill
              className="object-contain bg-gray-100 p-10"
              alt="Offer 2"
            />
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white border border-gray-100 shadow-2xl rounded-[35px] p-3 flex justify-between items-center z-50">
        <button className="flex items-center gap-3 bg-emerald-950 text-white px-8 py-3 rounded-3xl transition">
          <Image
            src="/icons/home.png"
            width={20}
            height={20}
            alt="Home"
            className="brightness-0 invert"
          />
          <span className="font-bold">Home</span>
        </button>
        <button className="p-3 grayscale hover:grayscale-0 transition">
          <Image
            src="/icons/favorite.png"
            width={24}
            height={24}
            alt="Favorite"
          />
        </button>
        <button className="p-3 grayscale hover:grayscale-0 transition">
          <Image
            src="/icons/shopping-cart-2.png"
            width={24}
            height={24}
            alt="Cart"
          />
        </button>
        <Link
          href="/user/profile"
          className="p-3 grayscale hover:grayscale-0 transition"
        >
          <Image src="/icons/user.png" width={24} height={24} alt="Profile" />
        </Link>
      </div>
    </div>
  );
}
