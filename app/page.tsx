'use client';

import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
            {/* Logo */}
            <div className="pt-12 mb-8">
                <img
                    src="/images/logo-2.png"
                    alt="Agrix Logo"
                    className="w-24 h-auto"
                />
            </div>

            {/* Hero Text */}
            <div className="text-center max-w-xl">
                <h1 className="text-5xl md:text-6xl font-semibold mb-6 font-crimsonpro">
                    Welcome to Agrix
                </h1>
                <p className="text-xl text-gray-700 mb-10">
                    Connecting farmers, customers, and businesses with ease. 
                    Join us and grow with Agrix.
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
                <Link
                    href="/signup"
                    className="px-10 py-4 text-xl font-medium rounded-xl bg-[#0B3D0B] text-white hover:bg-green-900 transition"
                >
                    Signup
                </Link>
                <Link
                    href="/login"
                    className="px-10 py-4 text-xl font-medium rounded-xl border border-[#0B3D0B] text-[#0B3D0B] hover:bg-gray-100 transition"
                >
                    Login
                </Link>
            </div>

            <div className="mt-16 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Agrix. All rights reserved.
            </div>
        </div>
    );
}
