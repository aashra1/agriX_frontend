"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RequestPasswordResetDTO = z.infer<
  typeof RequestPasswordResetSchema
>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const res = await fetch("/api/user/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const response = await res.json();

      if (!res.ok || response?.success === false) {
        throw new Error(
          response?.message || "Failed to request password reset",
        );
      }

      setSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error?.message || "Failed to request password reset");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-serif relative">
      <Link
        href="/login"
        className="absolute left-8 top-8 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
      >
        <Image
          src="/icons/to-right.png"
          alt="Back"
          width={20}
          height={20}
          className="rotate-180 brightness-0"
        />
      </Link>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="bg-[#F1F9E9] w-32 h-32 rounded-full flex items-center justify-center mt-12 mb-8">
          <Image
            src="/icons/password.png"
            alt="Icon"
            width={70}
            height={70}
            className="opacity-100 brightness-0"
          />
        </div>

        <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-3 text-center font-crimsonPro">
          Forgot your password?
        </h1>
        <p className="text-[#666666] text-center text-sm leading-relaxed mb-8 px-8 font-crimsonPro">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="relative mb-10">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/email.png"
                alt="Email"
                width={20}
                height={20}
                className="brightness-0"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              disabled={sent}
              {...register("email")}
              className={`w-full bg-[#F2F2F2] py-4 pl-12 pr-4 rounded-xl text-gray-700 focus:outline-none font-crimsonPro font-normal placeholder:text-[#777777] 
                ${errors.email ? "border border-red-500" : ""} 
                ${sent ? "opacity-70" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 absolute font-crimsonPro font-normal">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={isSubmitting || sent}
              className={`w-full md:w-64 mx-auto block py-3 text-white text-2xl font-normal rounded-xl transition font-crimsonPro ${
                isSubmitting || sent
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#0B3D0B] hover:bg-green-900"
              }`}
            >
              {isSubmitting
                ? "Sending..."
                : sent
                  ? "Reset link sent"
                  : "Send reset link"}
            </button>
          </div>

          {sent && (
            <p className="text-sm text-green-600 mt-6 text-center font-crimsonPro font-normal">
              Check your inbox and spam folder for the reset link.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
