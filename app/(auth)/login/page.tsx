"use client";

import Link from "next/link";
import { useState } from "react";
import { LoginForm } from "../_components/LoginForm"; 
import { BusinessLoginForm } from "../_components/BusinessLogin";

type UserRole = "initial" | "Customer" | "Seller";

export default function LoginLandingPage() {
  const [role, setRole] = useState<UserRole>("initial");

  const Header = () => (
    <div className="flex justify-center pt-8 mb-8 w-full max-w-sm mx-auto">
      <img src="/images/logo-2.png" alt="Agrix Logo" className="w-20 h-auto" />
    </div>
  );

  if (role === "Customer") {
    return (
      <div className="min-h-screen bg-white font-crimsonPro">
        <Header />
        <LoginForm />
        <div className="flex justify-center mt-2 pb-10 text-lg">
          <span className="text-gray-500 font-normal">Back to</span>
          <button
            onClick={() => setRole("initial")}
            className="text-red-600 font-medium ml-2 hover:underline"
          >
            Login Selection
          </button>
        </div>
      </div>
    );
  }

  if (role === "Seller") {
    return (
      <>
        <BusinessLoginForm />
        <div className="flex justify-center mt-6 text-lg">
          <span className="text-gray-500 font-normal">Back to</span>
          <button
            onClick={() => setRole("initial")}
            className="text-red-600 font-medium ml-2 hover:underline"
          >
            Login Selection
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full max-w-sm mx-auto p-6 md:p-8 text-center font-crimsonPro pt-0">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8">
          Welcome Back
        </h1>
        <p className="text-xl text-[#777777] font-normal mb-10">
          How would you like to login?
        </p>
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setRole("Customer")}
            className="w-full py-4 text-2xl font-medium rounded-xl transition bg-[#0B3D0B] text-white hover:bg-green-900"
          >
            Login as Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("Seller")}
            className="w-full py-4 text-2xl font-medium rounded-xl transition border border-[#0B3D0B] text-[#0B3D0B] hover:bg-gray-100"
          >
            Login as Seller
          </button>
        </div>
        <div className="flex justify-center mt-8 text-lg">
          <span className="text-gray-500 font-normal">
            Don't have an account?
          </span>
          <Link
            href="/signup"
            className="text-red-600 font-medium ml-2 hover:underline"
          >
            Signup!
          </Link>
        </div>
      </div>
    </>
  );
}
