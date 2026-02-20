"use server";

import {
  createOrder,
  getUserOrders,
  getOrderById,
  getBusinessOrders,
  updateOrderStatus,
  updatePaymentStatus,
  CreateOrderData,
  UpdateOrderStatusData,
  UpdatePaymentStatusData,
  OrderResponse,
} from "../api/order";

export interface OrderActionResult {
  success: boolean;
  message?: string;
  order?: any;
  orders?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const handleCreateOrder = async (
  data: CreateOrderData,
): Promise<OrderActionResult> => {
  try {
    const result = await createOrder(data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Order created successfully",
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create order",
    };
  } catch (err: any) {
    console.error("Error in handleCreateOrder:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to create order",
    };
  }
};

export const handleGetUserOrders = async (
  page: number = 1,
  limit: number = 10,
): Promise<OrderActionResult> => {
  try {
    const result = await getUserOrders(page, limit);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Orders fetched successfully",
        orders: result.orders || [],
        pagination: result.pagination,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch orders",
      orders: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  } catch (err: any) {
    console.error("Error in handleGetUserOrders:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to fetch orders",
      orders: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
};

export const handleGetOrderById = async (
  orderId: string,
): Promise<OrderActionResult> => {
  try {
    const result = await getOrderById(orderId);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Order fetched successfully",
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch order",
    };
  } catch (err: any) {
    console.error("Error in handleGetOrderById:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to fetch order",
    };
  }
};

export const handleGetBusinessOrders = async (
  page: number = 1,
  limit: number = 10,
): Promise<OrderActionResult> => {
  try {
    const result = await getBusinessOrders(page, limit);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Business orders fetched successfully",
        orders: result.orders || [],
        pagination: result.pagination,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch business orders",
      orders: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  } catch (err: any) {
    console.error("Error in handleGetBusinessOrders:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch business orders",
      orders: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
};

export const handleUpdateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusData,
): Promise<OrderActionResult> => {
  try {
    const result = await updateOrderStatus(orderId, data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Order status updated successfully",
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update order status",
    };
  } catch (err: any) {
    console.error("Error in handleUpdateOrderStatus:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to update order status",
    };
  }
};

export const handleUpdatePaymentStatus = async (
  orderId: string,
  data: UpdatePaymentStatusData,
): Promise<OrderActionResult> => {
  try {
    const result = await updatePaymentStatus(orderId, data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Payment status updated successfully",
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update payment status",
    };
  } catch (err: any) {
    console.error("Error in handleUpdatePaymentStatus:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to update payment status",
    };
  }
};
