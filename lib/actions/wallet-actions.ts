"use server";

import {
  getBusinessWalletBalance,
  getBusinessTransactions,
  getUserWalletBalance,
  getUserTransactions,
} from "../api/wallet";

export interface WalletBalanceResult {
  success: boolean;
  message?: string;
  data: {
    balance: number;
    currency: string;
  };
}

export interface TransactionsResult {
  success: boolean;
  message?: string;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const handleGetBusinessWalletBalance =
  async (): Promise<WalletBalanceResult> => {
    try {
      const result = await getBusinessWalletBalance();

      if (result.success) {
        return {
          success: true,
          message: "Wallet balance fetched successfully",
          data: result.data || { balance: 0, currency: "NPR" },
        };
      }

      return {
        success: false,
        message: result.message || "Failed to fetch wallet balance",
        data: { balance: 0, currency: "NPR" },
      };
    } catch (err: any) {
      console.error("Error in handleGetBusinessWalletBalance:", err);
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err.message ||
          "Failed to fetch wallet balance",
        data: { balance: 0, currency: "NPR" },
      };
    }
  };

export const handleGetBusinessTransactions = async (
  page: number = 1,
  limit: number = 10,
): Promise<TransactionsResult> => {
  try {
    const result = await getBusinessTransactions(page, limit);

    if (result.success) {
      return {
        success: true,
        message: "Transactions fetched successfully",
        data: result.data || [],
        pagination: result.pagination || { page, limit, total: 0, pages: 1 },
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch transactions",
      data: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  } catch (err: any) {
    console.error("Error in handleGetBusinessTransactions:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch transactions",
      data: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
};

export const handleGetUserWalletBalance =
  async (): Promise<WalletBalanceResult> => {
    try {
      const result = await getUserWalletBalance();

      if (result.success) {
        return {
          success: true,
          message: "Wallet balance fetched successfully",
          data: result.data || { balance: 0, currency: "NPR" },
        };
      }

      return {
        success: false,
        message: result.message || "Failed to fetch wallet balance",
        data: { balance: 0, currency: "NPR" },
      };
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err.message ||
          "Failed to fetch wallet balance",
        data: { balance: 0, currency: "NPR" },
      };
    }
  };

export const handleGetUserTransactions = async (
  page: number = 1,
  limit: number = 10,
): Promise<TransactionsResult> => {
  try {
    const result = await getUserTransactions(page, limit);

    if (result.success) {
      return {
        success: true,
        message: "Transactions fetched successfully",
        data: result.data || [],
        pagination: result.pagination || { page, limit, total: 0, pages: 1 },
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch transactions",
      data: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch transactions",
      data: [],
      pagination: { page, limit, total: 0, pages: 1 },
    };
  }
};
