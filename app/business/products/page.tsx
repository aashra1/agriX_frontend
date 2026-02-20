"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  PlusCircle,
  ChevronRight,
  Search,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import BusinessSidebar from "../_components/BusinessSidebar";
import BusinessHeader from "../_components/BusinessHeader";
import {
  handleGetBusinessProducts,
  handleDeleteProduct,
} from "@/lib/actions/product-actions";

type Product = {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  brand?: string;
  price: number;
  discount: number;
  stock: number;
  weight: string;
  unitType: string;
  shortDescription: string;
  image?: string;
  createdAt: string;
  business: string;
};

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

export default function BusinessProductsPage() {
  const router = useRouter();
  const { businessId, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!businessId) return;

      setIsLoading(true);
      try {
        const result = await handleGetBusinessProducts();

        if (result.success && result.products) {
          setProducts(result.products);
          setFilteredProducts(result.products);
        } else {
          setProducts([]);
          setFilteredProducts([]);
          if (result.message) {
            setSnackbar({
              message: result.message,
              type: "error",
            });
          }
        }
      } catch (error: any) {
        setSnackbar({
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to load products",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId) {
      fetchProducts();
    }
  }, [businessId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category?.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleDelete = async (productId: string) => {
    try {
      const result = await handleDeleteProduct(productId);

      if (result.success) {
        setProducts(products.filter((p) => p._id !== productId));
        setFilteredProducts(
          filteredProducts.filter((p) => p._id !== productId),
        );
        setSnackbar({
          message: "Product deleted successfully!",
          type: "success",
        });
        setTimeout(() => setSnackbar({ message: "", type: null }), 3000);
      } else {
        setSnackbar({
          message: result.message || "Failed to delete product",
          type: "error",
        });
      }
      setDeleteConfirm(null);
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data?.message || "Failed to delete product",
        type: "error",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const Snackbar = ({ message, type }: SnackbarState) => {
    if (!type || !message) return null;
    return (
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-crimsonPro text-sm ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
      >
        {message}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-green-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <BusinessSidebar />
      <main className="flex-1 overflow-x-hidden">
        <BusinessHeader
          showBackButton={false}
          searchPlaceholder="Search products..."
        />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Link
                  href="/business/dashboard"
                  className="text-gray-500 hover:text-green-800"
                >
                  Dashboard
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-green-800 font-medium">Products</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">My Products</h1>
            </div>
            <button
              onClick={() => router.push("/business/products/add-products")}
              className="px-6 py-3 bg-[#0B3D0B] hover:bg-green-900 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <PlusCircle size={20} /> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-800">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {products.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Stock</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {products.reduce((acc, p) => acc + p.stock, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-800">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {products.filter((p) => p.stock < 10).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 rounded-xl shadow-sm focus:ring-2 focus:ring-green-800/10 outline-none border-none"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-green-900 border-t-transparent"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white/90 rounded-2xl p-12 text-center shadow-sm">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700">
                No products found
              </h3>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const fileName = product.image
                        ? product.image.split(/[\\/]/).pop()
                        : null;
                      const productImageUrl = fileName
                        ? `${baseUrl}/uploads/product-images/${fileName}`
                        : null;

                      return (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {productImageUrl ? (
                                  <img
                                    src={productImageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "";
                                    }}
                                  />
                                ) : (
                                  <Package
                                    size={24}
                                    className="text-gray-400"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.brand || "No brand"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-50 text-green-800 text-xs font-medium rounded-full">
                              {product.category?.name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatCurrency(product.price)}
                              </p>
                              {product.discount > 0 && (
                                <p className="text-xs text-green-600">
                                  {product.discount}% off
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p
                                className={`font-medium ${product.stock < 10 ? "text-red-600" : "text-green-600"}`}
                              >
                                {product.stock} units
                              </p>
                              {(product.weight || product.unitType) && (
                                <p className="text-xs text-gray-500">
                                  {product.weight} {product.unitType} per unit
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${product.stock > 0 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                            >
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/business/products/edit-product/${product._id}`,
                                  )
                                }
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(product._id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar message={snackbar.message} type={snackbar.type} />
    </div>
  );
}
