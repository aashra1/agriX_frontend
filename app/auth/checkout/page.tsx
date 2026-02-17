"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  ShoppingCart,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  Building,
  Package,
} from "lucide-react";
import UserSidebar from "../_components/UserSidebar";
import UserHeader from "../_components/UserHeader";
import { getCart } from "@/lib/api/cart";
import { createOrder } from "@/lib/api/order";

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

type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
};

type PaymentMethod = "cod" | "khalti";

type CreateOrderData = {
  items: {
    product: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    business: string;
    image?: string;
  }[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      fullName: user?.fullName || user?.name || "",
      phone: user?.phoneNumber || user?.phone || "",
      addressLine1: "123 Main Street",
      city: "Kathmandu",
      state: "Bagmati",
      postalCode: "44600",
      isDefault: true,
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState<string>("0");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: user?.fullName || user?.name || "",
    phone: user?.phoneNumber || user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [khaltiProcessing, setKhaltiProcessing] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(
        () => setSnackbar({ message: "", type: null }),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

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

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((acc, item) => acc + getItemPrice(item), 0);
  };

  const calculateShipping = () => {
    return 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.13;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleAddNewAddress = () => {
    setAddresses([...addresses, { ...newAddress, isDefault: false }]);
    setSelectedAddress(addresses.length.toString());
    setShowNewAddressForm(false);
    setNewAddress({
      fullName: user?.fullName || user?.name || "",
      phone: user?.phoneNumber || user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
    });
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;

    if (paymentMethod === "cod") {
      await handleCodOrder();
    } else if (paymentMethod === "khalti") {
      await handleKhaltiPayment();
    }
  };

  const handleCodOrder = async () => {
    setProcessing(true);
    try {
      if (!cart) return;

      const orderData: CreateOrderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          discount: item.product.discount || 0,
          quantity: item.quantity,
          business: item.product.business._id,
          image: item.product.image,
        })),
        shippingAddress: addresses[parseInt(selectedAddress)],
        paymentMethod: "cod",
      };

      const response = await createOrder(orderData);

      setSnackbar({
        message: "Order placed successfully!",
        type: "success",
      });

      setTimeout(() => {
        router.push(`/auth/orders/${response.order._id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Error placing order:", error);
      setSnackbar({
        message: error.message || "Failed to place order",
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleKhaltiPayment = async () => {
    setKhaltiProcessing(true);
    try {
      if (!cart) return;

      // No need to get token from localStorage anymore
      // The cookie will be sent automatically with the request

      const orderData: CreateOrderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          discount: item.product.discount || 0,
          quantity: item.quantity,
          business: item.product.business._id,
          image: item.product.image,
        })),
        shippingAddress: addresses[parseInt(selectedAddress)],
        paymentMethod: "khalti",
      };

      const orderResponse = await createOrder(orderData);
      const order = orderResponse.order;

      // Use the API route we just created
      const initiateResponse = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: calculateTotal(),
          returnUrl: `${window.location.origin}/auth/payment/verify`,
        }),
      });

      const initiateData = await initiateResponse.json();

      if (!initiateResponse.ok) {
        if (initiateResponse.status === 401) {
          // Redirect to login if unauthorized
          router.push("/auth/login?redirect=checkout");
          return;
        }
        throw new Error(initiateData.message || "Failed to initiate payment");
      }

      if (initiateData.success) {
        window.location.href = initiateData.data.paymentUrl;
      } else {
        throw new Error(
          initiateData.message || "Failed to initiate Khalti payment",
        );
      }
    } catch (error: any) {
      console.error("Error with Khalti payment:", error);
      setSnackbar({
        message: error.message || "Failed to process Khalti payment",
        type: "error",
      });
      setKhaltiProcessing(false);
    }
  };

  const Snackbar = () => {
    if (!snackbar.type) return null;
    return (
      <div
        className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-right-5 duration-300 ${
          snackbar.type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {snackbar.type === "success" ? (
          <CheckCircle2 size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
        <span className="text-sm font-medium">{snackbar.message}</span>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
        <Loader2 className="animate-spin text-green-800" size={40} />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40 font-crimsonpro">
        <UserSidebar activePage="My Cart" />
        <main className="flex-1 overflow-x-hidden">
          <UserHeader />
          <div className="p-8 max-w-7xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-16">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Add items to your cart before checkout
              </p>
              <Link
                href="/auth/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <Link
              href="/auth/cart"
              className="text-gray-500 hover:text-green-800"
            >
              Cart
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-green-800 font-medium">Checkout</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-500 mt-1">Complete your purchase</p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-800 border border-gray-200 rounded-xl hover:border-green-800 transition-all"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Cart</span>
            </button>
          </div>

          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-green-800 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div
                className={`w-24 h-1 ${
                  step >= 2 ? "bg-green-800" : "bg-gray-200"
                }`}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-green-800 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <div
                className={`w-24 h-1 ${
                  step >= 3 ? "bg-green-800" : "bg-gray-200"
                }`}
              />
            </div>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-green-800 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin size={20} className="text-green-800" />
                      Shipping Address
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {addresses.map((addr, index) => (
                        <label
                          key={index}
                          className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                            selectedAddress === index.toString()
                              ? "border-green-800 bg-green-50/50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={index}
                            checked={selectedAddress === index.toString()}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {addr.fullName}
                              </span>
                              {addr.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {addr.addressLine1}
                            </p>
                            {addr.addressLine2 && (
                              <p className="text-sm text-gray-600">
                                {addr.addressLine2}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} {addr.postalCode}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                              <Phone size={14} />
                              {addr.phone}
                            </p>
                          </div>
                        </label>
                      ))}

                      {!showNewAddressForm ? (
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-800 hover:text-green-800 transition-colors"
                        >
                          + Add New Address
                        </button>
                      ) : (
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            New Address
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={newAddress.fullName}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      fullName: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="tel"
                                  value={newAddress.phone}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      phone: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Address Line 1
                              </label>
                              <input
                                type="text"
                                value={newAddress.addressLine1}
                                onChange={(e) =>
                                  setNewAddress({
                                    ...newAddress,
                                    addressLine1: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Address Line 2 (Optional)
                              </label>
                              <input
                                type="text"
                                value={newAddress.addressLine2}
                                onChange={(e) =>
                                  setNewAddress({
                                    ...newAddress,
                                    addressLine2: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  City
                                </label>
                                <input
                                  type="text"
                                  value={newAddress.city}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      city: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  State
                                </label>
                                <input
                                  type="text"
                                  value={newAddress.state}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      state: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Postal Code
                                </label>
                                <input
                                  type="text"
                                  value={newAddress.postalCode}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      postalCode: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-green-800"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={handleAddNewAddress}
                                className="px-6 py-2 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                              >
                                Save Address
                              </button>
                              <button
                                onClick={() => setShowNewAddressForm(false)}
                                className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard size={20} className="text-green-800" />
                      Payment Method
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <label
                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-green-800 bg-green-50/50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as PaymentMethod)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Truck size={20} className="text-green-800" />
                            <span className="font-semibold text-gray-900">
                              Cash on Delivery
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Pay when you receive your order
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === "khalti"
                            ? "border-green-800 bg-green-50/50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="khalti"
                          checked={paymentMethod === "khalti"}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as PaymentMethod)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <img
                              src="/khalti-logo.png"
                              alt="Khalti"
                              className="w-5 h-5 object-contain"
                            />
                            <span className="font-semibold text-gray-900">
                              Khalti
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Pay via Khalti wallet
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Back to Address
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Package size={20} className="text-green-800" />
                      Review Your Order
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {cart?.items.map((item) => (
                        <div key={item._id} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                            {getProductImageUrl(item.product.image) ? (
                              <img
                                src={getProductImageUrl(item.product.image)!}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-800">
                              {formatCurrency(getItemPrice(item))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Truck size={18} />
                        <span className="font-medium">Delivery Address</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {addresses[parseInt(selectedAddress)]?.fullName}
                        <br />
                        {addresses[parseInt(selectedAddress)]?.addressLine1}
                        <br />
                        {addresses[parseInt(selectedAddress)]?.city},{" "}
                        {addresses[parseInt(selectedAddress)]?.state}{" "}
                        {addresses[parseInt(selectedAddress)]?.postalCode}
                        <br />
                        Phone: {addresses[parseInt(selectedAddress)]?.phone}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <CreditCard size={18} />
                        <span className="font-medium">Payment Method</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        {paymentMethod === "cod" ? (
                          <>
                            <Truck size={16} className="text-green-600" />
                            Cash on Delivery
                          </>
                        ) : (
                          <>
                            <img
                              src="/khalti-logo.png"
                              alt="Khalti"
                              className="w-4 h-4 object-contain"
                            />
                            Khalti
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Back to Payment
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={processing || khaltiProcessing}
                        className="px-8 py-3 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processing || khaltiProcessing ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>
                              {khaltiProcessing
                                ? "Redirecting to Khalti..."
                                : "Placing Order..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={18} />
                            <span>
                              {paymentMethod === "cod"
                                ? "Place Order"
                                : "Pay with Khalti"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({cart?.totalItems || 0} items)
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (13% VAT)</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(calculateTax())}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-800">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-green-700" />
                    <span>Secure payment guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-green-700" />
                    <span>Delivery within 3-5 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Snackbar />
    </div>
  );
}
