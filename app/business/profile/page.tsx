"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Package,
  ChevronRight,
  Building2,
  Phone,
  MapPin,
  Mail,
  Shield,
  Edit,
  Save,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import BusinessSidebar from "../dashboard/_components/BusinessSidebar";
import BusinessHeader from "../dashboard/_components/BusinessHeader";
import {
  getBusinessProfile,
  updateBusinessProfile,
} from "@/app/api/business/profile/route";

type BusinessProfile = {
  _id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  businessVerified: boolean;
  businessStatus: "Approved" | "Pending" | "Rejected";
  profilePicture?: string;
  businessDocument?: string;
  createdAt: string;
  updatedAt: string;
};

type SnackbarState = {
  message: string;
  type: "success" | "error" | "info" | null;
};

export default function BusinessProfilePage() {
  const router = useRouter();
  const { businessId, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!businessId) {
        console.log("No businessId found");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getBusinessProfile();
        console.log("Profile API Response:", response);

        // FIX: Your backend returns the business object directly
        if (response && response._id) {
          const businessData = response;
          setProfile(businessData);

          setFormData({
            businessName: businessData.businessName || "",
            email: businessData.email || "",
            phoneNumber: businessData.phoneNumber || "",
            address: businessData.address || "",
          });

          if (businessData.profilePicture) {
            const fileName = businessData.profilePicture.split(/[\\/]/).pop();
            setPreviewUrl(`${baseUrl}/uploads/profile-images/${fileName}`);
          }
        } else {
          console.error("Invalid response structure:", response);
          setSnackbar({
            message: "Failed to load profile data",
            type: "error",
          });
        }
      } catch (error: any) {
        console.error("Fetch profile error:", error);
        setSnackbar({
          message: error.response?.data?.message || "Failed to load profile",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [businessId, baseUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value?.trim() !== "") {
          data.append(key, value);
        }
      });

      if (selectedFile) {
        data.append("profilePicture", selectedFile);
      }

      const result = await updateBusinessProfile(data);
      console.log("Update Response:", result);

      // Check your update response structure
      if (result) {
        setSnackbar({
          message: result.message || "Profile updated successfully!",
          type: "success",
        });
        setIsEditing(false);
        setSelectedFile(null);

        // Refresh profile data
        const refreshData = await getBusinessProfile();
        // FIX: Your backend returns the business object directly
        if (refreshData && refreshData._id) {
          setProfile(refreshData);
          setFormData({
            businessName: refreshData.businessName || "",
            email: refreshData.email || "",
            phoneNumber: refreshData.phoneNumber || "",
            address: refreshData.address || "",
          });

          if (refreshData.profilePicture) {
            const fileName = refreshData.profilePicture.split(/[\\/]/).pop();
            setPreviewUrl(`${baseUrl}/uploads/profile-images/${fileName}`);
          }
        }
      } else {
        setSnackbar({
          message: result?.message || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      setSnackbar({
        message:
          error.response?.data?.message || "An error occurred while updating",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSnackbar({ message: "", type: null }), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getStatusBadge = () => {
    const status = profile?.businessStatus || "Pending";
    const verified = profile?.businessVerified;

    if (status === "Approved" && verified) {
      return {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle size={14} className="text-green-600" />,
        text: "Verified Business",
      };
    } else if (status === "Pending") {
      return {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <AlertCircle size={14} className="text-yellow-600" />,
        text: "Pending Verification",
      };
    } else if (status === "Rejected") {
      return {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle size={14} className="text-red-600" />,
        text: "Verification Rejected",
      };
    }
    return {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: <Shield size={14} className="text-gray-600" />,
      text: "Business Account",
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
        <BusinessSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div
              className="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent"
              style={{ borderColor: "#0B3D0B", borderTopColor: "transparent" }}
            ></div>
            <div className="absolute inset-0 rounded-full bg-green-100 opacity-20 animate-ping"></div>
          </div>
        </main>
      </div>
    );
  }

  const statusBadge = getStatusBadge();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />
      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader
          showBackButton={true}
          backUrl="/business/dashboard"
          searchPlaceholder="Search products, orders..."
        />

        <div className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/business/dashboard"
              className="text-gray-500 hover:text-green-800"
            >
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">Business Profile</span>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  Business Profile
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusBadge.color}`}
                >
                  {statusBadge.icon}
                  {statusBadge.text}
                </span>
              </div>
              <p className="text-gray-500 text-lg">
                Manage your business information
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg"
              >
                <Edit size={20} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    if (profile) {
                      setFormData({
                        businessName: profile.businessName || "",
                        email: profile.email || "",
                        phoneNumber: profile.phoneNumber || "",
                        address: profile.address || "",
                      });
                      if (profile.profilePicture) {
                        const fileName = profile.profilePicture
                          .split(/[\\/]/)
                          .pop();
                        setPreviewUrl(
                          `${baseUrl}/uploads/profile-images/${fileName}`,
                        );
                      }
                    }
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={20} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sticky top-24">
                <div className="flex flex-col items-center text-center mb-6">
                  <div
                    className={`relative group ${isEditing ? "cursor-pointer" : ""}`}
                    onClick={() => isEditing && fileInputRef.current?.click()}
                  >
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-3 border-white shadow-xl mb-4">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={profile?.businessName}
                          className="w-full h-full object-cover"
                          onError={() => setPreviewUrl(null)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <Building2 size={48} className="text-green-800" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute bottom-4 right-1/2 translate-x-12 bg-green-800 text-white p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                        <Camera size={18} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile?.businessName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since{" "}
                    {profile?.createdAt ? formatDate(profile.createdAt) : "N/A"}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Verification Status
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge.color}`}
                      >
                        {profile?.businessStatus || "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Account Type
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Business
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Business ID</span>
                      <span className="text-sm font-mono text-gray-900">
                        {profile?._id?.slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-6 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/business/products/add-products"
                      className="flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Package size={18} className="text-green-800" />
                      <span>Add New Product</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 size={20} className="text-green-800" />
                  Business Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="Your business name"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profile?.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="business@example.com"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        {profile?.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="+977 98XXXXXXXX"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        {profile?.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/20"
                        placeholder="Your business address"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {profile?.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {profile?.businessDocument && (
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-green-800" />
                    Verification Document
                  </h2>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Business Registration Document
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded on{" "}
                        {profile.updatedAt
                          ? formatDate(profile.updatedAt)
                          : "N/A"}
                      </p>
                    </div>
                    <a
                      href={`${baseUrl}/${profile.businessDocument.replace(/^\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {snackbar.type && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 font-crimsonPro text-sm ${
            snackbar.type === "success"
              ? "bg-green-600 text-white"
              : snackbar.type === "error"
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
