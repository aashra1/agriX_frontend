import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface CartItem {
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
  name?: string;
  image?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  cart?: Cart;
  count?: number;
}

export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.get(API.CART.GET);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch cart",
    };
  }
};

export const addToCart = async (data: AddToCartData): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.post(API.CART.ADD, data);
    return response.data;
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to add to cart",
    };
  }
};

export const updateCartItem = async (
  productId: string,
  data: UpdateCartItemData,
): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.put(API.CART.UPDATE(productId), data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to update cart",
    };
  }
};

export const removeFromCart = async (
  productId: string,
): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.delete(API.CART.REMOVE(productId));
    return response.data;
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to remove from cart",
    };
  }
};

export const clearCart = async (): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.delete(API.CART.CLEAR);
    return response.data;
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to clear cart",
    };
  }
};

export const getCartCount = async (): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.get(API.CART.COUNT);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cart count:", error);
    return {
      success: false,
      count: 0,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch cart count",
    };
  }
};
