"use server";

import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  khaltiWebhook,
  getPaymentByOrderId,
  getUserPayments,
  getAllPayments,
  KhaltiInitiateData,
  KhaltiVerifyData,
} from "../api/payment";

export interface PaymentActionResult {
  success: boolean;
  message?: string;
  data?: any;
  payment?: any;
  payments?: any[];
  page?: number;
  limit?: number;
  count?: number;
}

export const handleInitiateKhaltiPayment = async (
  data: KhaltiInitiateData,
): Promise<PaymentActionResult> => {
  try {
    const result = await initiateKhaltiPayment(data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Payment initiated successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to initiate payment",
    };
  } catch (err: any) {
    console.error("Error in handleInitiateKhaltiPayment:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to initiate payment",
    };
  }
};

export const handleVerifyKhaltiPayment = async (
  data: KhaltiVerifyData,
): Promise<PaymentActionResult> => {
  try {
    const result = await verifyKhaltiPayment(data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Payment verified successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to verify payment",
    };
  } catch (err: any) {
    console.error("Error in handleVerifyKhaltiPayment:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to verify payment",
    };
  }
};

export const handleKhaltiWebhook = async (
  data: any,
): Promise<PaymentActionResult> => {
  try {
    const result = await khaltiWebhook(data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Webhook processed successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to process webhook",
    };
  } catch (err: any) {
    console.error("Error in handleKhaltiWebhook:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to process webhook",
    };
  }
};

export const handleGetPaymentByOrderId = async (
  orderId: string,
): Promise<PaymentActionResult> => {
  try {
    const result = await getPaymentByOrderId(orderId);

    if (result.success) {
      // Handle single payment
      const paymentData = result.payment || result.data;
      return {
        success: true,
        message: result.message || "Payment fetched successfully",
        payment: paymentData,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch payment",
    };
  } catch (err: any) {
    console.error("Error in handleGetPaymentByOrderId:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch payment",
    };
  }
};

export const handleGetUserPayments = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<PaymentActionResult> => {
  try {
    const result = await getUserPayments(page, limit, status);

    if (result.success) {
      // Handle payments array
      let paymentsArray: any[] = [];

      if (result.payments && Array.isArray(result.payments)) {
        paymentsArray = result.payments;
      } else if (result.data && Array.isArray(result.data)) {
        paymentsArray = result.data;
      } else if (result.data && !Array.isArray(result.data)) {
        paymentsArray = [result.data];
      }

      return {
        success: true,
        message: result.message || "Payments fetched successfully",
        payments: paymentsArray,
        page: result.page,
        limit: result.limit,
        count: result.count || paymentsArray.length,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch payments",
      payments: [],
    };
  } catch (err: any) {
    console.error("Error in handleGetUserPayments:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch payments",
      payments: [],
    };
  }
};

export const handleGetAllPayments = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<PaymentActionResult> => {
  try {
    const result = await getAllPayments(page, limit, status);

    if (result.success) {
      // Handle payments array
      let paymentsArray: any[] = [];

      if (result.payments && Array.isArray(result.payments)) {
        paymentsArray = result.payments;
      } else if (result.data && Array.isArray(result.data)) {
        paymentsArray = result.data;
      } else if (result.data && !Array.isArray(result.data)) {
        paymentsArray = [result.data];
      }

      return {
        success: true,
        message: result.message || "Payments fetched successfully",
        payments: paymentsArray,
        page: result.page,
        limit: result.limit,
        count: result.count || paymentsArray.length,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch payments",
      payments: [],
    };
  } catch (err: any) {
    console.error("Error in handleGetAllPayments:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch payments",
      payments: [],
    };
  }
};
