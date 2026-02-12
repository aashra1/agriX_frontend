"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFields, LoginSchema } from "../authSchema";
import { handleLogin } from "@/lib/actions/auth-actions";

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(LoginSchema),
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

  const onSubmit = async (data: LoginFields) => {
    setError(null);
    setSnackbar({ message: "", type: null });

    try {
      const res = await handleLogin(data);

      if (!res.success) {
        setError(res.message || "Login Failed");
        setSnackbar({ message: res.message || "Login Failed", type: "error" });
        return;
      }

      setSnackbar({
        message: "Login successful! Redirecting...",
        type: "success",
      });

      startTransition(() => {
        setTimeout(() => {
          const userRole = res.user?.role?.toLowerCase();

          if (userRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/auth/dashboard");
          }
        }, 1500);
      });
    } catch (err: any) {
      setSnackbar({
        message: "A network error occurred.",
        type: "error",
      });
    }
  };

  const InputField = ({
    name,
    label,
    icon,
    error,
  }: {
    name: keyof LoginFields;
    label: string;
    icon: string;
    error: string | undefined;
  }) => (
    <div className="mb-6">
      <div
        className={`flex items-center rounded-xl bg-gray-200/45 px-4 ${
          error ? "border border-red-500" : ""
        }`}
      >
        <Image
          src={icon}
          alt=""
          width={20}
          height={20}
          className="brightness-0"
        />
        <input
          {...register(name)}
          type="text"
          placeholder={label}
          className="w-full py-3 px-3 bg-transparent text-lg placeholder:text-[#777777] focus:outline-none font-crimsonPro font-normal"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-crimsonPro font-normal">
          {error}
        </p>
      )}
    </div>
  );

  const PasswordField = ({
    name,
    label,
    error,
  }: {
    name: keyof LoginFields;
    label: string;
    error: string | undefined;
  }) => (
    <div className="mb-6">
      <div
        className={`flex items-center rounded-xl bg-gray-200/45 px-4 relative ${
          error ? "border border-red-500" : ""
        }`}
      >
        <Image
          src="/icons/password.png"
          alt=""
          width={20}
          height={20}
          className="brightness-0"
        />
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={label}
          className="w-full py-3 px-3 bg-transparent text-lg placeholder:text-[#777777] focus:outline-none font-crimsonPro font-normal"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 opacity-40 hover:opacity-100 transition-opacity"
        >
          <Image
            src={showPassword ? "/icons/view.png" : "/icons/hide.png"}
            alt="Toggle visibility"
            width={20}
            height={20}
            className="brightness-0"
          />
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-crimsonPro font-normal">
          {error}
        </p>
      )}
    </div>
  );

  const Snackbar = ({ message, type }: SnackbarState) => {
    if (!type) return null;
    const baseClasses =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 font-crimsonPro font-medium";
    const colorClasses =
      type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";
    return <div className={`${baseClasses} ${colorClasses}`}>{message}</div>;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto p-6 md:p-8 pt-0"
      >
        <h1 className="text-4xl md:text-5xl font-semibold text-center font-crimsonPro">
          Customer Login
        </h1>
        <p className="text-xl text-[#777777] font-normal text-center mb-10 font-crimsonPro">
          Enter your personal details
        </p>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center font-crimsonPro font-normal">
            {error}
          </div>
        )}

        <InputField
          name="email"
          label="Email"
          icon="/icons/email.png"
          error={errors.email?.message}
        />

        <PasswordField
          name="password"
          label="Password"
          error={errors.password?.message}
        />

        <div className="text-right mb-8">
          <Link
            href="/request-password-reset"
            className="text-red-600 text-base font-crimsonPro font-normal hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full md:w-64 mx-auto block py-3 text-white text-2xl font-normal rounded-xl transition font-crimsonPro ${
            isPending
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#0B3D0B] hover:bg-green-900"
          }`}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-center mt-6 text-lg font-crimsonPro">
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
      </form>

      <Snackbar message={snackbar.message} type={snackbar.type} />
    </>
  );
};
