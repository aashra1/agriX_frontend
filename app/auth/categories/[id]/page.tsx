"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  Filter,
  Grid3x3,
  List,
  Star,
  ShoppingCart,
  Heart,
  Sparkles,
  Package,
} from "lucide-react";
import UserSidebar from "../../_components/UserSidebar";
import UserHeader from "../../_components/UserHeader";
import { handleGetCategoryById } from "@/lib/actions/category-actions";
import { handleGetProductsByCategory } from "@/lib/actions/product-actions";
import { handleAddToCart } from "@/lib/actions/cart-actions";
import { Category } from "@/lib/api/category";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  image?: string;
  rating?: number;
  sold?: number;
  stock: number;
  brand?: string;
  weight?: string;
  unitType?: string;
};

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({
    message: "",
    type: null,
  });
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  const categoryIcons: { [key: string]: string } = {
    "Seeds & Plants": "/icons/seeds.png",
    "Fertilizers & Soil Care": "/icons/fertilizer.png",
    Irrigation: "/icons/water-system.png",
    Pesticides: "/icons/pesticide.png",
    "Animal & Livestock Products": "/icons/sheep.png",
    "Machinery & Equipments": "/icons/tractor.png",
    default: "/icons/category.png",
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(() => {
        setSnackbar({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  const getProductImageUrl = (product: Product) => {
    if (product.image) {
      const fileName = product.image.split(/[\\/]/).pop();
      return `${baseUrl}/uploads/product-images/${fileName}`;
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoryResult = await handleGetCategoryById(categoryId);

        if (!categoryResult.success) {
          setError(categoryResult.message || "Failed to load category");
          return;
        }

        setCategory(categoryResult.data as Category);

        const productsResult = await handleGetProductsByCategory(categoryId);

        if (productsResult.success) {
          setProducts(productsResult.products || []);
        } else {
          setError(productsResult.message || "Failed to load products");
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  const handleAddToCartClick = async (
    e: React.MouseEvent,
    productId: string,
    quantity: number = 1,
  ) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setAddingToCart((prev) => new Set(prev).add(productId));

    try {
      const result = await handleAddToCart({
        productId,
        quantity,
      });

      if (result.success) {
        setSnackbar({
          message: "Item added to cart successfully!",
          type: "success",
        });
      } else {
        setSnackbar({
          message: result.message || "Failed to add to cart",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      setSnackbar({
        message: error.message || "Failed to add to cart",
        type: "error",
      });
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount || discount <= 0) return price;
    return price - (price * discount) / 100;
  };

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "newest":
        return [...products];
      case "rating":
        return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "popular":
      default:
        return [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }
  };

  const sortedProducts = sortProducts(products);

  const Snackbar = () => {
    if (!snackbar.type) return null;
    return (
      <div
        className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 transform animate-slide-up ${
          snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
        } text-white`}
      >
        {snackbar.message}
      </div>
    );
  };

  if (loading) {
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

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Category not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <UserSidebar activePage="Home" />

      <main className="flex-1 overflow-x-hidden">
        <UserHeader />

        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/auth/dashboard"
              className="text-gray-500 hover:text-green-800"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link
              href="/auth/categories"
              className="text-gray-500 hover:text-green-800"
            >
              Categories
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">{category.name}</span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#0B3D0B15" }}
              >
                <Image
                  src={categoryIcons[category.name] || categoryIcons.default}
                  width={48}
                  height={48}
                  alt={category.name}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                <p className="text-gray-600 text-lg max-w-3xl">
                  {category.description}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Sparkles size={16} className="text-green-600" />
                    <span>{products.length} Products Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-green-800 transition-colors"
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-800 text-white"
                      : "text-gray-500 hover:text-green-800"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-green-800 text-white"
                      : "text-gray-500 hover:text-green-800"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-800"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6">
                There are no products in this category yet.
              </p>
              <Link
                href="/auth/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
              >
                <ArrowLeft size={18} />
                Browse Other Categories
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedProducts.map((product, index) => {
                const productImageUrl = getProductImageUrl(product);
                const isAdding = addingToCart.has(product._id);

                return (
                  <Link
                    key={product._id}
                    href={`/auth/products/${product._id}`}
                    className="group bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards`,
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {productImageUrl ? (
                        <img
                          src={productImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder-product.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package size={48} className="text-gray-400" />
                        </div>
                      )}
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <Heart
                          size={16}
                          className="text-gray-600 hover:text-red-500"
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                        {product.brand || "Generic"} •{" "}
                        {product.weight || "Standard"}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= (product.rating || 0)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.sold || 0} sold)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount && product.discount > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-800">
                                {formatCurrency(
                                  getDiscountedPrice(
                                    product.price,
                                    product.discount,
                                  ),
                                )}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-green-800">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCartClick(e, product._id)}
                          disabled={isAdding}
                          className="w-8 h-8 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAdding ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => {
                const productImageUrl = getProductImageUrl(product);
                const isAdding = addingToCart.has(product._id);

                return (
                  <Link
                    key={product._id}
                    href={`/auth/products/${product._id}`}
                    className="flex bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative w-48 h-48 overflow-hidden">
                      {productImageUrl ? (
                        <img
                          src={productImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder-product.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package size={48} className="text-gray-400" />
                        </div>
                      )}
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= (product.rating || 0)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">
                            ({product.sold || 0} sold)
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock} units
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount && product.discount > 0 ? (
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-green-800">
                                {formatCurrency(
                                  getDiscountedPrice(
                                    product.price,
                                    product.discount,
                                  ),
                                )}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-green-800">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCartClick(e, product._id)}
                          disabled={isAdding}
                          className="px-6 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAdding ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={18} />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Snackbar />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
