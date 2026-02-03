"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updateData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };

      const res = await fetch(`/api/user/profile?id=${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const result = await res.json();

        if (result.updatedUser) {
          setUser(result.updatedUser);
        }

        alert("Profile updated!");
        router.push("/profile");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading)
    return (
      <div className="p-20 text-center font-serif text-2xl">Loading...</div>
    );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white p-6 font-serif">
      <button
        onClick={() => router.back()}
        className="mb-8 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
      >
        <ArrowLeft size={28} />
      </button>

      <div className="flex flex-col items-center mb-10">
        <div className="relative w-36 h-36 bg-[#F1F9E9] rounded-full flex items-center justify-center">
          <div className="text-[#6B8E23]">
            <User size={80} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-2 right-2 bg-[#6B8E23] text-white rounded-full p-2 border-4 border-white shadow-sm">
            <Info size={20} />
          </div>
        </div>
        <h1 className="text-4xl font-bold mt-6 text-gray-900">
          Edit your details
        </h1>
        <p className="text-gray-500 text-xl mt-2 text-center">
          Enter your details to update your profile
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-800">
            <User size={26} />
          </span>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full bg-[#EFEFEF] border-none rounded-2xl py-6 pl-14 pr-4 text-2xl font-medium text-gray-800 focus:ring-2 focus:ring-emerald-900 outline-none transition-all"
            placeholder="Full Name"
          />
        </div>

        <div className="relative opacity-70">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-800">
            <Mail size={26} />
          </span>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full bg-[#EFEFEF] border-none rounded-2xl py-6 pl-14 pr-4 text-2xl text-gray-600 cursor-not-allowed"
            placeholder="Email Address"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-800">
            <Phone size={26} />
          </span>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full bg-[#EFEFEF] border-none rounded-2xl py-6 pl-14 pr-4 text-2xl font-medium text-gray-800 focus:ring-2 focus:ring-emerald-900 outline-none transition-all"
            placeholder="Phone Number"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-800">
            <MapPin size={26} />
          </span>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full bg-[#EFEFEF] border-none rounded-2xl py-6 pl-14 pr-4 text-2xl font-medium text-gray-800 focus:ring-2 focus:ring-emerald-900 outline-none transition-all"
            placeholder="Location"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-[#122A14] text-white py-6 rounded-2xl font-bold text-2xl mt-12 hover:bg-black transition-all active:scale-95 disabled:bg-gray-400 shadow-lg"
        >
          {updating ? "Saving Changes..." : "Save"}
        </button>
      </form>
    </div>
  );
}
function setUser(updatedUser: any) {
  throw new Error("Function not implemented.");
}
