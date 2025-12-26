'use client';

import Link from "next/link";
import { useState } from "react";
import { CustomerRegisterForm } from "../_components/CustomerSignupForm";
import { BusinessRegisterForm } from "../_components/SellerSignupForm";

type UserRole = "initial" | "Customer" | "Seller";

export default function LandingPage() {
    const [role, setRole] = useState<UserRole>('initial');

    const Header = () => (
        <div className="flex justify-center pt-8 mb-8 w-full max-w-sm mx-auto">
            <img
                src="/images/logo-2.png"
                alt="Agrix Logo"
                className="w-20 h-auto"
            />
        </div>
    );

    if (role === 'Customer') {
        return (
            <>
                <Header />
                <CustomerRegisterForm setRole={setRole} />
            </>
        );
    }

    if (role === 'Seller') {
        return (
            <>
                <Header />
                <BusinessRegisterForm setRole={setRole} />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="w-full max-w-sm mx-auto p-6 md:p-8 text-center font-crimsonpro pt-0">
                <h1 className="text-4xl md:text-5xl font-semibold mb-8">
                    Welcome to Agrix
                </h1>
                <p className="text-xl text-[#777777] font-normal mb-10">
                    How would you like to use Agrix?
                </p>
                <div className="space-y-6">
                    <button
                        type="button"
                        onClick={() => setRole('Customer')}
                        className="w-full py-4 text-2xl font-medium rounded-xl transition bg-[#0B3D0B] text-white hover:bg-green-900"
                    >
                        Signup as Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('Seller')}
                        className="w-full py-4 text-2xl font-medium rounded-xl transition border border-[#0B3D0B] text-[#0B3D0B] hover:bg-gray-100"
                    >
                        Signup as Seller
                    </button>
                </div>
                <div className="flex justify-center mt-8 text-lg">
                    <span className="text-gray-500 font-normal">
                        Already have an account?
                    </span>
                    <Link
                        href="/login"
                        className="text-red-600 font-medium ml-2 hover:underline"
                    >
                        Login!
                    </Link>
                </div>
            </div>
        </>
    );
}
