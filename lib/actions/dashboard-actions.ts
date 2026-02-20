"use server";

import { getAuthToken } from "@/lib/cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

export interface DashboardActionResult {
  success: boolean;
  message?: string;
  products: any[];
  orders: any[];
  wallet: {
    balance: number;
    currency: string;
  };
}

export const handleGetBusinessDashboard =
  async (): Promise<DashboardActionResult> => {
    try {
      const token = await getAuthToken();

      if (!token) {
        return {
          success: false,
          message: "No authentication token found",
          products: [],
          orders: [],
          wallet: { balance: 0, currency: "NPR" },
        };
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let products = [];
      try {
        const productsRes = await fetch(`${BASE_URL}/api/product/business`, {
          headers,
          cache: "no-store",
        });

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          products = productsData.products || productsData.data || [];
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      let orders = [];
      try {
        const ordersRes = await fetch(
          `${BASE_URL}/api/order/business/orders?page=1&limit=10`,
          {
            headers,
            cache: "no-store",
          },
        );

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          orders = ordersData.orders || [];
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }

      let wallet = { balance: 0, currency: "NPR" };
      try {
        const walletRes = await fetch(
          `${BASE_URL}/api/wallets/business/balance`,
          {
            headers,
            cache: "no-store",
          },
        );

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          wallet = walletData.data || { balance: 0, currency: "NPR" };
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }

      return {
        success: true,
        message: "Dashboard data fetched",
        products,
        orders,
        wallet,
      };
    } catch (err: any) {
      console.error("Error in handleGetBusinessDashboard:", err);
      return {
        success: false,
        message: err.message || "Failed to fetch dashboard",
        products: [],
        orders: [],
        wallet: { balance: 0, currency: "NPR" },
      };
    }
  };
