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
  User,
  Calendar,
  Lock,
} from "lucide-react";

import { getBusinessProfile, updateBusinessProfile } from "@/lib/api/business";
import BusinessSidebar from "../_components/BusinessSidebar";
import BusinessHeader from "../_components/BusinessHeader";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
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
      setImageError(false);
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

      if (result) {
        setSnackbar({
          message: result.message || "Profile updated successfully!",
          type: "success",
        });
        setIsEditing(false);
        setSelectedFile(null);

        const refreshData = await getBusinessProfile();
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
    setIsLoggingOut(true);
    await logout();
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

  const accountLinks = [
    {
      href: "/business/products/add-products",
      icon: Package,
      label: "Add New Product",
      description: "List a new product in your store",
    },
    {
      href: "/business/products",
      icon: Package,
      label: "Manage Products",
      description: "View and edit your products",
    },
    {
      href: "/business/orders",
      icon: Package,
      label: "View Orders",
      description: "Track and manage customer orders",
    },
  ];

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

        <div className="p-8 max-w-7xl mx-auto">
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

          {/* Profile Header - Same as User Profile */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden border-4 border-white shadow-lg ${isEditing ? "cursor-pointer" : ""}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  {previewUrl && !imageError ? (
                    <img
                      src={previewUrl}
                      alt={profile?.businessName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-emerald-700">
                      <Building2 size={48} className="text-white" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors shadow-md flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={16} />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {profile?.businessName || "Business Name"}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusBadge.color}`}
                  >
                    {statusBadge.icon}
                    {statusBadge.text}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail size={16} className="text-green-700" />
                    {profile?.email || "email@example.com"}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <Phone size={16} className="text-green-700" />
                    {profile?.phoneNumber || "Not provided"}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <MapPin size={16} className="text-green-700" />
                    {profile?.address || "Not provided"}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} className="text-green-700" />
                    Member since{" "}
                    {profile?.createdAt
                      ? formatDate(profile.createdAt)
                      : "2025"}
                  </span>
                </div>
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business Stats - Similar to order stats in user profile */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-green-800 to-emerald-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Business Settings
                </h2>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 size={20} className="text-green-800" />
                  Business Information
                </h3>

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

            {/* Right Column - Quick Actions & Security */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-emerald-800" size={24} />
                  <h3 className="font-bold text-gray-900">Account Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Business ID</span>
                    <span className="font-mono text-gray-900">
                      {profile?._id?.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Verification</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge.color}`}
                    >
                      {profile?.businessStatus || "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Account Type</span>
                    <span className="text-gray-900 font-medium">Business</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {accountLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      className="flex items-center justify-between p-4 hover:bg-green-50/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <Icon
                            size={20}
                            className="text-gray-700 group-hover:text-green-800"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-green-800">
                            {link.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-green-800 group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      {isLoggingOut ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <LogOut size={20} className="text-red-600" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-red-600">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-red-600"
                  />
                </button>
              </div>
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
