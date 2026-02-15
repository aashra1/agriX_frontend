"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API } from "@/lib/api/endpoints";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

type ChangePasswordDTO = z.infer<typeof ChangePasswordSchema>;

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

export default function ChangePassword() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordDTO>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const hideSnackbar = useCallback(() => {
    const timer = setTimeout(() => {
      setSnackbar({ message: "", type: null });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (snackbar.type) hideSnackbar();
  }, [snackbar.type, hideSnackbar]);

  const onSubmit = async (data: ChangePasswordDTO) => {
    setSnackbar({ message: "", type: null });

    try {
      const res = await fetch(API.USER.CHANGE_PASSWORD, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSnackbar({
          message: json.message || "Failed to change password",
          type: "error",
        });
        return;
      }

      setSnackbar({
        message: "Password changed successfully! Redirecting...",
        type: "success",
      });

      startTransition(() => {
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      });
    } catch (err) {
      setSnackbar({
        message: "A network error occurred.",
        type: "error",
      });
    }
  };

  const Snackbar = ({ message, type }: SnackbarState) => {
    if (!type) return null;
    const baseClasses =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 font-crimsonPro font-medium";
    const colorClasses =
      type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";
    return <div className={`${baseClasses} ${colorClasses}`}>{message}</div>;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-serif relative">
      <button
        onClick={() => router.back()}
        className="absolute left-8 top-8 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
      >
        <Image
          src="/icons/to-right.png"
          alt="Back"
          width={20}
          height={20}
          className="rotate-180 brightness-0"
        />
      </button>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="bg-[#F1F9E9] w-32 h-32 rounded-full flex items-center justify-center mt-12 mb-8">
          <div className="relative">
            <Image
              src="/icons/password.png"
              alt="Lock"
              width={70}
              height={70}
              className="opacity-100 brightness-0"
            />
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-3 text-center font-crimsonPro">
          Change Password
        </h1>
        <p className="text-[#666666] text-center text-sm leading-relaxed mb-8 px-8 font-crimsonPro">
          Enter your current password and choose a new secure password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Current Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/password.png"
                alt="Lock"
                width={20}
                height={20}
                className="brightness-0"
              />
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current Password"
              {...register("currentPassword")}
              className={`w-full bg-[#F2F2F2] py-4 pl-12 pr-12 rounded-xl text-gray-700 focus:outline-none font-crimsonPro ${
                errors.currentPassword ? "border border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
            >
              <Image
                src={
                  showCurrentPassword ? "/icons/view.png" : "/icons/hide.png"
                }
                alt="Toggle"
                width={20}
                height={20}
                className="brightness-0"
              />
            </button>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1 absolute font-crimsonPro">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative pt-2">
            <div className="absolute left-4 top-[60%] -translate-y-1/2">
              <Image
                src="/icons/password.png"
                alt="Lock"
                width={20}
                height={20}
                className="brightness-0"
              />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword")}
              className={`w-full bg-[#F2F2F2] py-4 pl-12 pr-12 rounded-xl text-gray-700 focus:outline-none font-crimsonPro ${
                errors.newPassword ? "border border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-[60%] -translate-y-1/2 opacity-60 hover:opacity-100"
            >
              <Image
                src={showNewPassword ? "/icons/view.png" : "/icons/hide.png"}
                alt="Toggle"
                width={20}
                height={20}
                className="brightness-0"
              />
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1 absolute font-crimsonPro">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative pt-2">
            <div className="absolute left-4 top-[60%] -translate-y-1/2">
              <Image
                src="/icons/password.png"
                alt="Lock"
                width={20}
                height={20}
                className="brightness-0"
              />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`w-full bg-[#F2F2F2] py-4 pl-12 pr-12 rounded-xl text-gray-700 focus:outline-none font-crimsonPro ${
                errors.confirmPassword ? "border border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[60%] -translate-y-1/2 opacity-60 hover:opacity-100"
            >
              <Image
                src={
                  showConfirmPassword ? "/icons/view.png" : "/icons/hide.png"
                }
                alt="Toggle"
                width={20}
                height={20}
                className="brightness-0"
              />
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 absolute font-crimsonPro">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-8 flex flex-col items-center">
            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-[#0B3D0B] hover:bg-green-900 text-white font-medium py-3 rounded-xl transition font-crimsonPro text-xl ${
                isPending ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      <Snackbar message={snackbar.message} type={snackbar.type} />
    </div>
  );
}
