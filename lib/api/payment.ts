// lib/api/payment.ts
import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface KhaltiInitiateData {
  orderId: string;
  amount: number;
  returnUrl: string;
}

export interface KhaltiVerifyData {
  pidx: string;
  orderId: string;
}

export interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "khalti";
  transactionId?: string;
  pidx?: string;
  paymentUrl?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InitiateKhaltiResponse {
  success: boolean;
  message?: string;
  data?: {
    payment: Payment;
    paymentUrl: string;
    pidx: string;
  };
}

export interface VerifyKhaltiResponse {
  success: boolean;
  message?: string;
  data?: {
    success: boolean;
    message: string;
    payment: Payment;
  };
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: Payment | Payment[];
  payment?: Payment;
  payments?: Payment[];
  page?: number;
  limit?: number;
  count?: number;
}

export const initiateKhaltiPayment = async (
  data: KhaltiInitiateData,
): Promise<InitiateKhaltiResponse> => {
  try {
    const response = await axiosInstance.post(
      API.PAYMENT.KHALTI_INITIATE,
      data,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error initiating Khalti payment:", error);
    throw error;
  }
};

export const verifyKhaltiPayment = async (
  data: KhaltiVerifyData,
): Promise<VerifyKhaltiResponse> => {
  try {
    const response = await axiosInstance.post(API.PAYMENT.KHALTI_VERIFY, data);
    return response.data;
  } catch (error: any) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
};

export const khaltiWebhook = async (
  data: any,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.post(API.PAYMENT.WEBHOOK, data);
    return response.data;
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    throw error;
  }
};

export const getPaymentByOrderId = async (
  orderId: string,
): Promise<PaymentResponse> => {
  try {
    const response = await axiosInstance.get(API.PAYMENT.GET_BY_ORDER(orderId));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};

export const getUserPayments = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<PaymentResponse> => {
  try {
    let url = `${API.PAYMENT.GET_USER}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user payments:", error);
    throw error;
  }
};

export const getAllPayments = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<PaymentResponse> => {
  try {
    let url = `${API.PAYMENT.GET_ALL}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};
