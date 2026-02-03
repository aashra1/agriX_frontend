"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { RegisterFields, RegisterSchema } from "../authSchema";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { handleRegister } from "@/lib/actions/auth-actions";

type SnackbarState = { message: string; type: "success" | "error" | null };

const Snackbar = ({ message, type }: SnackbarState) => {
  if (!type) return null;
  const baseClasses =
    "fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 font-crimsonpro font-medium";
  const colorClasses =
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";
  return <div className={`${baseClasses} ${colorClasses}`}>{message}</div>;
};

export const CustomerRegisterForm = ({
  setRole,
}: {
  setRole: (role: "initial") => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(RegisterSchema),
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

  const onSubmit = async (data: RegisterFields) => {
    setError(null);
    setSnackbar({ message: "", type: null });
    setIsLoading(true);

    try {
      // Using the server action just like handleLogin
      const res = await handleRegister(data);

      if (!res.success) {
        setError(res.message);
        setIsLoading(false);
        return;
      }

      setSnackbar({
        message: "Customer registration successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: any) {
      setSnackbar({
        message: err.message || "An unexpected error occurred",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const fieldsConfig: {
    name: keyof RegisterFields;
    label: string;
    type?: string;
    iconPath: string;
  }[] = [
    {
      name: "fullName",
      label: "Full Name",
      iconPath: "/icons/user.png",
    },

    {
      name: "email",
      label: "Email",
      type: "email",
      iconPath: "/icons/email.png",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      iconPath: "/icons/phone.png",
    },
  ];

  const InputField = ({
    name,
    label,
    type = "text",
    iconPath,
    error,
    isPassword,
    show,
    toggleShow,
  }: {
    name: keyof RegisterFields;
    label: string;
    type?: string;
    iconPath: string;
    error: string | undefined;
    isPassword?: boolean;
    show?: boolean;
    toggleShow?: () => void;
  }) => (
    <div className="mb-4 relative">
      <div
        className={`flex items-center rounded-xl bg-gray-200/45 ${error ? "border border-red-500" : ""}`}
      >
        <div className="p-3">
          <img src={iconPath} alt={label} className="w-6 h-6 object-contain" />
        </div>
        <input
          {...register(name)}
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={label}
          className="w-full py-3 pr-10 bg-transparent text-lg placeholder:text-[#777777] focus:outline-none font-crimsonpro font-normal"
        />
        {isPassword && toggleShow && (
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {show ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 font-crimsonpro font-normal">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto p-6 md:p-8 pt-0"
      >
        <h1 className="text-4xl md:text-5xl font-semibold text-center font-crimsonpro whitespace-nowrap">
          Register as Customer
        </h1>
        <p className="text-xl text-[#777777] font-normal text-center mb-8 font-crimsonpro">
          Please enter your details
        </p>

        <button
          type="button"
          onClick={() => setRole("initial")}
          className="text-gray-500 text-sm font-medium mb-4 hover:underline flex items-center"
        >
          &larr; Back to Role Selection
        </button>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center font-normal font-crimsonpro">
            {error}
          </div>
        )}

        {fieldsConfig.map((field) => (
          <InputField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            iconPath={field.iconPath}
            error={errors[field.name]?.message}
          />
        ))}

        {/* Password */}
        <InputField
          name="password"
          label="Password"
          iconPath="/icons/password.png"
          error={errors.password?.message}
          isPassword
          show={showPassword}
          toggleShow={() => setShowPassword(!showPassword)}
        />

        {/* Optional Location */}
        <InputField
          name="address"
          label="Address (Optional)"
          iconPath="/icons/address.png"
          error={errors.address?.message}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full md:w-64 mx-auto block mt-6 py-3 text-white text-2xl font-normal rounded-xl transition font-crimsonpro ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#0B3D0B] hover:bg-green-900"
          }`}
        >
          {isLoading ? "Registering..." : "Signup as Customer"}
        </button>

        <div className="flex justify-center mt-6 text-lg font-crimsonpro">
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
      </form>

      <Snackbar message={snackbar.message} type={snackbar.type} />
    </>
  );
};
