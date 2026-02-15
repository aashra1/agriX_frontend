"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  AlertCircle,
} from "lucide-react";
import UserSidebar from "../_components/UserSidebar";
import UserHeader from "../_components/UserHeader";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/lib/api/cart";

type CartItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    image?: string;
    stock: number;
    business: {
      _id: string;
      businessName: string;
    };
  };
  quantity: number;
  price: number;
  discount: number;
};

type Cart = {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
};

type SnackbarState = {
  message: string;
  type: "success" | "error" | null;
};

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  // Auto-hide snackbar
  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(() => {
        setSnackbar({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getCart();
        setCart(response.cart);
      } catch (error: any) {
        console.error("Error fetching cart:", error);
        setSnackbar({
          message: error.message || "Failed to load cart",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  const getProductImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    const fileName = imagePath.split(/[\\/]/).pop();
    return `${baseUrl}/uploads/product-images/${fileName}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getItemPrice = (item: CartItem) => {
    const price = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return price * item.quantity;
  };

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;

    setUpdatingItems((prev) => new Set(prev).add(item.product._id));

    try {
      const response = await updateCartItem(item.product._id, {
        quantity: newQuantity,
      });
      setCart(response.cart);
    } catch (error: any) {
      console.error("Error updating cart:", error);
      setSnackbar({
        message: error.message || "Failed to update cart",
        type: "error",
      });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.product._id);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));

    try {
      const response = await removeFromCart(productId);
      setCart(response.cart);
      setSnackbar({
        message: "Item removed from cart",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error removing item:", error);
      setSnackbar({
        message: error.message || "Failed to remove item",
        type: "error",
      });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!cart?.items.length) return;

    try {
      const response = await clearCart();
      setCart(response.cart);
      setSnackbar({
        message: "Cart cleared successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      setSnackbar({
        message: error.message || "Failed to clear cart",
        type: "error",
      });
    }
  };

  const handleCheckout = () => {
    router.push("/auth/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/auth/dashboard");
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

  if (authLoading || loading) {
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

  const isCartEmpty = !cart || cart.items.length === 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
      <UserSidebar activePage="My Cart" />

      <main className="flex-1 overflow-x-hidden">
        <UserHeader />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/auth/dashboard"
              className="text-gray-500 hover:text-green-800"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">My Cart</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-500 text-lg">
                {cart?.totalItems || 0}{" "}
                {cart?.totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            {!isCartEmpty && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
                Clear Cart
              </button>
            )}
          </div>

          {isCartEmpty ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-16 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={64} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to add items.
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-green-800 text-white font-medium rounded-xl hover:bg-green-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  const itemImageUrl = getProductImageUrl(item.product.image);
                  const isUpdating = updatingItems.has(item.product._id);
                  const itemTotal = getItemPrice(item);
                  const maxStock = item.product.stock;

                  return (
                    <div
                      key={item._id}
                      className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <Link
                          href={`/auth/products/${item.product._id}`}
                          className="shrink-0 w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                        >
                          {itemImageUrl ? (
                            <img
                              src={itemImageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/placeholder-product.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={32} className="text-gray-400" />
                            </div>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <Link
                              href={`/auth/products/${item.product._id}`}
                              className="font-semibold text-gray-900 hover:text-green-800 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={isUpdating}
                              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <p className="text-sm text-gray-500 mb-3">
                            Seller: {item.product.business.businessName}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600">
                                Qty:
                              </span>
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={item.quantity <= 1 || isUpdating}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium">
                                  {isUpdating ? (
                                    <div className="w-4 h-4 border-2 border-green-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item,
                                      item.quantity + 1,
                                    )
                                  }
                                  disabled={
                                    item.quantity >= maxStock || isUpdating
                                  }
                                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              {item.quantity >= maxStock && (
                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  Max stock
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              {item.product.discount ? (
                                <>
                                  <p className="text-lg font-bold text-green-800">
                                    {formatCurrency(itemTotal)}
                                  </p>
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatCurrency(
                                      item.product.price * item.quantity,
                                    )}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    {item.product.discount}% off
                                  </p>
                                </>
                              ) : (
                                <p className="text-lg font-bold text-green-800">
                                  {formatCurrency(itemTotal)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(cart.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(0)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-green-800">
                          {formatCurrency(cart.totalAmount)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Including all taxes
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-800 text-white py-4 rounded-xl font-medium hover:bg-green-900 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-medium hover:border-green-800 hover:text-green-800 transition-colors"
                  >
                    Continue Shopping
                  </button>

                  {/* Delivery Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <Truck size={18} className="text-green-700" />
                      <span>Free delivery on all orders</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <Shield size={18} className="text-green-700" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <RotateCcw size={18} className="text-green-700" />
                      <span>7 days return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Snackbar message={snackbar.message} type={snackbar.type} />

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}
