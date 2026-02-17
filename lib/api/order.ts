import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  business: string;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card" | "esewa" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card" | "esewa" | "khalti";
  notes?: string;
}

export interface UpdateOrderStatusData {
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
}

export interface UpdatePaymentStatusData {
  paymentStatus: "pending" | "paid" | "failed";
}

export const createOrder = async (
  data: CreateOrderData,
): Promise<{ success: boolean; message: string; order: Order }> => {
  try {
    const response = await axiosInstance.post(API.ORDER.CREATE, data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getUserOrders = async (
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  try {
    const response = await axiosInstance.get(
      `${API.ORDER.GET_USER}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const getOrderById = async (
  orderId: string,
): Promise<{ success: boolean; order: Order }> => {
  try {
    const response = await axiosInstance.get(API.ORDER.GET_BY_ID(orderId));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const getBusinessOrders = async (
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  try {
    const response = await axiosInstance.get(
      `${API.ORDER.GET_BUSINESS}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching business orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusData,
): Promise<{ success: boolean; message: string; order: Order }> => {
  try {
    const response = await axiosInstance.put(
      API.ORDER.UPDATE_STATUS(orderId),
      data,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  orderId: string,
  data: UpdatePaymentStatusData,
): Promise<{ success: boolean; message: string; order: Order }> => {
  try {
    const response = await axiosInstance.put(
      API.ORDER.UPDATE_PAYMENT(orderId),
      data,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};
