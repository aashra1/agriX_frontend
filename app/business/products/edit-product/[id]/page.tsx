"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Upload,
  X,
  PlusCircle,
  ChevronRight,
  Save,
  Camera,
} from "lucide-react";
import BusinessSidebar from "../../../dashboard/_components/BusinessSidebar";
import BusinessHeader from "../../../dashboard/_components/BusinessHeader";
import { getAllCategories } from "@/app/api/categories/route";

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

type Category = {
  _id: string;
  name: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading: authLoading, businessId } = useAuth();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    weight: "",
    unitType: "",
    shortDescription: "",
    fullDescription: "",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [catRes, prodRes] = await Promise.all([
          getAllCategories(),
          fetch(`/api/product/${id}`).then((res) => res.json()),
        ]);

        if (catRes.success) setCategories(catRes.categories);
        else if (Array.isArray(catRes)) setCategories(catRes);

        const p = prodRes.product || prodRes.data || prodRes;
        if (p) {
          setFormData({
            name: p.name || "",
            category: p.category?._id || p.category || "",
            brand: p.brand || "",
            price: p.price?.toString() || "",
            discount: p.discount?.toString() || "0",
            stock: p.stock?.toString() || "",
            weight: p.weight || "",
            unitType: p.unitType || "",
            shortDescription: p.shortDescription || "",
            fullDescription: p.fullDescription || "",
          });

          if (p.image) {
            const fileName = p.image.split(/[\\/]/).pop();
            if (fileName) {
              setPreviewUrl(`${baseUrl}/uploads/product-images/${fileName}`);
            }
          }
        }
      } catch (error) {
        setSnackbar({ message: "Failed to load details", type: "error" });
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchData();
  }, [id, baseUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value),
      );
      data.append("business", businessId || "");

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        setSnackbar({
          message: "Product updated successfully!",
          type: "success",
        });
        setTimeout(() => router.push("/business/products"), 1500);
      } else {
        const errorData = await res.json();
        setSnackbar({
          message: errorData.message || "Update failed",
          type: "error",
        });
      }
    } catch (err) {
      setSnackbar({ message: "An error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-green-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader showBackButton={true} backUrl="/business/products" />

        <div className="p-8 max-w-5xl mx-auto">
          {/* Breadcrumb - UI Exact Match */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/business/dashboard"
              className="text-gray-500 hover:text-green-800"
            >
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link
              href="/business/products"
              className="text-gray-500 hover:text-green-800"
            >
              Products
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">Edit Product</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Edit product
            </h1>
            <p className="text-gray-500 text-lg">Modify your product details</p>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Image (Mirroring your Profile Edit style) */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Product Image
                  </h2>
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 group-hover:border-green-800 transition-all">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload size={40} className="text-gray-400" />
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-800 text-white p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                      <Camera size={18} />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Right Column - Same Fields from Add Product */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800/10"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Price (NPR) *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={formData.discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Stock *
                        </label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Weight/Volume *
                        </label>
                        <input
                          type="text"
                          value={formData.weight}
                          onChange={(e) =>
                            setFormData({ ...formData, weight: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Description *
                      </label>
                      <textarea
                        value={formData.fullDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullDescription: e.target.value,
                          })
                        }
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:bg-gray-400"
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
              </div>
            </div>
          </form>
        </div>
      </main>

      {snackbar.type && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 font-crimsonPro text-sm ${snackbar.type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
