"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginFields, LoginSchema } from "../authSchema";
import { handleLogin } from "@/lib/actions/auth-actions";

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    setError("");
    try {
      const res = await handleLogin(data);
      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      //   await checkAuth();
      // handle transition
      startTransition(() => {
        router.push("/auth/dashboard");
      });
    } catch (err: any) {
      setError(err.message || "Login Failed");
    }
  };

  const InputField = ({
    name,
    label,
    type = "text",
    iconPath,
    error,
  }: {
    name: keyof LoginFields;
    label: string;
    type?: string;
    iconPath: string;
    error?: string;
  }) => (
    <div className="mb-6">
      <div
        className={`flex items-center rounded-xl bg-gray-200/45 ${error ? "border border-red-500" : ""}`}
      >
        <div className="p-3">
          <img src={iconPath} alt={label} className="w-6 h-6 object-contain" />
        </div>
        <input
          {...register(name)}
          type={type}
          placeholder={label}
          className="w-full py-3 pr-5 bg-transparent text-lg placeholder:text-[#777777] focus:outline-none font-crimsonPro font-normal"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-crimsonPro font-normal">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto p-6 md:p-8"
      >
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo-2.png"
            alt="Agrix Logo"
            width={80}
            height={80}
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold text-center font-crimsonPro">
          Welcome Back
        </h1>
        <p className="text-xl text-[#777777] font-normal text-center mb-10 font-crimsonPro">
          Please enter your details
        </p>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center font-crimsonPro font-normal">
            {error}
          </div>
        )}

        <InputField
          name="email"
          label="email"
          iconPath="/icons/user.png"
          error={errors.email?.message}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          iconPath="/icons/password.png"
          error={errors.password?.message}
        />

        <div className="text-right mb-8">
          <Link
            href="#"
            className="text-red-600 text-base font-crimsonPro font-normal hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full md:w-64 mx-auto block py-3 text-white text-2xl font-normal rounded-xl transition font-crimsonPro ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#0B3D0B] hover:bg-green-900"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
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
    </div>
  );
};
