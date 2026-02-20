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
  Package,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import UserSidebar from "../_components/UserSidebar";
import UserHeader from "../_components/UserHeader";

import {
  handleGetCart,
  handleUpdateCartItem,
  handleRemoveFromCart,
  handleClearCart,
} from "@/lib/actions/cart-actions";

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

  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(() => {
        setSnackbar({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const result = await handleGetCart();
        if (result.success) {
          setCart(result.cart);
        } else {
          setSnackbar({
            message: result.message || "Failed to load cart",
            type: "error",
          });
        }
      } catch (error: any) {
        setSnackbar({ message: "An unexpected error occurred", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCartData();
  }, [user]);

  const onUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;

    setUpdatingItems((prev) => new Set(prev).add(item.product._id));
    try {
      const result = await handleUpdateCartItem(item.product._id, {
        quantity: newQuantity,
      });
      if (result.success) {
        setCart(result.cart);
      } else {
        setSnackbar({
          message: result.message || "Update failed",
          type: "error",
        });
      }
    } catch (error: any) {
      setSnackbar({ message: "Error updating quantity", type: "error" });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.product._id);
        return newSet;
      });
    }
  };

  const onRemoveItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));
    try {
      const result = await handleRemoveFromCart(productId);
      if (result.success) {
        setCart(result.cart);
        setSnackbar({ message: "Item removed", type: "success" });
      } else {
        setSnackbar({
          message: result.message || "Remove failed",
          type: "error",
        });
      }
    } catch (error: any) {
      setSnackbar({ message: "Error removing item", type: "error" });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const onClearCart = async () => {
    if (!cart?.items.length) return;
    try {
      const result = await handleClearCart();
      if (result.success) {
        setCart(result.cart);
        setSnackbar({ message: "Cart cleared", type: "success" });
      } else {
        setSnackbar({
          message: result.message || "Clear failed",
          type: "error",
        });
      }
    } catch (error) {
      setSnackbar({ message: "Error clearing cart", type: "error" });
    }
  };

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
    }).format(amount);
  };

  const getItemPrice = (item: CartItem) => {
    const price = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return price * item.quantity;
  };

  // --- Render Logic ---
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-green-900 border-t-transparent"></div>
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
                onClick={onClearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-xl transition-colors"
              >
                <Trash2 size={18} /> Clear Cart
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
              <button
                onClick={() => router.push("/auth/dashboard")}
                className="px-8 py-3 bg-green-800 text-white font-medium rounded-xl hover:bg-green-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  const itemImageUrl = getProductImageUrl(item.product.image);
                  const isUpdating = updatingItems.has(item.product._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6"
                    >
                      <div className="flex gap-6">
                        <div className="shrink-0 w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border">
                          {itemImageUrl ? (
                            <img
                              src={itemImageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={32} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {item.product.name}
                            </h3>
                            <button
                              onClick={() => onRemoveItem(item.product._id)}
                              disabled={isUpdating}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Seller: {item.product.business.businessName}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(item, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1 || isUpdating}
                                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 disabled:opacity-30"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium">
                                  {isUpdating ? "..." : item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(item, item.quantity + 1)
                                  }
                                  disabled={
                                    item.quantity >= item.product.stock ||
                                    isUpdating
                                  }
                                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 disabled:opacity-30"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              {item.quantity >= item.product.stock && (
                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                  <AlertCircle size={12} /> Max stock
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-800">
                                {formatCurrency(getItemPrice(item))}
                              </p>
                              {item.product.discount && (
                                <p className="text-xs text-green-600">
                                  {item.product.discount}% off
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

              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(cart.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-green-800">
                        {formatCurrency(cart.totalAmount)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/auth/checkout")}
                    className="w-full bg-green-800 text-white py-4 rounded-xl mb-3 hover:bg-green-900"
                  >
                    Proceed to Checkout
                  </button>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Truck size={18} className="text-green-700" /> Free
                      delivery
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Shield size={18} className="text-green-700" /> Secure
                      payment
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <RotateCcw size={18} className="text-green-700" /> 7 days
                      return
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {snackbar.type && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-up text-white ${snackbar.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {snackbar.message}
        </div>
      )}

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
