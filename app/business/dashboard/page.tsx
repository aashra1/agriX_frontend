"use client";

import Image from "next/image";

export default function BusinessDashboard() {
  const products = [
    { id: 1, name: "Tomato Seeds", image: "/images/product-tomato.png" },
    {
      id: 2,
      name: "Strawberry Seeds",
      image: "/images/product-strawberry.png",
    },
    { id: 3, name: "Lavender Seeds", image: "/images/product-lavender.png" },
    { id: 4, name: "Radish Seeds", image: "/images/product-radish.png" },
  ];

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto shadow-2xl overflow-hidden rounded-[2.5rem] border-[8px] border-gray-100 my-10 font-crimsonPro">
      <div className="relative h-[400px] bg-[#D4E9B8] rounded-b-[3rem] p-6 pt-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/header.png"
            alt="Farm Background"
            fill
            className="object-cover opacity-80"
          />
        </div>

        <div className="relative z-10 flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/50 p-2 rounded-lg">
              <img src="/icons/home.png" className="w-6 h-6" alt="location" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Your location</p>
              <h3 className="text-[#0B3D0B] font-bold">Bouddha, Kathmandu</h3>
            </div>
          </div>
          <div className="flex gap-3">
            <img
              src="/icons/bell.png"
              className="w-8 h-8 cursor-pointer"
              alt="notifications"
            />
            <img
              src="/images/profile.jpg"
              className="w-10 h-10 rounded-full border-2 border-white"
              alt="profile"
            />
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="flex items-center bg-white rounded-2xl px-4 py-3 shadow-sm">
            <img
              src="/icons/loupe-3.png"
              className="w-5 h-5 mr-3 opacity-60"
              alt="search"
            />
            <input
              type="text"
              placeholder="Search for a product"
              className="bg-transparent w-full outline-none text-lg text-gray-500"
            />
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <h2 className="text-2xl font-bold text-[#0B3D0B] tracking-[0.2em]">
            SHOP . TAP . GROW
          </h2>
        </div>
      </div>

      <section className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Your products</h2>
          <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition">
            <span className="text-2xl text-[#0B3D0B] font-bold">+</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              <div className="bg-[#F3F3F3] rounded-2xl p-4 w-full aspect-square flex items-center justify-center relative overflow-hidden shadow-sm hover:shadow-md transition">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-lg text-gray-700 font-medium">
                {product.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
