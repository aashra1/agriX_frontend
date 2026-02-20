// lib/api/wallet.ts
import axiosInstance from "./axios";

export interface WalletBalance {
  balance: number;
  currency: string;
}

export interface Transaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  reference: string;
  description: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  success: boolean;
  message?: string;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface WalletBalanceResponse {
  success: boolean;
  message?: string;
  data: WalletBalance;
}

export const getBusinessWalletBalance =
  async (): Promise<WalletBalanceResponse> => {
    try {
      console.log("🔵 Calling getBusinessWalletBalance");
      const response = await axiosInstance.get("/api/wallets/business/balance");
      console.log("✅ getBusinessWalletBalance response:", response.status);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching business wallet balance:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
        data: { balance: 0, currency: "NPR" },
      };
    }
  };

export const getBusinessTransactions = async (
  page: number = 1,
  limit: number = 10,
): Promise<TransactionsResponse> => {
  try {
    console.log(
      `🔵 Calling getBusinessTransactions with page=${page}, limit=${limit}`,
    );
    const response = await axiosInstance.get(
      `/api/wallets/business/transactions?page=${page}&limit=${limit}`,
    );
    console.log("✅ getBusinessTransactions response:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching business transactions:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
    });
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
      data: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
};

export const getUserWalletBalance =
  async (): Promise<WalletBalanceResponse> => {
    try {
      const response = await axiosInstance.get("/api/wallets/balance");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user wallet balance:", error);
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
        data: { balance: 0, currency: "NPR" },
      };
    }
  };

export const getUserTransactions = async (
  page: number = 1,
  limit: number = 10,
): Promise<TransactionsResponse> => {
  try {
    const response = await axiosInstance.get(
      `/api/wallets/transactions?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user transactions:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
      data: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
};
