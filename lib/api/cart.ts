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

export const getCart = async (): Promise<{ success: boolean; cart: Cart }> => {
  try {
    const response = await axiosInstance.get(API.CART.GET);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const addToCart = async (
  data: AddToCartData,
): Promise<{ success: boolean; message: string; cart: Cart }> => {
  try {
    const response = await axiosInstance.post(API.CART.ADD, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateCartItem = async (
  productId: string,
  data: UpdateCartItemData,
): Promise<{ success: boolean; message: string; cart: Cart }> => {
  try {
    const response = await axiosInstance.put(API.CART.UPDATE(productId), data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const removeFromCart = async (
  productId: string,
): Promise<{ success: boolean; message: string; cart: Cart }> => {
  try {
    const response = await axiosInstance.delete(API.CART.REMOVE(productId));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const clearCart = async (): Promise<{
  success: boolean;
  message: string;
  cart: Cart;
}> => {
  try {
    const response = await axiosInstance.delete(API.CART.CLEAR);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCartCount = async (): Promise<{
  success: boolean;
  count: number;
}> => {
  try {
    const response = await axiosInstance.get(API.CART.COUNT);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
