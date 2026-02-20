"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Sparkles,
  Package,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Check,
  Clock,
} from "lucide-react";
import UserSidebar from "../../_components/UserSidebar";
import UserHeader from "../../_components/UserHeader";
import {
  handleGetProductById,
  handleGetProductsByCategory,
} from "@/lib/actions/product-actions";
import { handleAddToCart } from "@/lib/actions/cart-actions";

type Product = {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  discount?: number;
  image?: string;
  images?: string[];
  rating?: number;
  sold?: number;
  stock: number;
  brand?: string;
  category?: {
    _id: string;
    name: string;
  };
  weight?: string;
  unitType?: string;
  business?: {
    _id: string;
    businessName: string;
    logo?: string;
  };
  createdAt?: string;
};

type RelatedProduct = {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  image?: string;
  rating?: number;
  sold?: number;
};

type TabType = "description" | "specifications" | "reviews";

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  const getProductImageUrl = (product: Product | RelatedProduct) => {
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

  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount || discount <= 0) return price;
    return price - (price * discount) / 100;
  };

  const getSavings = (price: number, discount?: number) => {
    if (!discount || discount <= 0) return 0;
    return (price * discount) / 100;
  };

  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(() => {
        setSnackbar({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const productResult = await handleGetProductById(productId);

        if (!productResult.success) {
          setError(productResult.message || "Failed to load product");
          return;
        }

        const fetchedProduct = productResult.product;
        setProduct(fetchedProduct);
        setSelectedImage(getProductImageUrl(fetchedProduct));

        if (fetchedProduct.category?._id) {
          const relatedResult = await handleGetProductsByCategory(
            fetchedProduct.category._id,
          );

          if (relatedResult.success && relatedResult.products) {
            const related = relatedResult.products
              .filter((p: any) => p._id !== productId)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newValue = prev + delta;
      if (newValue < 1) return 1;
      if (product && newValue > product.stock) return product.stock;
      return newValue;
    });
  };

  const handleAddToCartClick = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      const result = await handleAddToCart({
        productId: product._id,
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
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!product) return;

    try {
      const result = await handleAddToCart({
        productId: product._id,
        quantity,
      });

      if (result.success) {
        router.push("/auth/cart");
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
    }
  };

  const handleQuickAddToCart = async (
    e: React.MouseEvent,
    relatedProduct: RelatedProduct,
  ) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const result = await handleAddToCart({
        productId: relatedProduct._id,
        quantity: 1,
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
    }
  };

  const Snackbar = ({ message, type }: SnackbarState) => {
    if (!type) return null;
    return (
      <div
        className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 transform animate-slide-up ${
          type === "success" ? "bg-green-600" : "bg-red-600"
        } text-white`}
      >
        {message}
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

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-crimsonpro bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Product not found"}</p>
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

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const savings = getSavings(product.price, product.discount);
  const productImageUrl = getProductImageUrl(product);
  const inStock = product.stock > 0;
  const stockStatus = inStock
    ? product.stock < 10
      ? `Only ${product.stock} left in stock`
      : "In Stock"
    : "Out of Stock";

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
            {product.category && (
              <>
                <Link
                  href={`/auth/categories/${product.category._id}`}
                  className="text-gray-500 hover:text-green-800"
                >
                  {product.category.name}
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
              </>
            )}
            <span className="text-green-800 font-medium line-clamp-1">
              {product.name}
            </span>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-800 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden aspect-square p-4">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder-product.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Package size={96} className="text-gray-400" />
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => {
                    const thumbUrl = `${baseUrl}/uploads/product-images/${img.split(/[\\/]/).pop()}`;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(thumbUrl)}
                        className={`w-20 h-20 rounded-xl border-2 overflow-hidden ${
                          selectedImage === thumbUrl
                            ? "border-green-800"
                            : "border-gray-200 hover:border-green-400"
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                {product.brand && (
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
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
                    </div>
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.sold || 0} sold)
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">|</span>
                  <span
                    className={`text-sm font-medium ${
                      inStock ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {stockStatus}
                  </span>
                </div>
              </div>

              <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-green-800">
                    {formatCurrency(discountedPrice)}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    You save: {formatCurrency(savings)}
                  </p>
                )}
              </div>

              {product.shortDescription && (
                <div className="text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.weight &&
                    `${product.weight} ${product.unitType || ""}`}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCartClick}
                  disabled={!inStock || isAddingToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-800 text-white font-medium rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FFDE7C] text-black font-medium rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={18} />
                  Buy Now
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-4 py-3 border border-gray-200 rounded-xl hover:border-green-800 transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={18} className="text-green-700" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={18} className="text-green-700" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw size={18} className="text-green-700" />
                  <span>7 Days Return</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm text-gray-500">Share:</span>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden mb-12">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "description"
                    ? "text-green-800 border-b-2 border-green-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "specifications"
                    ? "text-green-800 border-b-2 border-green-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "text-green-800 border-b-2 border-green-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.fullDescription || product.description}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Brand</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.brand || "Generic"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Category</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.category?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">
                        Weight/Volume
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.weight || "N/A"} {product.unitType || ""}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Stock</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Sold</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.sold || 0} units
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Added</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-8">
                  <Star size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    No reviews yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Be the first to review this product
                  </p>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-800 to-emerald-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Related Products
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm ml-3">
                    You might also like these
                  </p>
                </div>
                {product.category && (
                  <Link
                    href={`/auth/categories/${product.category._id}`}
                    className="font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100"
                    style={{ color: "#0B3D0B" }}
                  >
                    View All <ChevronRight size={18} />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((related, index) => {
                  const relatedImageUrl = getProductImageUrl(related);
                  const relatedDiscounted = getDiscountedPrice(
                    related.price,
                    related.discount,
                  );

                  return (
                    <Link
                      key={related._id}
                      href={`/auth/products/${related._id}`}
                      className="group bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`,
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden bg-white p-3">
                        {relatedImageUrl ? (
                          <img
                            src={relatedImageUrl}
                            alt={related.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/placeholder-product.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Package size={32} className="text-gray-400" />
                          </div>
                        )}
                        {related.discount && related.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            {related.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                          {related.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-green-800">
                              {formatCurrency(relatedDiscounted)}
                            </span>
                            {related.discount && related.discount > 0 && (
                              <span className="text-xs text-gray-400 line-through ml-1">
                                {formatCurrency(related.price)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, related)}
                            className="w-7 h-7 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center"
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Snackbar message={snackbar.message} type={snackbar.type} />

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
