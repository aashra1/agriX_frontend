'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { RegisterFields, RegisterSchema } from '../authSchemas';

export const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    setError(null);
    setIsLoading(true);

    try {
      const { confirmPassword, ...payload } = data;

      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, confirmPassword }), 
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        setError(result.message || result.errors[0]?.message || 'Registration failed.');
        return;
      }

      window.location.href = '/login';

    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldsConfig: {
    name: keyof RegisterFields;
    label: string;
    type?: string;
    iconPath: string;
  }[] = [
    { name: 'fullName', label: 'Full Name', iconPath: '/icons/user.png' },
    { name: 'username', label: 'Username', iconPath: '/icons/user.png' },
    { name: 'email', label: 'Email', type: 'email', iconPath: '/icons/email.png' },
    { name: 'phoneNumber', label: 'Phone Number', iconPath: '/icons/phone.png' },
    { name: 'password', label: 'Password', type: 'password', iconPath: '/icons/password.png' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', iconPath: '/icons/password.png' },
    { name: 'location', label: 'Address (Optional)', iconPath: '/icons/address.png' },
  ];

  const InputField = ({ name, label, type = 'text', iconPath, error }: {
    name: keyof RegisterFields;
    label: string;
    type?: string;
    iconPath: string;
    error: string | undefined;
  }) => (
    <div className="mb-4">
      <div className={`flex items-center rounded-xl bg-gray-200/45 ${error ? 'border border-red-500' : ''}`}>
        <div className="p-3">
          <img src={iconPath} alt={label} className="w-6 h-6 object-contain" />
        </div>
        <input
          {...register(name as any)}
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

      <h1 className="text-4xl md:text-5xl font-semibold text-center font-crimsonPro">Create your Account</h1>
      <p className="text-xl text-[#777777] font-normal text-center mb-8 font-crimsonPro">
        Please enter your details
      </p>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-center font-crimsonPro">
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

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full md:w-64 mx-auto block mt-6 py-3 text-white text-2xl font-semibold rounded-xl transition font-crimsonPro ${
          isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#0B3D0B] hover:bg-green-900'
        }`}
      >
        {isLoading ? 'Registering...' : 'Signup'}
      </button>

      <div className="flex justify-center mt-6 text-lg font-crimsonPro">
        <span className="text-gray-500">Already have an account?</span>
        <Link href="/login" className="text-red-600 font-semibold ml-2 hover:underline">
          Login!
        </Link>
      </div>
    </form>
  );
};