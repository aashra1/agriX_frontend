"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, PlusCircle, ChevronRight } from "lucide-react";
import BusinessSidebar from "../../dashboard/_components/BusinessSidebar";
import BusinessHeader from "../../dashboard/_components/BusinessHeader";
import { getAllCategories } from "@/app/api/categories/route";
import { addProduct } from "@/app/api/product/route";

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

type Category = {
  _id: string;
  name: string;
  description?: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading: authLoading, businessId } = useAuth();
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

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

  useEffect(() => {
    console.log("Auth State - User:", user);
    console.log("Auth State - BusinessId:", businessId);
  }, [user, businessId]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);

      try {
        const response = await getAllCategories();
        console.log("Categories API response:", response);

        if (response.success && Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else if (Array.isArray(response)) {
          setCategories(response);
        } else if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Unexpected categories response format:", response);
          setCategories([]);
          setCategoriesError("Invalid categories data format");
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setCategoriesError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load categories",
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const hideSnackbar = useCallback(() => {
    const timer = setTimeout(() => {
      setSnackbar({ message: "", type: null });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (snackbar.type) hideSnackbar();
  }, [snackbar.type, hideSnackbar]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductImage(null);
    setProductImageFile(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSnackbar({ message: "", type: null });

    try {
      if (!formData.name?.trim()) {
        throw new Error("Product name is required");
      }
      if (!formData.category) {
        throw new Error("Category is required");
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("Valid price is required");
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        throw new Error("Valid stock quantity is required");
      }
      if (!formData.weight?.trim()) {
        throw new Error("Weight/Volume is required");
      }
      if (!formData.unitType) {
        throw new Error("Unit type is required");
      }
      if (!formData.shortDescription?.trim()) {
        throw new Error("Short description is required");
      }
      if (!formData.fullDescription?.trim()) {
        throw new Error("Full description is required");
      }

      if (!businessId) {
        console.error("No businessId found. User object:", user);
        throw new Error(
          "Business ID not found. Please ensure you have a business account. " +
            "Try logging out and logging back in.",
        );
      }

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand?.trim() || "");
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount || "0");
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("weight", formData.weight?.trim() || "");
      formDataToSend.append("unitType", formData.unitType);
      formDataToSend.append(
        "shortDescription",
        formData.shortDescription?.trim() || "",
      );
      formDataToSend.append(
        "fullDescription",
        formData.fullDescription?.trim() || "",
      );

      formDataToSend.append("business", businessId);

      if (productImageFile) {
        formDataToSend.append("image", productImageFile);
      }

      console.log("Sending FormData:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await addProduct(formDataToSend);

      console.log("Product added successfully:", response);

      setSnackbar({
        message: "Product added successfully! Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/business/products");
      }, 1500);
    } catch (error: any) {
      console.error("Submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add product";

      setSnackbar({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Snackbar = ({ message, type }: SnackbarState) => {
    if (!type) return null;
    const baseClasses =
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 font-crimsonPro text-sm";
    const colorClasses =
      type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";
    return <div className={`${baseClasses} ${colorClasses}`}>{message}</div>;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="relative">
          <div
            className="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent"
            style={{ borderColor: "#0B3D0B", borderTopColor: "transparent" }}
          ></div>
          <div className="absolute inset-0 rounded-full bg-green-100 opacity-20 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
        <BusinessSidebar />
        <main className="flex-1 overflow-x-hidden">
          <BusinessHeader showBackButton={true} backUrl="/business/products" />
          <div className="p-8 max-w-5xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                Business Account Required
              </h2>
              <p className="text-yellow-700 mb-4">
                You need a verified business account to add products.
              </p>
              <button
                onClick={() => router.push("/business/dashboard")}
                className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />

      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader
          showBackButton={true}
          backUrl="/business/products"
          searchPlaceholder="Search products..."
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
            <Link
              href="/business/products"
              className="text-gray-500 hover:text-green-800"
            >
              Products
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">Add Product</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Add your product
            </h1>
            <p className="text-gray-500 text-lg">
              Please enter all the details
            </p>
          </div>

          {snackbar.type === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{snackbar.message}</p>
            </div>
          )}

          {categoriesError && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                Warning: {categoriesError}. Please refresh the page.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Add Image
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    Image that best describes your product
                  </p>

                  {!productImage ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-800 transition-colors group">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-50 transition-colors">
                          <Upload
                            size={24}
                            className="text-gray-400 group-hover:text-green-800"
                          />
                        </div>
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm font-medium text-green-800 hover:underline">
                            Click to upload
                          </span>
                          <span className="text-sm text-gray-500">
                            {" "}
                            or drag and drop
                          </span>
                        </label>
                        <p className="text-xs text-gray-400 mt-2">
                          PNG, JPG up to 10MB
                        </p>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="aspect-square rounded-2xl overflow-hidden border border-gray-200">
                        <img
                          src={productImage}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={
                          isLoadingCategories || categories.length === 0
                        }
                      >
                        <option value="">
                          {isLoadingCategories
                            ? "Loading categories..."
                            : categories.length === 0
                              ? "No categories available"
                              : "Select category"}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {categories.length === 0 && !isLoadingCategories && (
                        <p className="text-xs text-red-500 mt-1">
                          No categories found. Please contact support.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Brand / Manufacturer{" "}
                        <span className="text-gray-400 text-xs">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand or manufacturer"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            NPR
                          </span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Discount{" "}
                          <span className="text-gray-400 text-xs">
                            (optional)
                          </span>
                        </label>
                        <div className="relative">
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            %
                          </span>
                          <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            max="100"
                            className="w-full px-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          placeholder="Enter stock quantity"
                          min="0"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Weight/Volume <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="e.g., 500g, 1kg, 2L"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Unit Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="unitType"
                        value={formData.unitType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                        required
                      >
                        <option value="">Select unit type</option>
                        <option value="Piece">Piece</option>
                        <option value="Kilogram">Kilogram (kg)</option>
                        <option value="Gram">Gram (g)</option>
                        <option value="Liter">Liter (L)</option>
                        <option value="Milliliter">Milliliter (mL)</option>
                        <option value="Box">Box</option>
                        <option value="Pack">Pack</option>
                        <option value="Bag">Bag</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Short Description{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        placeholder="Brief description of your product"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Detailed description of your product, including features, benefits, and specifications"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || categories.length === 0 || !businessId
                    }
                    className="px-8 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    style={{
                      transform: isSubmitting ? "scale(0.98)" : "scale(1)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={20} />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Snackbar message={snackbar.message} type={snackbar.type} />
    </div>
  );
}
