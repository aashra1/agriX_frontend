"use server";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  AddToCartData,
  UpdateCartItemData,
} from "../api/cart";

export interface CartActionResult {
  success: boolean;
  message?: string;
  cart?: any;
  count?: number;
}

export const handleGetCart = async (): Promise<CartActionResult> => {
  try {
    const result = await getCart();
    return {
      success: true,
      message: result.message || "Cart fetched successfully",
      cart: result.cart,
    };
  } catch (err: any) {
    console.error("Error in handleGetCart:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to fetch cart",
    };
  }
};

export const handleAddToCart = async (
  data: AddToCartData,
): Promise<CartActionResult> => {
  try {
    const result = await addToCart(data);
    return {
      success: true,
      message: result.message || "Item added to cart successfully",
      cart: result.cart,
    };
  } catch (err: any) {
    console.error("Error in handleAddToCart:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to add item to cart",
    };
  }
};

export const handleUpdateCartItem = async (
  productId: string,
  data: UpdateCartItemData,
): Promise<CartActionResult> => {
  try {
    const result = await updateCartItem(productId, data);
    return {
      success: true,
      message: result.message || "Cart updated successfully",
      cart: result.cart,
    };
  } catch (err: any) {
    console.error("Error in handleUpdateCartItem:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to update cart",
    };
  }
};

export const handleRemoveFromCart = async (
  productId: string,
): Promise<CartActionResult> => {
  try {
    const result = await removeFromCart(productId);
    return {
      success: true,
      message: result.message || "Item removed from cart successfully",
      cart: result.cart,
    };
  } catch (err: any) {
    console.error("Error in handleRemoveFromCart:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to remove item from cart",
    };
  }
};

export const handleClearCart = async (): Promise<CartActionResult> => {
  try {
    const result = await clearCart();
    return {
      success: true,
      message: result.message || "Cart cleared successfully",
      cart: result.cart,
    };
  } catch (err: any) {
    console.error("Error in handleClearCart:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to clear cart",
    };
  }
};

export const handleGetCartCount = async (): Promise<CartActionResult> => {
  try {
    const result = await getCartCount();
    return {
      success: true,
      count: result.count || 0,
      message: "Cart count fetched successfully",
    };
  } catch (err: any) {
    console.error("Error in handleGetCartCount:", err);
    return {
      success: false,
      count: 0,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch cart count",
    };
  }
};
