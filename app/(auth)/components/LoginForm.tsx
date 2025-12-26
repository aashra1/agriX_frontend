'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFields, LoginSchema, RegisterSchema } from "@/app/(auth)/authSchemas";
import Link from 'next/link';
import { useState } from 'react';

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        setError(result.message || 'Login failed. Please check your credentials.');
        return;
      }

      localStorage.setItem('agrix_token', result.token);
      window.location.href = '/auth/dashboard';

    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const InputField = ({ name, label, type = 'text', iconPath, error }: {
    name: keyof LoginFields;
    label: string;
    type?: string;
    iconPath: string;
    error: string | undefined;
  }) => (
    <div className="mb-6">
      <div className={`flex items-center rounded-xl bg-gray-200/45 ${error ? 'border border-red-500' : ''}`}>
        <div className="p-3">
          <img src={iconPath} alt={label} className="w-6 h-6 object-contain" />
        </div>
        <input
          {...register(name)}
          type={type}
          placeholder={label}
          className="w-full py-3 pr-5 bg-transparent text-lg placeholder:text-[#777777] focus:outline-none"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto p-6 md:p-8">
      <div className="flex justify-center mb-8">
        <img src="/images/logo-2.png" alt="Agrix Logo" className="w-20 h-auto" />
      </div>

      <h1 className="text-4xl md:text-5xl font-semibold text-center font-crimsonPro">Welcome Back</h1>
      <p className="text-xl text-[#777777] font-normal text-center mb-10 font-crimsonPro">
        Please enter your details
      </p>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center font-crimsonPro">
          {error}
        </div>
      )}

      <InputField
        name="username"
        label="Username"
        iconPath="/icons/user.png"
        error={errors.username?.message}
      />

      <InputField
        name="password"
        label="Password"
        type="password"
        iconPath="/icons/password.png"
        error={errors.password?.message}
      />

      <div className="text-right mb-8">
        <Link href="#" className="text-red-600 text-base font-crimsonPro hover:underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full md:w-64 mx-auto block py-3 text-white text-2xl font-semibold rounded-xl transition font-crimsonPro ${
          isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#0B3D0B] hover:bg-green-900'
        }`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div className="flex justify-center mt-6 text-lg font-crimsonPro">
        <span className="text-gray-500">Don't have an account?</span>
        <Link href="/signup" className="text-red-600 font-semibold ml-2 hover:underline">
          Signup!
        </Link>
      </div>
    </form>
  );
};